import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import TemplateLayout from "@/components/TemplateLayout";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TabTwoScreen() {
  const TextColor = useThemeColor({}, "text");

  return (
    <TemplateLayout pageName="ReservationPage">
      <View style={styles.separator} />
      <Text style={[styles.title, { color: TextColor }]}>
        This is the Reservation screen.
      </Text>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#eee", // Can be customized based on theme
  },
});
