import React from 'react';
import { Image, StyleSheet, View, ImageStyle, StyleProp } from 'react-native';

interface MoodBuddyLogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export default function MoodBuddyLogo({ size = 100, style }: MoodBuddyLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/mood-buddy-logo.png')}
        style={[
          {
            width: size,
            height: size,
            resizeMode: 'contain',
          },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});