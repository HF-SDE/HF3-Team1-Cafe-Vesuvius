import { StyleSheet } from "react-native";

import { Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TabTwoScreen() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: SecondaryColor,
          borderColor: SecondaryColor,
          borderWidth: 2,
        },
      ]}
    >
      <Text style={styles.title}>Management</Text>
      <View
        style={styles.separator}
        // lightColor="#eee"
        // darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
