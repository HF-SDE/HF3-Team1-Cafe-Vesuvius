import React, { Dispatch, SetStateAction, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import apiClient from "../../../utils/apiClient";
import { Table } from "@/models/TableModels";
import { Reservation } from "@/models/ReservationModels";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import CustomTextInput from "@/components/TextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import TextIconInput from "@/components/TextIconInput";

interface ModalScreenProps {
  onClose: () => void;
  tables: Table[];
}

export default function NewReservationModal({ onClose, tables }: ModalScreenProps) {
  const [reservation, setReservations] = useState<Reservation>({ email: "example@example.com", name: "Bob", amount: 2, phone: "+4511111111", reservationTime: dayjs().toDate(), tables: [] });
  const [datePicker, setDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tableSelect, setTableSelect] = useState<number>(0);
  const [tableSelectNeed, setTableSelectNeed] = useState<number>(1);
  const [page, setPage] = useState(1);

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const disabledButton = areKeysDefined<Reservation>(["name", "phone", "email", "amount"], reservation);
  const disabledCreateButton = tableSelect !== tableSelectNeed;

  async function handleCreate() {
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

  async function createReservation(): Promise<string> {
    if (!reservation) return "Something went wrong on our end. Please contact support";

    const payload: Reservation = {
      email: reservation.email,
      name: reservation.name,
      amount: Number(reservation.amount),
      phone: reservation.phone,
      reservationTime: reservation.reservationTime,
      tableIds: reservation.tables?.map((table) => table.id),
    };

    try {
      const response = await apiClient.post("/reservation", payload, {
        validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
      });
      return response.status === 201 ? "success" : response.data.message;
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
            <CustomTextInput
              label="Amount of People"
              value={reservation?.amount?.toString()}
              inputMode="numeric"
              clearButtonMode="always"
              enablesReturnKeyAutomatically={true}
              onChangeText={(partySize) => {
                setReservations({ ...reservation!, amount: Number(partySize) });
                setTableSelectNeed(Math.ceil(Number(partySize) / 2));
              }}

            />
            <TextIconInput
              label="Reservation Time"
              value={dayjs(reservation?.reservationTime).format("YYYY-MM-DD HH:mm") ?? dayjs().format("YYYY-MM-DD HH:mm")}
              placeholderTextColor={SecondaryColor}
              icon="calendar"
              editable={false}
              onIconPress={() => setDatePicker(!datePicker)}
              onChangeText={(email) => setReservations({ ...reservation!, email })}
            />

            {
              datePicker
              &&
              <View style={styles.dateTimePicker}>
                <DateTimePicker
                  mode="single"
                  onChange={(date) => { setReservations({ ...reservation!, reservationTime: dayjs(date.date) }); setDatePicker(false) }}
                  date={dayjs(reservation?.reservationTime) ?? dayjs().toDate()}
                  firstDayOfWeek={1}
                  timePicker={true}
                  maxDate={dayjs().add(1, "year").toDate()}
                  minDate={dayjs().toDate()}
                />
              </View>
            }

            {errorMessage ? (
              <Text style={[styles.errorText, { color: "red" }]}>{errorMessage}</Text>
            ) : null}
          </>
          :
          <FlatList ListHeaderComponent={<Text>Tables - {tableSelectNeed} out of {tableSelect} </Text>} numColumns={4} data={tables} renderItem={({ item }) => (
            <Item table={item} setTableSelect={setTableSelect} tableSelect={tableSelect} tableSelectNeed={tableSelectNeed} reservation={[reservation, setReservations]} />
          )} keyExtractor={(item) => item.number?.toString()} contentContainerStyle={styles.listContainer} style={styles.flatList} />

      }
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.cancelButton, { backgroundColor: "#969696" }]}
          onPress={onClose}

        >
          <Text style={styles.buttonText}>cancel</Text>
        </Pressable>
        {page === 1
          ?
          <Pressable
            style={[styles.mainButton, disabledButton ? { backgroundColor: SecondaryColor } : { backgroundColor: PrimaryColor }]}
            onPress={() => setPage(2)}
            disabled={disabledButton}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
          :
          <Pressable
            style={[styles.mainButton, disabledCreateButton ? { backgroundColor: SecondaryColor } : { backgroundColor: PrimaryColor }]}
            onPress={handleCreate}
            disabled={disabledCreateButton}
          >
            <Text style={styles.buttonText}>Create</Text>
          </Pressable>
        }
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}

interface TableProps {
  table: Table;
  tableSelect: number;
  tableSelectNeed: number;
  setTableSelect: Dispatch<SetStateAction<number>>;
  reservation: [Reservation, Dispatch<SetStateAction<Reservation>>]
}


/**
 * The item component for the flatlist
 * @param {TableProps} props - The props for the item
 */
function Item(props: TableProps) {
  const disabled = areItemDisabled(props.table, props.tableSelect, props.tableSelectNeed, [props.reservation[0], props.reservation[1]]);
  const selected = areItemselected(props.table, props.reservation[0]);
  return (
    <Pressable
      style={selected ? { ...styles.item, backgroundColor: "blue" } : disabled ? { ...styles.item, backgroundColor: "#969696" } : styles.item}
      onPress={() => {
        props.reservation[1]({ ...props.reservation[0], tables: [...props.reservation[0].tables!, props.table] });
        props.setTableSelect(props.tableSelect + 1)
      }}
      disabled={selected || disabled}>
      <Text>{props.table.number}</Text>
    </Pressable>
  );
}


/**
 * Check if the item need to be disabled
 * @param {Table} table - The table to check
 * @param {number} tableSelect - The number of tables selected
 * @param {number} tableSelectNeed - The number of tables needed
 * @param {[Reservation, Dispatch<SetStateAction<Reservation>>]} action - The action to update the reservation
 * @returns {boolean} - True if the item should be disabled, false otherwise
 */
function areItemDisabled(table: Table, tableSelect: number, tableSelectNeed: number, action: [Reservation, Dispatch<SetStateAction<Reservation>>]): boolean {
  if (action[0].tables) {
    for (const key in action[0].tables) {
      if (action[0].tables[key].id === table.id) {
        return true;
      }
    }
    if (tableSelect === tableSelectNeed) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}


/**
 * Check if the item is selected
 * @param {Table} table
 * @param {Reservation} reservation
 * @returns {boolean}
 */
function areItemselected(table: Table, reservation: Reservation): boolean {
  if (reservation.tables) {
    for (const key in reservation.tables) {
      if (reservation.tables[key].id === table.id) {
        return true;
      }
    }
    return false;
  }
  return true;
}


/**
 * Check if all keys are defined in the object
 * @template {Record<string, any>} T - The type of the object
 * @param {string[]} keys - The keys to check
 * @param {(T | undefined)} obj - The object to check
 * @returns {boolean} - True if all keys are defined, false otherwise
 */
function areKeysDefined<T extends Record<string, any>>(keys: string[], obj: T | undefined): boolean {
  if (!obj) return true;
  if (keys.every(key => key in obj)) {
    return !keys.every(key => obj[key] !== undefined && obj[key] !== null && obj[key] !== "");
  }
  return true;
}

const styles = StyleSheet.create({
  dateTimePicker: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 2,
    borderRadius: 20,
    padding: 10,
  },
  item: {
    flex: 1,
    maxWidth: "25%",
    alignItems: "center",
    width: "100%",

    padding: 10,
    backgroundColor: "rgba(249, 180, 45, 0.25)",
    borderWidth: 1.5,
    borderColor: "#fff"
  },
  itemDisabled: {
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
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  mainButton: {
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
