import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Modal,
  SectionList,
  Pressable,
  KeyboardAvoidingView,
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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import InfoReservationModal from "../reservation/info-reservation";
import { ReservationContext } from "@/context/ReservationContext";
import { Card, Text } from "react-native-paper";
import SearchBar from "@/components/SearchBar";

export default function ReservationsOverview(): ReactElement {
  const {
    reservations,
    isLoading: reservationsIsLoading,
    error: reservationsError,
    refresh,
  } = useReservation();
  const [reservationsLoading, setReservationsLoading] = useState<boolean>(true);
  const { table, isLoading: tableIsLoading, error: tableError } = useTable();
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState<{
    email: string;
    phone: string;
  }>({ email: "", phone: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const {
    reservations: reservationsData,
    setReservations: setReservationsData,
  } = useContext(ReservationContext);

  const router = useRouter();
  const theme = useThemeColor();

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

  function renderReservationItem({
    item,
  }: {
    item: Reservation;
  }): ReactElement {
    return (
      <Card
        style={[styles.orderItem, { backgroundColor: theme.primary }]}
        mode="contained"
        onPress={() => reservationSelect(item.email, item.phone)}
      >
        <Card.Title
          title={item.name}
          titleStyle={{ color: theme.background, fontWeight: "bold" }}
          titleVariant={"titleLarge"}
          right={() => (
            <Card.Actions>
              <Pressable
                style={{
                  borderRadius: 99999,
                }}
                onPress={() => reservationSelect(item.email, item.phone)}
              >
                <FontAwesome5
                  name="info-circle"
                  size={40}
                  color={theme.secondary}
                />
              </Pressable>
            </Card.Actions>
          )}
        />
        <Card.Content>
          <Text style={{ color: theme.secondary }}>
            {dayjs(item.reservationTime).format("DD/MM/YYYY HH:mm")}
          </Text>
          <Text style={{ color: theme.secondary }}>
            Tables:&nbsp;
            {item.Tables ? item.Tables.map((i) => i.number + " ") : null}
          </Text>
        </Card.Content>
      </Card>
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
            data: section.data.filter((reservation) =>
              reservation.email.toLowerCase().includes(text)
            ),
          };
        }
        if (text.includes("+") || !isNaN(Number(text))) {
          return {
            title: section.title,
            data: section.data.filter((reservation) =>
              reservation.phone.toLowerCase().includes(text)
            ),
          };
        }
        return {
          title: section.title,
          data: section.data.filter((reservation) =>
            reservation.name.toLowerCase().includes(text)
          ),
        };
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
        <SearchBar
          value={searchQuery}
          placeholder="Search"
          loading={reservationsLoading}
          onChange={(e) => onChangeSearch(e.nativeEvent.text)}
          onClearIconPress={() => {
            setReservationsData(sortReservations(reservations!));
            setSearchQuery("");
          }}
        />
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
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                paddingVertical: 5,
                backgroundColor: theme.background,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: theme.primary,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              />

              <Text style={{ color: theme.primary, fontSize: 22 }}>
                {title}
              </Text>

              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: theme.primary,
                  alignSelf: "center",
                  marginLeft: 5,
                }}
              />
            </View>
          )}
          renderSectionFooter={() => <View style={{ height: 40 }} />} // Adds 30px of empty space at the bottom of each section
        />

        <AddButton
          onPress={() => setCreateModalVisible(true)}
          requiredPermission={["reservation:create"]}
        />

        <KeyboardAvoidingView>
          <Modal
            animationType="none"
            transparent={true}
            visible={isCreateModalVisible}
            onRequestClose={() => setCreateModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalContent,
                  styles.modalContentNewRes,
                  { backgroundColor: theme.primary },
                ]}
              >
                <NewReservationModal
                  tables={table!}
                  onClose={() => setCreateModalVisible(false)}
                />
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>

        <Modal
          animationType="none"
          transparent={true}
          visible={isInfoModalVisible}
          onRequestClose={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                styles.modalContentInfo,
                { backgroundColor: theme.primary },
              ]}
            >
              <InfoReservationModal
                email={selectedReservations.email}
                phone={selectedReservations.phone}
                onClose={() => setInfoModalVisible(false)}
              />
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
    if (
      dayjs(reservation.reservationTime).isBetween(
        dayjs().subtract(30, "minute"),
        dayjs().add(30, "minute")
      )
    ) {
      const section = reservationsSections.find(
        (section) => section.title === "Now"
      );
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "Now", data: [reservation] });
        return;
      }
    }
    // Check if reservation was today
    if (
      dayjs(reservation.reservationTime).isBefore(
        dayjs().subtract(30, "minute")
      )
    ) {
      const section = reservationsSections.find(
        (section) => section.title === "Was Today"
      );
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
      const section = reservationsSections.find(
        (section) => section.title === "Today"
      );
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
      const section = reservationsSections.find(
        (section) => section.title === "Tomorrow"
      );
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "Tomorrow", data: [reservation] });
        return;
      }
    }
    // Check if reservation is in the next week
    if (
      dayjs(reservation.reservationTime).isBetween(
        dayjs(),
        dayjs().add(7, "day")
      )
    ) {
      const section = reservationsSections.find(
        (section) => section.title === "This Week"
      );
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "This Week", data: [reservation] });
        return;
      }
    }
    // Check if reservation is in the next month
    if (
      dayjs(reservation.reservationTime).isBetween(
        dayjs(),
        dayjs().add(1, "month")
      )
    ) {
      const section = reservationsSections.find(
        (section) => section.title === "This Month"
      );
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "This Month", data: [reservation] });
        return;
      }
    }
    // Check if reservation is in the next year
    if (
      dayjs(reservation.reservationTime).isBetween(
        dayjs(),
        dayjs().add(1, "year")
      )
    ) {
      const section = reservationsSections.find(
        (section) => section.title === "This Year"
      );
      if (section) {
        section.data.push(reservation);
        return;
      } else {
        reservationsSections.push({ title: "This Year", data: [reservation] });
        return;
      }
    }
    // Check if reservation is in the future
    const section = reservationsSections.find(
      (section) => section.title === "Future"
    );
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
  const titleOrder = [
    "Now",
    "Today",
    "Tomorrow",
    "This Week",
    "This Month",
    "This Year",
    "Future",
  ];
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
    // padding: 20,
    margin: 20,
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
    width: "90%",
    maxWidth: 400,
    minHeight: 270,
    padding: 10,
    borderRadius: 10,
  },
  modalContentInfo: {
    minHeight: 270,
  },
  modalContentNewRes: {
    minHeight: 450,
  },

  button: {
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
});
