import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { getRecentMoodEntries, MoodEntry } from '../services/moodService';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface MoodPredictionsScreenProps {
  navigation: any;
  route: any;
}

export default function MoodPredictionsScreen({ navigation, route }: MoodPredictionsScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [hasEnoughData, setHasEnoughData] = useState(false);
  const [predictedMood, setPredictedMood] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(route.params?.isPremium || false);
  const [userName, setUserName] = useState('');
  const [showFuturePredictions, setShowFuturePredictions] = useState(true);

  // Days of the week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Current day index
  const currentDayIndex = new Date().getDay();
  
  // Next 7 days (starting from tomorrow)
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (currentDayIndex + i + 1) % 7;
    return daysOfWeek[dayIndex];
  });

  useEffect(() => {
    const loadMoodData = async () => {
      setIsLoading(true);
      try {
        // Get user name
        const storedName = await AsyncStorage.getItem('user_display_name');
        if (storedName) {
          setUserName(storedName);
        }

        // Get mood entries from the last 30 days
        const entries = await getRecentMoodEntries(30);
        setMoodEntries(entries);

        // Check if we have enough data for predictions (at least 10 entries)
        const hasEnough = entries.length >= 10;
        setHasEnoughData(hasEnough);

        if (hasEnough) {
          // Predict mood for tomorrow
          predictNextDayMood(entries);
        }
      } catch (error) {
        console.error('Error loading mood data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMoodData();
  }, [isPremium]);

  const predictNextDayMood = (entries: MoodEntry[]) => {
    // Simple prediction based on day of week averages
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayIndex = tomorrow.getDay();
    const tomorrowDay = daysOfWeek[tomorrowDayIndex];
    
    // Get entries for the same day of week
    const sameDayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getDay() === tomorrowDayIndex;
    });
    
    if (sameDayEntries.length >= 2) {
      // Calculate average mood for this day of week
      const avgMood = sameDayEntries.reduce((sum, entry) => sum + entry.rating, 0) / sameDayEntries.length;
      setPredictedMood(avgMood);
    } else {
      // Not enough data for this specific day, use overall average
      const avgMood = entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length;
      setPredictedMood(avgMood);
    }
  };

  const getMoodColor = (rating: number): string => {
    if (rating < 1.5) return theme.colors.mood1;
    if (rating < 2.5) return theme.colors.mood2;
    if (rating < 3.5) return theme.colors.mood3;
    if (rating < 4.5) return theme.colors.mood4;
    return theme.colors.mood5;
  };

  const getMoodEmoji = (rating: number): string => {
    if (rating < 1.5) return '😢';
    if (rating < 2.5) return '😕';
    if (rating < 3.5) return '😐';
    if (rating < 4.5) return '🙂';
    return '😄';
  };

  const getChartData = () => {
    const today = new Date();
    const labels: string[] = [];
    const data: number[] = [];
    
    if (showFuturePredictions) {
      // Today and next 7 days prediction
      // Today's data
      const todayStr = today.toISOString().split('T')[0];
      const todayEntry = moodEntries.find(e => e.date === todayStr);
      labels.push('Today');
      data.push(todayEntry ? todayEntry.rating : 0);
      
      // Future predictions (only if we have enough data)
      if (hasEnoughData && predictedMood !== null) {
        for (let i = 1; i <= 7; i++) {
          const date = new Date();
          date.setDate(today.getDate() + i);
          
          // Use shorter day abbreviations (Mo, Tu, We, etc.) to save space
          labels.push(daysOfWeek[date.getDay()].substring(0, 2));
          
          // Add some minor variation to the prediction
          const variation = (Math.random() * 0.4) - 0.2; // Random value between -0.2 and 0.2
          const predictedValue = Math.max(1, Math.min(5, predictedMood + variation));
          data.push(predictedValue);
        }
      }
    } else {
      // Past 7 days data
      for (let i = 7; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Find entry for this date
        const entry = moodEntries.find(e => e.date === dateStr);
        
        if (i === 0) {
          labels.push('Today');
        } else {
          // Use shorter day abbreviations (Mo, Tu, We, etc.) to save space
          labels.push(daysOfWeek[date.getDay()].substring(0, 2));
        }
        data.push(entry ? entry.rating : 0);
      }
    }
    
    return {
      labels,
      datasets: [
        {
          data: data.map(d => d || 0), // Replace null/undefined with 0
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ["Mood Rating"]
    };
  };

  const toggleChartView = () => {
    setShowFuturePredictions(!showFuturePredictions);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Mood Predictions</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Analyzing your mood patterns...</Text>
          </View>
        ) : !hasEnoughData ? (
          <View style={styles.notEnoughDataContainer}>
            <Ionicons name="analytics-outline" size={64} color={theme.colors.subtext} />
            <Text style={styles.notEnoughDataTitle}>Not Enough Data</Text>
            <Text style={styles.notEnoughDataText}>
              We need at least 10 days of mood data to generate accurate predictions.
              Keep tracking your mood daily, and check back soon!
            </Text>
            <View style={styles.dataCountContainer}>
              <Text style={styles.dataCountText}>
                Current data: {moodEntries.length} day{moodEntries.length !== 1 ? 's' : ''}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(100, (moodEntries.length / 10) * 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.dataCountSubtext}>
                {10 - moodEntries.length} more day{10 - moodEntries.length !== 1 ? 's' : ''} needed
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.returnButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.returnButtonText}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.introSection}>
              <Text style={styles.greeting}>Hello {userName},</Text>
              <Text style={styles.subGreeting}>
                Here are your AI-powered mood predictions based on your tracking history.
              </Text>
            </View>
            
            <View style={styles.predictionCard}>
              <Text style={styles.sectionTitle}>Tomorrow's Mood Prediction</Text>
              
              {predictedMood ? (
                <View style={styles.predictionContent}>
                  <View style={[
                    styles.moodEmojiContainer, 
                    { backgroundColor: getMoodColor(predictedMood) }
                  ]}>
                    <Text style={styles.moodEmoji}>{getMoodEmoji(predictedMood)}</Text>
                  </View>
                  <View style={styles.predictionTextContainer}>
                    <Text style={styles.predictionValue}>
                      {predictedMood.toFixed(1)} / 5
                    </Text>
                    <Text style={styles.predictionDescription}>
                      Based on your historical patterns, we predict your mood will be 
                      {predictedMood < 2.5 ? ' lower than average' : 
                       predictedMood > 3.5 ? ' better than average' : ' average'} tomorrow.
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.noDataText}>
                  Unable to predict tomorrow's mood due to insufficient data.
                </Text>
              )}
            </View>
            
            <View style={styles.chartContainer}>
              <View style={styles.chartHeaderRow}>
                <Text style={styles.sectionTitle}>Your Mood Forecast</Text>
                <TouchableOpacity 
                  style={styles.toggleButton}
                  onPress={toggleChartView}
                >
                  <Ionicons 
                    name={showFuturePredictions ? "arrow-back" : "arrow-forward"} 
                    size={18} 
                    color={theme.colors.text} 
                  />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.chartSubtitle}>
                {showFuturePredictions ? 'Next 7 days prediction' : 'Past 7 days history'}
              </Text>
              
              <View style={styles.chartWrapper}>
                <LineChart
                  data={getChartData()}
                  width={screenWidth * 0.85} // Reduced width to 85% of screen width
                  height={200}
                  chartConfig={{
                    backgroundColor: theme.colors.card,
                    backgroundGradientFrom: theme.colors.card,
                    backgroundGradientTo: theme.colors.card,
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: theme.colors.primary
                    },
                    // Adjust horizontal padding to move chart more to the left
                    paddingRight: 15,
                    paddingLeft: 0,
                    // Make sure y-axis is properly scaled for mood ratings (1-5)
                    yAxisInterval: 1,
                    yAxisSuffix: "",
                    yAxisMinValue: 0,
                    yAxisMaxValue: 5,
                    // Improve label formatting
                    formatXLabel: (label) => label,
                    formatYLabel: (label) => label,
                  }}
                  bezier
                  style={{
                    marginLeft: -10, // Reduced left margin
                    borderRadius: 16,
                  }}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                  fromZero={true}
                  segments={5} // 5 segments for 0-5 scale
                />
              </View>
              
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                  <Text style={styles.legendText}>
                    {showFuturePredictions ? 'Today\'s Mood' : 'Actual Mood'}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: 'rgba(134, 65, 244, 0.8)' }]} />
                  <Text style={styles.legendText}>
                    {showFuturePredictions ? 'Predicted Mood' : 'Past Mood'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.aiInsightsContainer}>
              <Text style={styles.sectionTitle}>AI Insights</Text>
              
              <View style={styles.insightCard}>
                <View style={styles.insightIconContainer}>
                  <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Prediction Confidence</Text>
                  <Text style={styles.insightDescription}>
                    {moodEntries.length >= 20 
                      ? "High confidence based on your consistent mood tracking history." 
                      : moodEntries.length >= 15 
                        ? "Medium confidence. More data will improve prediction accuracy." 
                        : "Low confidence. Continue tracking daily for better predictions."}
                  </Text>
                </View>
              </View>
              
              <View style={styles.insightCard}>
                <View style={styles.insightIconContainer}>
                  <Ionicons name="trending-up-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Upcoming Trend</Text>
                  <Text style={styles.insightDescription}>
                    {(() => {
                      if (!predictedMood) return "Insufficient data to determine trend.";
                      
                      const todayStr = new Date().toISOString().split('T')[0];
                      const todayEntry = moodEntries.find(e => e.date === todayStr);
                      const todayMood = todayEntry ? todayEntry.rating : null;
                      
                      if (todayMood === null) return "Log today's mood to see your upcoming trend.";
                      
                      const diff = predictedMood - todayMood;
                      if (Math.abs(diff) < 0.5) return "Your mood is predicted to remain stable in the coming days.";
                      if (diff > 0) return "Our AI predicts your mood will improve in the coming days.";
                      return "Our AI predicts your mood may dip slightly. Consider planning mood-boosting activities.";
                    })()}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.tipsContainer}>
              <Text style={styles.sectionTitle}>Personalized Tips</Text>
              
              <View style={styles.tipCard}>
                <Ionicons name="bulb-outline" size={24} color={theme.colors.accent} style={styles.tipIcon} />
                <Text style={styles.tipText}>
                  {predictedMood && predictedMood < 3 
                    ? "Based on our prediction, consider planning enjoyable activities for tomorrow to help boost your mood."
                    : "Continue tracking your mood daily to improve prediction accuracy and receive more personalized insights."}
                </Text>
              </View>
              
              <View style={styles.tipCard}>
                <Ionicons name="bulb-outline" size={24} color={theme.colors.accent} style={styles.tipIcon} />
                <Text style={styles.tipText}>
                  Check the Advanced Mood Analytics section to understand your mood patterns and triggers in more detail.
                </Text>
              </View>
            </View>
            
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                Note: These predictions are based on your historical mood patterns and may not account for unexpected events or changes in your routine.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
  },
  notEnoughDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 400,
  },
  notEnoughDataTitle: {
    fontSize: 22,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  notEnoughDataText: {
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  dataCountContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  dataCountText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  dataCountSubtext: {
    fontSize: 14,
    color: theme.colors.subtext,
  },
  returnButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  returnButtonText: {
    color: '#fff',
    fontWeight: theme.fontWeights.semibold,
    fontSize: 16,
  },
  introSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    color: theme.colors.subtext,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 16,
  },
  predictionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  predictionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  moodEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moodEmoji: {
    fontSize: 32,
  },
  predictionTextContainer: {
    flex: 1,
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  predictionDescription: {
    fontSize: 14,
    color: theme.colors.subtext,
  },
  noDataText: {
    fontSize: 16,
    color: theme.colors.subtext,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  chartContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  toggleButton: {
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  chartSubtitle: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 8,
  },
  chartWrapper: {
    alignItems: 'center', // Center the chart
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.subtext,
  },
  aiInsightsContainer: {
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: theme.colors.subtext,
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...theme.shadows.small,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  disclaimerContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: theme.colors.subtext,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});