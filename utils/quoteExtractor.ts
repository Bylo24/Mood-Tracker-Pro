export function extractQuoteAndAuthor(text: string) {
  console.log('Raw text to extract from:', text);
  
  // Clean up the text
  const cleanText = text
    .replace(/^["']|["']$/g, '') // Remove quotes at beginning/end
    .replace(/\n+/g, ' ') // Replace multiple newlines with space
    .trim();
  
  // Try to find patterns like "Quote" - Author or similar
  const patterns = [
    // Bold markdown: Quote **Author**
    /^(.*?)\s*\*\*(.*?)\*\*\s*$/,
    // Quote - Author
    /^(.*?)\s*[-–—]\s*(.*?)$/,
    // "Quote" - Author
    /^["'](.+?)["']\s*[-–—]\s*(.*?)$/,
    // Quote by Author
    /^(.*?)\s+by\s+(.*?)$/i,
    // Quote from Author
    /^(.*?)\s+from\s+(.*?)$/i,
    // Quote. Author
    /^(.*?)[.!?]\s+(.*?)$/,
    // Newline separation
    /^(.*)\n+(.*)$/s
  ];
  
  for (const pattern of patterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const quote = match[1].trim().replace(/^["']|["']$/g, '');
      const author = match[2].trim();
      console.log('Extracted quote:', quote);
      console.log('Extracted author:', author);
      return { quote, author };
    }
  }
  
  // If no pattern matches, check if there's a dash anywhere
  const dashIndex = cleanText.lastIndexOf('-');
  if (dashIndex > 0) {
    const quote = cleanText.substring(0, dashIndex).trim();
    const author = cleanText.substring(dashIndex + 1).trim();
    console.log('Extracted using dash index:', { quote, author });
    return { quote, author };
  }
  
  // Try to find the last sentence and assume it might contain the author
  const sentences = cleanText.split(/[.!?]\s+/);
  if (sentences.length > 1) {
    const lastSentence = sentences.pop() || '';
    const mainQuote = sentences.join('. ') + '.';
    
    // Check if the last sentence is short (likely an author attribution)
    if (lastSentence.length < 40 && !lastSentence.includes('"')) {
      console.log('Extracted using sentence splitting:', { 
        quote: mainQuote, 
        author: lastSentence 
      });
      return { 
        quote: mainQuote, 
        author: lastSentence 
      };
    }
  }
  
  // Last resort: return the whole text as quote
  console.log('No pattern matched, returning whole text as quote');
  return { 
    quote: cleanText,
    author: 'Unknown'
  };
}