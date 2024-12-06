import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import ErrorIcon from "@/components/icons/ErrorIcon.svg";

// Prop for the error message
interface ErrorPageProps {
  message?: string; // Optional error message prop
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  const theme = useThemeColor();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.logoContainer}>
        <ErrorIcon width={150} height={150} />{" "}
      </View>
      <Text style={[styles.headerLabel, { color: theme.text }]}>
        Something went wrong!
      </Text>

      {message && (
        <Text style={[styles.messageText, { color: theme.text }]}>
          Error code: {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLabel: {
    fontSize: 28,
    fontWeight: "600",
    marginVertical: 15,
    textAlign: "center",
  },
  messageText: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 28,
  },
});

export default ErrorPage;
