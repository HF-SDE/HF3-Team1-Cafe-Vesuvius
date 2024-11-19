import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
} from "react-native";
import { Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CheckPermission from "@/components/CheckPermission";
import TemplateLayout from "@/components/TemplateLayout";
import AddButton from "@/components/AddButton";
import { Reservation } from "@/models/ReservationModels";
import { useReservation } from "@/hooks/useResevation";
import ResetPasswordModal from "../profile/reset-password";
import NewReservationModal from "../reservation/new-reservation";

export default function ReservationsOverview() {
  const { reservations, isLoading, error } = useReservation();
  const [isModalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const handleAddReservation = () => {
  };

  const renderReservationItem = ({ item }: { item: Reservation }) => (
    <View style={styles.orderItem}>
    </View>
  );

  return (
    <TemplateLayout pageName="ReservationPage">
      <SafeAreaView style={[styles.container]}>
        <FlatList
          data={reservations}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id}
          style={styles.reservationList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />

        <AddButton
          onPress={() => setModalVisible(true)}
          requiredPermission={["reservation:create"]}
        />

        <Modal
          animationType="none"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)} // Close modal on Android back button
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: PrimaryColor }]}
            >
              <NewReservationModal onClose={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>

    </TemplateLayout>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  reservationList: {
    flex: 1,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  orderText: {
    fontSize: 16,
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
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
    // backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  button: {
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
});
