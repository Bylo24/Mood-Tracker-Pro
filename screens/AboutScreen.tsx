import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Image,
  Linking,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';

export default function AboutScreen() {
  const navigation = useNavigation();
  const appVersion = '1.0.0';
  
  const handleOpenWebsite = () => {
    Linking.openURL('https://moodbuddy.app');
  };
  
  const handleOpenEmail = () => {
    Linking.openURL('mailto:support@newday.dev');
  };
  
  const handleOpenTwitter = () => {
    Linking.openURL('https://twitter.com/moodbuddyapp');
  };
  
  const handleOpenInstagram = () => {
    Linking.openURL('https://instagram.com/moodbuddyapp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Mood Buddy</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/mood-buddy-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Mood Buddy</Text>
          <Text style={styles.appVersion}>Version {appVersion}</Text>
        </View>
        
        <Text style={styles.tagline}>
          Your daily companion for emotional well-being
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            Mood Buddy was created with a simple mission: to help people understand and improve their emotional well-being through daily reflection and personalized insights.
          </Text>
          <Text style={styles.paragraph}>
            We believe that mental health is just as important as physical health, and that small daily habits can lead to significant improvements in how we feel and function.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.paragraph}>
            Mood Buddy uses a combination of daily mood tracking, pattern recognition, and evidence-based techniques to help you:
          </Text>
          <View style={styles.bulletPoints}>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.bulletText}>Understand your emotional patterns</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.bulletText}>Identify triggers that affect your mood</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.bulletText}>Develop healthy coping strategies</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.bulletText}>Build resilience through guided exercises</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.bulletText}>Track your progress over time</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.paragraph}>
            Mood Buddy was developed by a passionate team of mental health professionals, designers, and developers who believe in the power of technology to improve well-being.
          </Text>
          <Text style={styles.paragraph}>
            Our team includes licensed therapists, UX designers focused on accessibility, and developers committed to creating a secure and private experience.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Commitment</Text>
          <Text style={styles.paragraph}>
            Your privacy is our top priority. We use industry-standard encryption and security practices to protect your data. We never sell your personal information to third parties.
          </Text>
          <Text style={styles.paragraph}>
            For more details, please review our Privacy Policy.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactItem} onPress={handleOpenEmail}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.contactText}>support@newday.dev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem} onPress={handleOpenWebsite}>
            <Ionicons name="globe-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.contactText}>www.moodbuddy.app</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialIcon} onPress={handleOpenTwitter}>
              <Ionicons name="logo-twitter" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={handleOpenInstagram}>
              <Ionicons name="logo-instagram" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} NewDay. All rights reserved.
          </Text>
          <Text style={styles.disclaimer}>
            Mood Buddy is not a substitute for professional medical advice, diagnosis, or treatment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40, // Same width as back button for balance
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 16,
    color: theme.colors.subtext,
  },
  tagline: {
    fontSize: 18,
    fontStyle: 'italic',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: 16,
  },
  bulletPoints: {
    marginTop: 8,
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text,
    marginLeft: 12,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 12,
    textDecorationLine: 'underline',
  },
  socialSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 16,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    marginHorizontal: 16,
    padding: 8,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: theme.colors.subtext,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
});