import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import PremiumFeatureBadge from '../components/PremiumFeatureBadge';
import { colors } from '../theme/colors';

export default function TipsScreen({ navigation }) {
  // Force showing the ad for testing in Expo Go
  const [showAd, setShowAd] = useState(true);
  
  const categories = [
    {
      id: 'mood',
      title: 'Mood Improvement',
      icon: 'happy-outline',
      color: colors.mood.good,
    },
    {
      id: 'stress',
      title: 'Stress Management',
      icon: 'leaf-outline',
      color: colors.mood.great,
    },
    {
      id: 'sleep',
      title: 'Better Sleep',
      icon: 'moon-outline',
      color: colors.primary,
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      icon: 'flower-outline',
      color: colors.secondary,
    },
  ];

  const tips = {
    mood: [
      {
        id: 'mood1',
        title: 'Physical Activity',
        description: 'Just 30 minutes of walking each day can boost your mood and improve your health.',
        premium: false,
      },
      {
        id: 'mood2',
        title: 'Gratitude Practice',
        description: 'Write down three things you\'re grateful for each day to shift your focus to the positive.',
        premium: false,
      },
      {
        id: 'mood3',
        title: 'Social Connection',
        description: 'Reach out to a friend or family member. Social connections are vital for emotional wellbeing.',
        premium: false,
      },
      {
        id: 'mood4',
        title: 'Personalized Mood Plan',
        description: 'Get a customized plan based on your mood history and personal preferences.',
        premium: true,
      },
      {
        id: 'mood5',
        title: 'Advanced Mood Analytics',
        description: 'Discover your mood patterns and triggers with detailed analytics and insights.',
        premium: true,
      },
    ],
    stress: [
      {
        id: 'stress1',
        title: 'Deep Breathing',
        description: 'Practice deep breathing for 5 minutes: inhale for 4 counts, hold for 7, exhale for 8.',
        premium: false,
      },
      {
        id: 'stress2',
        title: 'Progressive Relaxation',
        description: 'Tense and then relax each muscle group from toes to head to release physical tension.',
        premium: false,
      },
      {
        id: 'stress3',
        title: 'Guided Stress Relief',
        description: 'Access expert-led audio sessions designed to reduce stress and promote relaxation.',
        premium: true,
      },
    ],
    sleep: [
      {
        id: 'sleep1',
        title: 'Screen Time',
        description: 'Avoid screens at least 1 hour before bedtime to improve sleep quality.',
        premium: false,
      },
      {
        id: 'sleep2',
        title: 'Consistent Schedule',
        description: 'Try to go to bed and wake up at the same times each day, even on weekends, to regulate your body\'s internal clock.',
        premium: false,
      },
      {
        id: 'sleep3',
        title: 'Sleep Environment',
        description: 'Keep your bedroom cool, dark, and quiet for optimal sleep conditions.',
        premium: false,
      },
      {
        id: 'sleep4',
        title: 'Sleep Analysis',
        description: 'Get insights on your sleep patterns and personalized recommendations for better rest.',
        premium: true,
      },
    ],
    mindfulness: [
      {
        id: 'mindfulness1',
        title: 'Present Moment',
        description: 'Take a few minutes to focus entirely on what you\'re doing right now, using all your senses.',
        premium: false,
      },
      {
        id: 'mindfulness2',
        title: 'Body Scan',
        description: 'Mentally scan your body from head to toe, noticing sensations without judgment.',
        premium: false,
      },
      {
        id: 'mindfulness3',
        title: 'Guided Meditations',
        description: 'Access a library of guided meditations for different needs and time constraints.',
        premium: true,
      },
      {
        id: 'mindfulness4',
        title: 'Mindfulness Courses',
        description: 'Follow structured courses to develop your mindfulness practice over time.',
        premium: true,
      },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState('mood');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Wellness Tips" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && { backgroundColor: category.color },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={selectedCategory === category.id ? 'white' : category.color}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && { color: 'white' },
                  ]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Recommended Activities</Text>
          {tips[selectedCategory].map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                {tip.premium && <PremiumFeatureBadge />}
              </View>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          ))}
        </View>

        {/* Ad Spot for Free Plan - Now positioned below the tips */}
        {showAd && (
          <View style={styles.adContainer}>
            <View style={styles.adContent}>
              <Ionicons name="sparkles" size={24} color={colors.secondary} />
              <Text style={styles.adTitle}>Want More Personalized Tips?</Text>
              <Text style={styles.adDescription}>
                Upgrade to Premium for custom recommendations tailored to your mood patterns and preferences.
              </Text>
              <TouchableOpacity 
                style={styles.adButton}
                onPress={() => {
                  // Handle navigation safely
                  if (navigation && navigation.navigate) {
                    navigation.navigate('SubscriptionComparison');
                  } else {
                    console.log('Navigation to SubscriptionComparison not available');
                  }
                }}
              >
                <Text style={styles.adButtonText}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Add some padding at the bottom for better scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    marginVertical: 15,
  },
  categoriesScroll: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    marginLeft: 8,
    fontWeight: '500',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  tipsContainer: {
    padding: 15,
  },
  tipCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.lightText,
    lineHeight: 20,
  },
  // Ad Spot Styles - Enhanced for visibility
  adContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adContent: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
    borderRadius: 10,
    margin: 2,
    backgroundColor: '#FFF9F0', // Light background to make it stand out
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  adButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 20,
  }
});