import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { theme } from '../theme/theme';
import { fetchMentalHealthQuote } from '../utils/geminiApi';
import { getSimpleQuote } from '../utils/simpleQuoteApi';
import { fallbackQuotes } from '../data/fallbackQuotes';
import { Ionicons } from '@expo/vector-icons';

interface DailyAffirmationProps {
  initialQuote?: string;
  initialAuthor?: string;
}

export default function DailyAffirmation({ 
  initialQuote = fallbackQuotes[0].quote,
  initialAuthor = fallbackQuotes[0].author
}: DailyAffirmationProps) {
  const [quote, setQuote] = useState(initialQuote);
  const [author, setAuthor] = useState(initialAuthor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseQuoteAndAuthor = (text: string) => {
    console.log('Parsing raw text:', text);
    
    // Try different parsing strategies
    
    // Strategy 1: Look for bold markdown format
    const boldPattern = /(.*?)(?:\*\*|__)(.*?)(?:\*\*|__)/s;
    const boldMatch = text.match(boldPattern);
    
    if (boldMatch) {
      console.log('Matched bold pattern');
      return {
        quote: boldMatch[1].trim(),
        author: boldMatch[2].trim()
      };
    }
    
    // Strategy 2: Look for a pattern with a dash or em-dash followed by a name
    const dashPattern = /(.*?)(?:—|–|-)\s*(.*)/s;
    const dashMatch = text.match(dashPattern);
    
    if (dashMatch) {
      console.log('Matched dash pattern');
      return {
        quote: dashMatch[1].trim(),
        author: dashMatch[2].trim()
      };
    }
    
    // Strategy 3: Split by newline and assume last line is author
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length >= 2) {
      const lastLine = lines[lines.length - 1];
      const quoteLines = lines.slice(0, lines.length - 1);
      
      // Check if the last line looks like an author (short, no punctuation at end)
      if (lastLine.length < 50 && !lastLine.match(/[.!?]$/)) {
        console.log('Matched newline pattern');
        return {
          quote: quoteLines.join(' ').trim(),
          author: lastLine.replace(/^[-—–]/, '').trim()
        };
      }
    }
    
    // Strategy 4: Look for common author attribution patterns
    const attributionPatterns = [
      /[""](.+?)[""](?:\s*[-—–]\s*|\s+by\s+|\s+from\s+)(.+)/i,
      /(.+?)(?:\s*[-—–]\s*|\s+by\s+|\s+from\s+)(.+)/i
    ];
    
    for (const pattern of attributionPatterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('Matched attribution pattern');
        return {
          quote: match[1].trim().replace(/^[""]|[""]$/g, ''),
          author: match[2].trim()
        };
      }
    }
    
    // Fallback: If we can't parse it properly, return the whole text as quote
    console.log('No pattern matched, using fallback');
    return {
      quote: text.trim(),
      author: "Unknown"
    };
  };

  const getRandomFallbackQuote = () => {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  };

  const fetchNewQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Trying simple quote API first...');
      const rawQuote = await getSimpleQuote();
      
      if (rawQuote) {
        console.log('Raw quote received:', rawQuote);
        const parsed = parseQuoteAndAuthor(rawQuote);
        setQuote(parsed.quote);
        setAuthor(parsed.author);
        console.log('Quote updated successfully');
      } else {
        console.log('Simple API failed, trying main API...');
        const quoteData = await fetchMentalHealthQuote();
        
        if (quoteData.quote && quoteData.author) {
          setQuote(quoteData.quote);
          setAuthor(quoteData.author);
          console.log('Quote updated successfully from main API');
        } else {
          console.log('Both APIs failed, using fallback quote');
          const fallback = getRandomFallbackQuote();
          setQuote(fallback.quote);
          setAuthor(fallback.author);
        }
      }
    } catch (err) {
      console.error('Failed to fetch quote:', err);
      // Use a fallback quote instead of showing an error
      const fallback = getRandomFallbackQuote();
      setQuote(fallback.quote);
      setAuthor(fallback.author);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a quote when the component mounts
  useEffect(() => {
    console.log('DailyAffirmation component mounted');
    fetchNewQuote();
  }, []);

  const handleRefresh = () => {
    console.log('Refresh button pressed');
    fetchNewQuote();
  };

  return (
    <Pressable 
      style={styles.container}
      onPress={loading ? undefined : handleRefresh}
      disabled={loading}
    >
      <Text style={styles.quoteIcon}>"</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Finding inspiration...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.quote}>{quote}</Text>
          {author && <Text style={styles.author}>— {author}</Text>}
        </>
      )}
      
      <Pressable 
        style={styles.refreshButton}
        onPress={loading ? undefined : handleRefresh}
        disabled={loading}
      >
        <Ionicons 
          name="refresh" 
          size={18} 
          color={theme.colors.primary} 
          style={[styles.refreshIcon, loading && styles.refreshIconSpinning]} 
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary + '22', // 13% opacity
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    position: 'relative',
    minHeight: 120,
  },
  quoteIcon: {
    fontSize: 32,
    color: theme.colors.primary,
    position: 'absolute',
    top: 4,
    left: 10,
    opacity: 0.3,
  },
  quote: {
    fontSize: 15,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  author: {
    fontSize: 13,
    color: theme.colors.subtext,
    marginTop: 8,
    textAlign: 'right',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    minHeight: 80,
  },
  loadingText: {
    marginTop: 8,
    color: theme.colors.subtext,
    fontSize: 14,
  },
  refreshButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    ...theme.shadows.small,
  },
  refreshIcon: {
    opacity: 0.8,
  },
  refreshIconSpinning: {
    opacity: 0.5,
  },
});