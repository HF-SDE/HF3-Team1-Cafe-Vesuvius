import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Modal,
  SectionList,
  Pressable,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import TemplateLayout from "@/components/TemplateLayout";
import AddButton from "@/components/AddButton";
import { Reservation, ReservationSections } from "@/models/ReservationModels";
import { useReservation } from "@/hooks/useResevation";
import NewReservationModal from "../reservation/new-reservation";
import { useTable } from "@/hooks/useTable";
import dayjs from "dayjs";
import { AntDesign } from "@expo/vector-icons";
import InfoReservationModal from "../reservation/info-reservation";
import { ReservationContext } from "@/context/ReservationContext";
import { Card, Text } from "react-native-paper";
import SearchBar from "@/components/SearchBar";


export default function ReservationsOverview(): ReactElement {
  const { reservations, isLoading: reservationsIsLoading, error: reservationsError, refresh } = useReservation();
  const [reservationsLoading, setReservationsLoading] = useState<boolean>(true);
  const { table, isLoading: tableIsLoading, error: tableError } = useTable();
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState<{ email: string, phone: string }>({ email: "", phone: "" });
  const [searchQuery, setSearchQuery] = useState("");


  const { reservations: reservationsData, setReservations: setReservationsData } = useContext(ReservationContext);

  const router = useRouter();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  useEffect(() => {
    if (reservations) {
      setReservationsLoading(true);
      setReservationsData(sortReservations(reservations));
      setReservationsLoading(false);
    }
  }, [reservations]);

  function handleRefresh(): void {
    setReservationsLoading(true);
    refresh();
    setReservationsLoading(false);
  }

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
      <Card style={[styles.orderItem, { backgroundColor: PrimaryColor }]} mode="contained" onPress={() => reservationSelect(item.email, item.phone)}>
        <Card.Title title={item.name} titleStyle={{ color: "white" }} titleVariant={"titleLarge"} right={() =>
          <Card.Actions>
            <Pressable style={{ backgroundColor: SecondaryColor, padding: 5, borderRadius: 99999 }} onPress={() => reservationSelect(item.email, item.phone)}>
              <AntDesign name="info" size={30} />
            </Pressable>
          </Card.Actions>
        } />
        <Card.Content>
          <Text style={{ color: "white" }}>{dayjs(item.reservationTime).format("DD/MM/YYYY HH:mm")}</Text>
          <Text style={{ color: "white" }}>Tables:&nbsp;
            {item.Tables ? item.Tables.map((i) => (
              i.number + " "
            )) : null}
          </Text>
        </Card.Content>
      </Card >
    );
  }

  function onChangeSearch(query: string) {
    const text = query.toLowerCase();

    if (text.length > 2) {
      setReservationsLoading(true);
      const filteredData = reservationsData?.map((section) => {
        if (text.includes("@")) {
          return {
            title: section.title,
            data: section.data.filter((reservation) => reservation.email.toLowerCase().includes(text)),
          }
        }
        if (text.includes("+") || !isNaN(Number(text))) {
          return {
            title: section.title,
            data: section.data.filter((reservation) => reservation.phone.toLowerCase().includes(text)),
          }
        }
        return {
          title: section.title,
          data: section.data.filter((reservation) => reservation.name.toLowerCase().includes(text)),
        }
      });
      setReservationsData(filteredData);
      setReservationsLoading(false);
    } else {
      setReservationsData(sortReservations(reservations!));
    }
    setReservationsLoading(false);
    setSearchQuery(query);
  }

  return (
    <TemplateLayout pageName="ReservationPage">
      <SafeAreaView style={[styles.container]}>
        <SearchBar value={searchQuery} placeholder="Search" loading={reservationsLoading} onChange={(e) => onChangeSearch(e.nativeEvent.text)} onClearIconPress={() => {
          setReservationsData(sortReservations(reservations!))
          setSearchQuery("");
        }} />
        <SectionList
          sections={reservationsData || []}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id!}
          style={styles.reservationList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshing={reservationsLoading}
          onRefresh={handleRefresh}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
        />

        <AddButton
          onPress={() => setCreateModalVisible(true)}
          requiredPermission={["reservation:create"]}
        />

        <Modal
          animationType="none"
          transparent={true}
          visible={isCreateModalVisible}
          onRequestClose={() => setCreateModalVisible(false)}
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


/**
 * Sort reservations by date
 * @param {Reservation[]} reservations
 * @returns {ReservationSections[]}
 */
function sortReservations(reservations: Reservation[]): ReservationSections[] {
  const reservationsSections: ReservationSections[] = [];
  reservations.forEach((reservation) => {
    // Check if reservation was 
    if (dayjs(reservation.reservationTime).isBefore(dayjs().startOf("day"))) {
      return;
    }
    // Check if reservation is in the next 30 minutes
    if (dayjs(reservation.reservationTime).isBetween(dayjs().subtract(30, "minute"), dayjs().add(30, "minute"))) {
      const section = reservationsSections.find((section) => section.title === "Now")
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "Now", data: [reservation] });
        return;
      }
    }
    // Check if reservation was today
    if (dayjs(reservation.reservationTime).isBefore(dayjs().subtract(30, "minute"))) {
      const section = reservationsSections.find((section) => section.title === "Was Today")
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "Was Today", data: [reservation] });
        return;
      }
    }
    // Check if reservation is today
    if (dayjs(reservation.reservationTime).isToday()) {
      const section = reservationsSections.find((section) => section.title === "Today")
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "Today", data: [reservation] });
        return;
      }
    }
    // Check if reservation is tomorrow
    if (dayjs(reservation.reservationTime).isTomorrow()) {
      const section = reservationsSections.find((section) => section.title === "Tomorrow")
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "Tomorrow", data: [reservation] });
        return;
      }
    }
    // Check if reservation is in the next week
    if (dayjs(reservation.reservationTime).isBetween(dayjs(), dayjs().add(7, "day"))) {
      const section = reservationsSections.find((section) => section.title === "This Week")
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "This Week", data: [reservation] });
        return;
      }
    }
    // Check if reservation is in the next month
    if (dayjs(reservation.reservationTime).isBetween(dayjs(), dayjs().add(1, "month"))) {
      const section = reservationsSections.find((section) => section.title === "This Month")
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "This Month", data: [reservation] });
        return;
      }
    }
    // Check if reservation is in the next year
    if (dayjs(reservation.reservationTime).isBetween(dayjs(), dayjs().add(1, "year"))) {
      const section = reservationsSections.find((section) => section.title === "This Year")
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "This Year", data: [reservation] });
        return;
      }
    }
    // Check if reservation is in the future
    const section = reservationsSections.find((section) => section.title === "Future")
    if (section) {
      section.data.push(reservation);
      return;
    } else {
      reservationsSections.push({ title: "Future", data: [reservation] });
    }
  });

  // Sort reservations by date
  reservationsSections.forEach((reservation) => {
    reservation.data.sort((a, b) => {
      const dateA = dayjs(a.reservationTime);
      const dateB = dayjs(b.reservationTime);
      return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
    });
  });

  // Sort reservations sections by title
  const titleOrder = ["Now", "Today", "Tomorrow", "This Week", "This Month", "This Year", "Future"];
  reservationsSections.sort((a, b) => {
    const titleAIndex = titleOrder.indexOf(a.title);
    const titleBIndex = titleOrder.indexOf(b.title);
    return titleAIndex - titleBIndex;
  });

  return reservationsSections;
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
