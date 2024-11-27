import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

const LoadingPage: React.FC = () => {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");
  return (
    <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
      <ActivityIndicator size={50} color={PrimaryColor} />
      <Text style={[styles.text, { color: TextColor }]}>Loading...</Text>
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
