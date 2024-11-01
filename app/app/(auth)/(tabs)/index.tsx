import { Button, StyleSheet } from "react-native";

import { Text, View } from "react-native";
import { useSession } from "../../ctx";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TabOneScreen() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const { signOut, session } = useSession();
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
      <Text style={styles.title}>Profile</Text>
      <Text>Welcome, {session}</Text>
      <View
        style={styles.separator}
        // lightColor="#eee"
        // darkColor="rgba(255,255,255,0.1)"
      />
      <Button
        title="Sign Out"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
