import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserProfile } from "@/hooks/useUserProfile";
import TemplateLayout from "@/components/TemplateLayout";
import ModalScreen from "../profile/modal";

export default function UserProfileScreen() {
  const { userProfile, isLoading, error } = useUserProfile();
  const [isModalVisible, setModalVisible] = useState(false);

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
        <Text style={[styles.infoText, { color: TextColor }]}>
          Loading user data...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
        <Text style={[styles.errorText, { color: TextColor }]}>
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <TemplateLayout pageName="ProfilePage">
      <View style={[styles.container]}>
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <View style={[styles.avatar, { backgroundColor: PrimaryColor }]}>
              <Text style={[styles.avatarText, { color: BackgroundColor }]}>
                {userProfile?.initials || "?"}
              </Text>
            </View>
            <Text style={[styles.nameText, { color: TextColor }]}>
              Hi, {userProfile?.username}
            </Text>
            <Text style={[styles.infoText, { color: TextColor }]}>
              Mail: {userProfile?.email}
            </Text>
            <Text style={[styles.infoText, { color: TextColor }]}>
              Tlf: {userProfile?.phone}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: PrimaryColor }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.buttonText, { color: BackgroundColor }]}>
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="none"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: PrimaryColor }]}
            >
              <ModalScreen onClose={() => setModalVisible(false)} />
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
    justifyContent: "center",
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
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
