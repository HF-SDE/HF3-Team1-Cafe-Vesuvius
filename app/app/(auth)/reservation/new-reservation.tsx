import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import apiClient from "../../../utils/apiClient";
import { Buffer } from "buffer";
import { table } from "@/models/TableModels";
import { Reservation } from "@/models/ReservationModels";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import CustomTextInput from "@/components/TextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import TextIconInput from "@/components/TextIconInput";

interface ModalScreenProps {
  onClose: () => void;
  tables: table[];
}

// Temp data
const tmptables = [
  { id: 'table-1', number: 1 },
  { id: 'table-2', number: 2 },
  { id: 'table-3', number: 3 },
  { id: 'table-4', number: 4 },
  { id: 'table-5', number: 5 },
  { id: 'table-6', number: 6 },
  { id: 'table-7', number: 7 },
  { id: 'table-8', number: 8 },
  { id: 'table-9', number: 9 },
  { id: 'table-10', number: 10 },
  { id: 'table-11', number: 11 },
  { id: 'table-12', number: 12 },
  { id: 'table-13', number: 13 },
  { id: 'table-14', number: 14 },
  { id: 'table-15', number: 15 },
  { id: 'table-16', number: 16 },
  { id: 'table-17', number: 17 },
  { id: 'table-18', number: 18 },
  { id: 'table-19', number: 19 },
  { id: 'table-20', number: 20 },
  { id: 'table-21', number: 21 },
  { id: 'table-22', number: 22 },
  { id: 'table-23', number: 23 },
  { id: 'table-24', number: 24 },
  { id: 'table-25', number: 25 },
  { id: 'table-26', number: 26 },
  { id: 'table-27', number: 27 },
  { id: 'table-28', number: 28 }
];

export default function NewReservationModal({ onClose, tables = tmptables }: ModalScreenProps) {
  const [reservation, setReservations] = useState<Reservation>();
  const [datePicker, setDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const handleReset = async () => {
    if (!reservation?.name || !reservation?.reservationTime || !reservation?.email) {
      setErrorMessage("Please fill out all fields!");
      return;
    }
    if (reservation?.reservationTime !== reservation?.email) {
      setErrorMessage("Passwords does not match!");
      return;
    }

    try {
      const response = await createReservation();
      if (response === "success") {
        onClose(); // Close the modal on success
      } else {
        setErrorMessage(response || "An error occurred.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while create reservation.");
    }
  };

  const createReservation = async (): Promise<string> => {
    if (!reservation) return "Something went wrong on our end. Please contact support";

    if (!reservation.email || !reservation.phone) {
      return "Please fill out all fields!";
    }

    const payload: Reservation = {
      amount: reservation.amount,
      email: reservation.email,
      name: reservation.name,
      phone: reservation.phone,
      reservationTime: reservation.reservationTime,
      tables: reservation.tables,
    };

    try {
      //const response = await apiClient.put("/profile/reset", payload);
      const response = await apiClient.post("/reservation/reset", payload, {
        validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
      });
      return response.status === 200 ? "success" : response.data.message;
    } catch {
      return "Something went wrong on our end. Please contact support";
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: BackgroundColor }]}>
      <Text style={[styles.title, { color: TextColor }]}>New Reservations</Text>
      {
        page === 1 ?
          <>
            <CustomTextInput
              label="Name"
              value={reservation?.name}
              inputMode="text"
              clearButtonMode="always"
              autoCapitalize="words"
              enablesReturnKeyAutomatically={true}
              onChangeText={(name) => setReservations({ ...reservation!, name })}
            />
            <CustomTextInput
              label="Phone"
              value={reservation?.phone}
              inputMode="tel"
              clearButtonMode="always"
              enablesReturnKeyAutomatically={true}
              onChangeText={(phone) => setReservations({ ...reservation!, phone })}
            />
            <CustomTextInput
              label="Email"
              value={reservation?.email}
              inputMode="email"
              clearButtonMode="always"
              enablesReturnKeyAutomatically={true}
              onChangeText={(email) => setReservations({ ...reservation!, email })}
            />
            <TextIconInput
              label="Reservation Time"
              value={reservation?.reservationTime?.toString() ?? dayjs().format("YYYY-MM-DD HH:mm")}
              placeholderTextColor={SecondaryColor}
              icon="calendar"
              onIconPress={() => setDatePicker(!datePicker)}
              onChangeText={(email) => setReservations({ ...reservation!, email })}
            />

            {
              datePicker
              &&
              <DateTimePicker
                mode="single"
                onChange={(date) => { setReservations({ ...reservation!, reservationTime: dayjs(date.date) }); }}
                date={dayjs((reservation?.reservationTime || new Date()))}
                firstDayOfWeek={1}
                timePicker={true}
              />
            }

            {errorMessage ? (
              <Text style={[styles.errorText, { color: "red" }]}>{errorMessage}</Text>
            ) : null}
          </>
          :
          <FlatList ListHeaderComponent={<Text>Tables</Text>} numColumns={4} data={tables} renderItem={({ item }) => (
            <Item {...item} />
          )} keyExtractor={(item) => item.number.toString()} contentContainerStyle={styles.listContainer} style={styles.flatList} />

      }
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: PrimaryColor }]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: "#969696" }]}
          onPress={page === 1 ? () => setPage(2) : onClose}
        >
          <Text style={styles.buttonText}>{page === 1 ? "Next" : "Create"}</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );

}

function Item(props: table) {
  return (
    <View style={styles.item}>
      <Text>{props.number}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    maxWidth: "25%", // 100% devided by the number of rows you want
    alignItems: "center",
    width: "100%",

    // my visual styles; not important for the grid
    padding: 10,
    backgroundColor: "rgba(249, 180, 45, 0.25)",
    borderWidth: 1.5,
    borderColor: "#fff"
  },
  listContainer: {
    padding: 16,
  },
  flatList: {
    flex: 1,
    alignContent: "center",
    width: "100%", // Ensures the FlatList spans the full width
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});
