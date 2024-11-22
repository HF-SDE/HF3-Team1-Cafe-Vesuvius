import React, { ReactElement, useState } from "react";
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
import TemplateLayout from "@/components/TemplateLayout";
import AddButton from "@/components/AddButton";
import { Reservation } from "@/models/ReservationModels";
import { useReservation } from "@/hooks/useResevation";
import NewReservationModal from "../reservation/new-reservation";
import { useTable } from "@/hooks/useTable";
import dayjs from "dayjs";
import { AntDesign } from "@expo/vector-icons";
import InfoReservationModal from "../reservation/info-reservation";


export default function ReservationsOverview(): ReactElement {
  const { reservations, isLoading: reservationsIsLoading, error: reservationsError } = useReservation();
  const { table, isLoading: tableIsLoading, error: tableError } = useTable();
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState<{ email: string, phone: string }>({ email: "", phone: "" });

  const router = useRouter();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");


  /**
   * Set selected reservation
   * @param {string} email 
   * @param {string} phone 
   */
  function reservationSelect(email: string, phone: string): void {
    setInfoModalVisible(true);
    setSelectedReservations({ email, phone });
  }

  function renderReservationItem({ item }: { item: Reservation }): ReactElement {
    return (
      <View style={[styles.orderItem, { backgroundColor: PrimaryColor }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.orderText}>{item.name}</Text>
          <TouchableOpacity style={{ backgroundColor: SecondaryColor, padding: 5, borderRadius: 99999 }} onPress={() => reservationSelect(item.email, item.phone)}>
            <AntDesign name="info" size={30} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.orderText}>{dayjs(item.reservationTime).format("HH:mm")}</Text>
          <Text style={styles.orderText}> Tables:
            {item.tables ? item.tables.map((i) => (
              i.number
            )) : null}
          </Text>
        </View>
      </View >
    );
  }

  return (
    <TemplateLayout pageName="ReservationPage">
      <SafeAreaView style={[styles.container]}>
        <FlatList
          data={reservations}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id!}
          style={styles.reservationList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />

        <AddButton
          onPress={() => setCreateModalVisible(true)}
          requiredPermission={["reservation:create"]}
        />

        <Modal
          animationType="none"
          transparent={true}
          visible={isCreateModalVisible}
          onRequestClose={() => setCreateModalVisible(false)} // Close modal on Android back button
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: PrimaryColor }]}
            >
              <NewReservationModal tables={table!} onClose={() => setCreateModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="none"
          transparent={true}
          visible={isInfoModalVisible}
          onRequestClose={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: PrimaryColor }]}
            >
              <InfoReservationModal email={selectedReservations.email} phone={selectedReservations.phone} onClose={() => setInfoModalVisible(false)} />
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
    paddingBlock: 10,
    marginBlockEnd: 10,
    borderRadius: 10,
  },
  orderText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
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
