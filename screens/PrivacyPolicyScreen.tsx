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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.lastUpdated}>Last Updated: June 1, 2023</Text>
        
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to Mood Buddy. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Personal Data:</Text> When you create an account, we collect your email address and any profile information you choose to provide, such as your name.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Usage Data:</Text> We collect information about how you use the app, including your mood entries, journal entries, and interaction with features.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Device Information:</Text> We may collect information about your mobile device, including device model, operating system, unique device identifiers, and mobile network information.
        </Text>
        
        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:
        </Text>
        <Text style={styles.bulletPoint}>• Provide, maintain, and improve our services</Text>
        <Text style={styles.bulletPoint}>• Process and complete transactions</Text>
        <Text style={styles.bulletPoint}>• Send you technical notices and support messages</Text>
        <Text style={styles.bulletPoint}>• Respond to your comments and questions</Text>
        <Text style={styles.bulletPoint}>• Develop new products and services</Text>
        <Text style={styles.bulletPoint}>• Generate personalized insights and recommendations</Text>
        <Text style={styles.bulletPoint}>• Monitor and analyze usage patterns</Text>
        
        <Text style={styles.sectionTitle}>4. Data Storage and Security</Text>
        <Text style={styles.paragraph}>
          Your data is stored securely in our database. We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </Text>
        <Text style={styles.paragraph}>
          While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security. Any transmission of personal data is at your own risk.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Data Sharing and Disclosure</Text>
        <Text style={styles.paragraph}>
          We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
        </Text>
        <Text style={styles.bulletPoint}>• With service providers who perform services on our behalf</Text>
        <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
        <Text style={styles.bulletPoint}>• To protect and defend our rights and property</Text>
        <Text style={styles.bulletPoint}>• With your consent or at your direction</Text>
        
        <Text style={styles.sectionTitle}>6. Your Data Rights</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you may have certain rights regarding your personal data, including:
        </Text>
        <Text style={styles.bulletPoint}>• The right to access your personal data</Text>
        <Text style={styles.bulletPoint}>• The right to rectify inaccurate personal data</Text>
        <Text style={styles.bulletPoint}>• The right to delete your personal data</Text>
        <Text style={styles.bulletPoint}>• The right to restrict processing of your personal data</Text>
        <Text style={styles.bulletPoint}>• The right to data portability</Text>
        <Text style={styles.bulletPoint}>• The right to object to processing of your personal data</Text>
        
        <Text style={styles.paragraph}>
          To exercise these rights, please contact us using the information provided in the "Contact Us" section.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete such information as soon as possible.
        </Text>
        
        <Text style={styles.sectionTitle}>8. Analytics and Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We may use third-party service providers to monitor and analyze the use of our service. These services may collect information sent by your device such as device identifiers, IP address, and other usage information.
        </Text>
        <Text style={styles.paragraph}>
          These third-party service providers have their own privacy policies addressing how they use such information. We encourage you to read their privacy policies.
        </Text>
        
        <Text style={styles.sectionTitle}>9. Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </Text>
        <Text style={styles.paragraph}>
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </Text>
        
        <Text style={styles.sectionTitle}>10. Your Consent</Text>
        <Text style={styles.paragraph}>
          By using our app, you consent to our Privacy Policy and agree to its terms. If you do not agree with this policy, please do not use our app.
        </Text>
        
        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at:
        </Text>
        <Text style={styles.paragraph}>
          Email: privacy@newday.dev
        </Text>
        <Text style={styles.paragraph}>
          Mood Buddy Support Team
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Mood Buddy, you acknowledge that you have read and understand this Privacy Policy.
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
  bold: {
    fontWeight: theme.fontWeights.bold,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: 8,
    paddingLeft: 16,
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