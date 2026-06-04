import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS, BORDER_RADIUS, SIZES } from '../constants/theme';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
}

export default function GlassCard({ children, style, ...props }: GlassCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
});
