import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IFooterButtons {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmDisabled?: boolean;
}

export default function FooterButtons({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmDisabled = false,
}: IFooterButtons) {
  const theme = useThemeColor();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={onCancel}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          {cancelText}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={confirmDisabled}
        style={[
          styles.button,
          { backgroundColor: theme.primary },
          confirmDisabled && styles.buttonDisabled,
        ]}
        onPress={onConfirm}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          {confirmText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 70,
    margin: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
