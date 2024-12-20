import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactElement } from "react";

interface ModalScreenProps {
  onClose: () => void;
  email: string;
  phone: string;
}

export default function InfoReservationModal({
  onClose,
  email,
  phone,
}: ModalScreenProps): ReactElement {
  const theme = useThemeColor();

  function handleEmailPress(): void {
    const subject = "Reservation Info Café Vesuvius";
    const body = "Hello, ";
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      console.error("Error opening email client:", err)
    );
  }

  function handlePhonePress(): void {
    const url = `tel:${phone}`;

    Linking.openURL(url).catch((err) =>
      console.error("Error opening Phone client:", err)
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={{ display: "flex", gap: 20 }}>
        <Text style={[styles.title, { color: theme.text }]}>
          Reservations Info
        </Text>
        <Text style={{ color: theme.text, fontSize: 18 }}>
          Email:{" "}
          <Text
            style={{ color: theme.primary, textDecorationLine: "underline" }}
            onPress={handleEmailPress}
          >
            {email}
          </Text>
        </Text>
        <Text style={{ color: theme.text, fontSize: 18 }}>
          Phone:{" "}
          <Text
            style={{ color: theme.primary, textDecorationLine: "underline" }}
            onPress={handlePhonePress}
          >
            {phone}
          </Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            { backgroundColor: theme.primary, minWidth: "100%" },
          ]}
          onPress={onClose}
        >
          <Text
            style={[
              styles.buttonText,
              { color: theme.background, width: "100%", textAlign: "center" },
            ]}
          >
            close
          </Text>
        </TouchableOpacity>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dateTimePicker: {
    position: "absolute",
    // backgroundColor: "white",
    zIndex: 2,
    borderRadius: 20,
    padding: 10,
  },
  item: {
    flex: 1,
    maxWidth: "25%",
    alignItems: "center",
    width: "100%",

    padding: 10,
    backgroundColor: "rgba(249, 180, 45, 0.25)",
    borderWidth: 1.5,
    // borderColor: "#fff",
  },
  itemDisabled: {
    flex: 1,
    maxWidth: "25%", // 100% devided by the number of rows you want
    alignItems: "center",
    width: "100%",

    // my visual styles; not important for the grid
    padding: 10,
    backgroundColor: "rgba(249, 180, 45, 0.25)",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  listContainer: {
    padding: 10,
  },
  flatList: {
    flex: 1,
    alignContent: "center",
    width: "100%", // Ensures the FlatList spans the full width
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  mainButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
