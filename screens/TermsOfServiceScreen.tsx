import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.lastUpdated}>Last Updated: June 1, 2023</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using Mood Buddy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          Mood Buddy is a mood tracking application that allows users to record their daily moods, view patterns, and receive personalized recommendations. The app offers both free and premium features.
        </Text>
        
        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        <Text style={styles.paragraph}>
          To use certain features of Mood Buddy, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </Text>
        
        <Text style={styles.sectionTitle}>4. Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Your use of Mood Buddy is also governed by our Privacy Policy, which is incorporated by reference into these Terms of Service. Please review our Privacy Policy to understand our practices.
        </Text>
        
        <Text style={styles.sectionTitle}>5. User Content</Text>
        <Text style={styles.paragraph}>
          You retain all rights to any content you submit, post, or display on or through Mood Buddy. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with providing the service to you.
        </Text>
        
        <Text style={styles.sectionTitle}>6. Subscription and Billing</Text>
        <Text style={styles.paragraph}>
          Mood Buddy offers premium features through subscription plans. By subscribing to a premium plan, you agree to the pricing and payment terms listed in the app. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.
        </Text>
        <Text style={styles.paragraph}>
          You can manage and cancel your subscription through your app store account settings.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Refund Policy</Text>
        <Text style={styles.paragraph}>
          Refunds are handled by the respective app stores (Apple App Store or Google Play Store) according to their policies. We do not process refunds directly.
        </Text>
        
        <Text style={styles.sectionTitle}>8. Prohibited Uses</Text>
        <Text style={styles.paragraph}>
          You agree not to use Mood Buddy for any unlawful purpose or in any way that could damage, disable, or impair the service. You may not attempt to gain unauthorized access to any part of the service or any system or network connected to the service.
        </Text>
        
        <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          Mood Buddy and its original content, features, and functionality are owned by the app developers and are protected by international copyright, trademark, and other intellectual property laws.
        </Text>
        
        <Text style={styles.sectionTitle}>10. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend your account and access to Mood Buddy immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service.
        </Text>
        
        <Text style={styles.sectionTitle}>11. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          In no event shall Mood Buddy, its developers, or its suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
        </Text>
        
        <Text style={styles.sectionTitle}>12. Disclaimer</Text>
        <Text style={styles.paragraph}>
          Mood Buddy is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted or error-free.
        </Text>
        <Text style={styles.paragraph}>
          Mood Buddy is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </Text>
        
        <Text style={styles.sectionTitle}>13. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
        </Text>
        
        <Text style={styles.sectionTitle}>14. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the app developers operate, without regard to its conflict of law provisions.
        </Text>
        
        <Text style={styles.sectionTitle}>15. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms of Service, please contact us at support@newday.dev.
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Mood Buddy, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
  lastUpdated: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: 16,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.subtext,
    textAlign: 'center',
  },
});