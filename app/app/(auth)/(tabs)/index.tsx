import { Button, StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useSession } from "../../ctx";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function UserProfileScreen() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const { signOut, session } = useSession();

  // Get data via api instead
  const userInfo = {
    username: "Ben Dover",
    email: "bendover@gmail.com",
    initials: "BD",
    phone: "+4512345678"
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: SecondaryColor }]}>
      <View style={styles.contentContainer}>
        <View style={styles.topContainer}>
          <View style={[styles.avatar, { backgroundColor: PrimaryColor }]}>
            <Text style={[styles.avatarText, { color: BackgroundColor }]}>
              {userInfo.initials}
            </Text>
          </View>
          <Text style={[styles.nameText, { color: TextColor }]}>Hi, {userInfo.username}</Text>
          <Text style={[styles.infoText, { color: TextColor }]}>Mail: {userInfo.email}</Text>
          <Text style={[styles.infoText, { color: TextColor }]}>Tlf: {userInfo.phone}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: PrimaryColor }]}
            //onPress={}
          >
            <Text style={[styles.buttonText, { color: BackgroundColor }]}>
              Reset Password
            </Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: PrimaryColor }]}
            onPress={signOut}
          >
            <Text style={[styles.buttonText, { color: BackgroundColor }]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    maxWidth: 400,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  topContainer: {
    alignItems: "center",
    paddingTop: 40,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 52,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
  },
  infoText: {
    fontSize: 20,
    textAlign: "left",
    width: "100%",
    marginBottom: 5,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  spacer: {
    height: 10,
  },
  button: {
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
