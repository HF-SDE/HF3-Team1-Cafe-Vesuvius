import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
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
import Button from "@/components/DefaultButton";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import NewReservationsItem from "@/components/reservations/NewReservationsItem";

interface ModalScreenProps {
  onClose: () => void;
  tables: Table[];
  reservations: Reservation[];
}

interface TextInputsProps {
  label: string;
  value: string;
  isError: boolean;
}

type TextInputsKeys = "name" | "phone" | "email" | "amount";

interface TextInputs {
  name: TextInputsProps;
  phone: TextInputsProps;
  email: TextInputsProps;
  amount: TextInputsProps;
}

/**
 * New reservation modal
 * @param {() => void} onClose - On close function
 * @param {Table[]} tables - Tables
 * @param {Reservation[]} reservations - Reservations
 * @returns {ReactElement}
 */
export default function NewReservationModal({
  onClose,
  tables,
  reservations,
}: ModalScreenProps): ReactElement {
  const [reservation, setReservations] = useState<Reservation>({
    email: "",
    name: "",
    amount: 2,
    phone: "",
    reservationTime: dayjs().toDate(),
    Tables: [],
  });
  const [datePicker, setDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tableSelect, setTableSelect] = useState<number>(0);
  const [tableSelectNeed, setTableSelectNeed] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [textInputs, setTextInputs] = useState<TextInputs>({
    amount: {
      label: "Amount of People",
      value: reservation.amount.toString(),
      isError: false,
    },
    email: { label: "Email", value: reservation.email, isError: false },
    name: { label: "Name", value: reservation.name, isError: false },
    phone: { label: "Phone", value: reservation.phone, isError: false },
  });

  const theme = useThemeColor();

  const disabledButton = areKeysDefined<Reservation>(
    ["name", "phone", "email", "amount"],
    reservation
  );

  /**
   * Handle the create reservation
   * @returns {Promise<void>}
   */
  async function handleCreate(): Promise<void> {
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
  }

  /**
   * Create a reservation
   * @returns {Promise<string>}
   */
  async function createReservation(): Promise<string> {
    if (!reservation)
      return "Something went wrong on our end. Please contact support";

    const payload: Reservation = {
      email: reservation.email,
      name: reservation.name,
      amount: Number(reservation.amount),
      phone: reservation.phone,
      reservationTime: reservation.reservationTime,
      tableIds: reservation.Tables?.map((table) => table.id),
    };

    try {
      const response = await apiClient.post("/reservation", payload, {
        validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
      });
      return response.status === 201 ? "success" : response.data.message;
    } catch {
      return "Something went wrong on our end. Please contact support";
    }
  }

  /**
   * Load the table
   * @param {Table[]} tables - The table to load
   * @returns {ReactElement}
   */
  function loadTables(tables: Table[]): Table[] {
    const tableStartTime = dayjs(reservation.reservationTime);
    const tableEndTime = dayjs(reservation.reservationTime).add(3, "hour");
    const tableDay = dayjs(reservation.reservationTime).format("YYYY-MM-DD");

    return tables.map((table) => {
      const tableReservations = reservations.filter((res) => {
        if (res.Tables?.some((t) => t.id === table.id)) {
          return dayjs(res.reservationTime).format("YYYY-MM-DD") === tableDay;
        }
      });

      const available = tableReservations.every(
        (res) =>
          dayjs(res.reservationTime).isBefore(tableStartTime) ||
          dayjs(res.reservationTime).isAfter(tableEndTime)
      );
      return { ...table, available };
    });
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {page === 2 && (
        <TouchableOpacity
          style={[styles.backButton, { marginLeft: 10 }]} // Adjust margin as needed
          onPress={() => setPage(1)}
        >
          <FontAwesome6 name="arrow-left" size={20} color={theme.text} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: theme.text }]}>
        New Reservations
      </Text>
      {page === 1 ? (
        <>
          <CustomTextInput
            label={textInputs.name.label}
            value={reservation?.name}
            inputMode="text"
            clearButtonMode="always"
            autoCapitalize="words"
            enablesReturnKeyAutomatically={true}
            onChangeText={(name) => {
              setReservations({ ...reservation!, name });
              validateTextInput("name", name, setTextInputs);
            }}
            error={textInputs.name.isError}
          />
          <CustomTextInput
            label={textInputs.phone.label}
            value={reservation?.phone}
            inputMode="tel"
            clearButtonMode="always"
            enablesReturnKeyAutomatically={true}
            onChangeText={(phone) => {
              setReservations({ ...reservation!, phone });
              validateTextInput("phone", phone, setTextInputs);
            }}
            error={textInputs.phone.isError}
          />
          <CustomTextInput
            label={textInputs.email.label}
            value={reservation?.email}
            inputMode="email"
            clearButtonMode="always"
            enablesReturnKeyAutomatically={true}
            onChangeText={(email) => {
              setReservations({ ...reservation!, email });
              validateTextInput("email", email, setTextInputs);
            }}
            error={textInputs.email.isError}
          />
          <CustomTextInput
            label={textInputs.amount.label}
            value={reservation?.amount?.toString()}
            inputMode="numeric"
            clearButtonMode="always"
            enablesReturnKeyAutomatically={true}
            onChangeText={(partySize) => {
              setReservations({ ...reservation!, amount: Number(partySize) });
              setTableSelectNeed(Math.ceil(Number(partySize) / 2));
              validateTextInput("amount", partySize, setTextInputs);
            }}
            error={textInputs.amount.isError}
          />
          <TextIconInput
            label="Reservation Time"
            value={
              dayjs(reservation?.reservationTime).format("YYYY-MM-DD HH:mm") ??
              dayjs().format("YYYY-MM-DD HH:mm")
            }
            placeholderTextColor={theme.secondary}
            icon="calendar"
            iconColor={theme.primary}
            editable={false}
            onIconPress={() => setDatePicker(!datePicker)}
            onChangeText={(email) =>
              setReservations({ ...reservation!, email })
            }
            clearTextOnFocus={false}
          />

          {datePicker && (
            <View
              style={[
                styles.dateTimePicker,
                { backgroundColor: theme.primary },
              ]}
            >
              <DateTimePicker
                mode="single"
                onChange={(date) => {
                  setReservations({
                    ...reservation!,
                    reservationTime: dayjs(date.date),
                  });
                  setDatePicker(false);
                }}
                date={dayjs(reservation?.reservationTime) ?? dayjs().toDate()}
                firstDayOfWeek={1}
                timePicker={true}
                maxDate={dayjs().add(1, "year").toDate()}
                minDate={dayjs().toDate()}
                selectedItemColor={theme.background}
                calendarTextStyle={{ color: theme.background }}
                timePickerTextStyle={{ color: theme.background }}
                selectedTextStyle={{ color: theme.primary }}
                headerTextStyle={{ color: theme.background }}
                headerButtonColor={theme.secondary}
                weekDaysTextStyle={{ color: theme.background }}
                headerTextContainerStyle={{ backgroundColor: theme.primary }}
                monthContainerStyle={{ backgroundColor: theme.primary }}
              />
            </View>
          )}

          {errorMessage ? (
            <Text style={[styles.errorText, { color: "red" }]}>
              {errorMessage}
            </Text>
          ) : null}
        </>
      ) : (
        <FlatList
          ListHeaderComponent={
            <Text
              style={[styles.reservationSelectorLabel, { color: theme.text }]}
            >
              Tables - {tableSelect} out of {tableSelectNeed}{" "}
            </Text>
          }
          numColumns={4}
          data={loadTables(tables)}
          renderItem={({ item }) => (
            <NewReservationsItem
              table={item}
              setTableSelect={setTableSelect}
              tableSelect={tableSelect}
              tableSelectNeed={tableSelectNeed}
              reservation={[reservation, setReservations]}
              disabled={!item.available}
            />
          )}
          keyExtractor={(item) => item.number?.toString()}
          contentContainerStyle={styles.listContainer}
          style={styles.flatList}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onClose}
          backgroundColor={theme.accent}
          textColor={theme.text}
        />
        {page === 1 ? (
          <Button
            title={"Next"}
            onPress={() => setPage(2)}
            disabled={disabledButton}
            backgroundColor={
              disabledButton ? `${theme.primary}60` : theme.primary
            }
          />
        ) : (
          <Button title={"Create"} onPress={handleCreate} />
        )}
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}

/**
 * Check if all keys are defined in the object
 * @param {TextInputsKeys} field - The field to validate
 * @param {string} value - The value to validate
 * @param {Dispatch<SetStateAction<TextInputs>>} setTextInputs - The state setter
 */
function validateTextInput(
  field: TextInputsKeys,
  value: string,
  setTextInputs: Dispatch<SetStateAction<TextInputs>>
): void {
  if (field === "email" && !value.includes("@")) {
    setTextInputs((prev) => ({
      ...prev,
      [field]: { ...prev[field], isError: true },
    }));
    return;
  }
  if (field === "phone") {
    if (isNaN(Number(value)) && !value.startsWith("+")) {
      setTextInputs((prev) => ({
        ...prev,
        [field]: { ...prev[field], isError: true },
      }));
      return;
    }
    if (value.startsWith("+") && isNaN(Number(value.replace("+", "")))) {
      setTextInputs((prev) => ({
        ...prev,
        [field]: { ...prev[field], isError: true },
      }));
      return;
    }
    if (value.length < 5) {
      setTextInputs((prev) => ({
        ...prev,
        [field]: { ...prev[field], isError: true },
      }));
      return;
    }
  }
  if (field === "amount" && isNaN(Number(value))) {
    setTextInputs((prev) => ({
      ...prev,
      [field]: { ...prev[field], isError: true },
    }));
    return;
  }
  if (field === "name" && value.length < 2) {
    setTextInputs((prev) => ({
      ...prev,
      [field]: { ...prev[field], isError: true },
    }));
    return;
  }
  setTextInputs((prev) => ({
    ...prev,
    [field]: { ...prev[field], isError: false },
  }));
}

/**
 * Check if all keys are defined in the object
 * @template {Record<string, any>} T - The type of the object
 * @param {string[]} keys - The keys to check
 * @param {(T | undefined)} obj - The object to check
 * @returns {boolean} - True if all keys are defined, false otherwise
 */
function areKeysDefined<T extends Record<string, any>>(
  keys: string[],
  obj: T | undefined
): boolean {
  if (!obj) return true;
  if (keys.every((key) => key in obj)) {
    return !keys.every(
      (key) => obj[key] !== undefined && obj[key] !== null && obj[key] !== ""
    );
  }
  return true;
}

const styles = StyleSheet.create({
  dateTimePicker: {
    position: "absolute",
    zIndex: 2,
    borderRadius: 20,
    padding: 10,
  },
  itemDisabled: {
    flex: 1,
    maxWidth: "25%",
    alignItems: "center",
    width: "100%",

    // my visual styles; not important for the grid
    padding: 10,
    backgroundColor: "rgba(249, 180, 45, 0.25)",
    borderWidth: 1.5,
    // borderColor: "red",
  },
  listContainer: {
    padding: 16,
  },
  flatList: {
    flex: 1,
    alignContent: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    // marginRight: 10,
  },
  mainButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    // color: "red",
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
  reservationSelectorLabel: {
    textAlign: "center",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10, // Adjust the vertical position
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
