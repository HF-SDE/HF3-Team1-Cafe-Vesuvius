import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

const LoadingPage: React.FC = () => {
  const theme = useThemeColor();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size={50} color={theme.primary} />
      <Text style={[styles.text, { color: theme.text }]}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default LoadingPage;
