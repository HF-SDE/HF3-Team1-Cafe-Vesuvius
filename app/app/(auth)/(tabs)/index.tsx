import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import { useSession } from "../../ctx";
import ResetPasswordModal from "../profile/reset-password";

import TemplateLayout from "@/components/TemplateLayout";
import LoadingPage from "@/components/LoadingPage";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function UserProfileScreen() {
  const { userProfile, isLoading, error } = useUserProfile();
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const { signOut, session } = useSession();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <TemplateLayout pageName="ProfilePage">
      <View style={[styles.container]}>
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: PrimaryColor, borderColor: SecondaryColor },
              ]}
            >
              <Text style={[styles.avatarText, { color: BackgroundColor }]}>
                {userProfile?.initials || "?"}
              </Text>
            </View>
            <Text style={[styles.nameText, { color: TextColor }]}>
              Hi, {userProfile?.name || "N/A"}
            </Text>
            <Text style={[styles.infoText, { color: TextColor }]}>
              Email: {userProfile?.email || "N/A"}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: PrimaryColor }]}
              onPress={() => setIsModalVisible(true)} // Show modal on press
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

        <Modal
          animationType="none"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)} // Close modal on Android back button
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: PrimaryColor }]}
            >
              <ResetPasswordModal onClose={() => setIsModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
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
    borderWidth: 8,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    height: "50%",
    minHeight: 400,
    padding: 10,
    borderRadius: 10,
  },
});
