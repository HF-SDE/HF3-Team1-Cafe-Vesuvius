import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ViewStyle, Platform } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface HeaderBackgroundProps {
  style?: ViewStyle;
}

const HeaderBackground: React.FC<HeaderBackgroundProps> = ({ style }) => {
  const theme = useThemeColor();

  const gradientLocations: [number, number, ...number[]] =
    Platform.OS === "ios" ? [0, 0.95, 0.95, 1] : [0, 0.9, 0.9, 1];

  return (
    <LinearGradient
      colors={[theme.primary, theme.primary, theme.accent, theme.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={gradientLocations}
      style={[styles.headerBackground, style]} // Merge styles with any passed in prop
    />
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
  },
});

export default HeaderBackground;
