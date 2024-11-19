import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import apiClient from "../../../utils/apiClient";
import { Buffer } from "buffer";
import { table } from "@/models/TableModels";
import { Reservation } from "@/models/ReservationModels";
import DatePicker from "react-native-date-picker";

interface ModalScreenProps {
  onClose: () => void;
}

export default function NewReservationModal({ onClose }: ModalScreenProps) {
  const [reservation, setReservations] = useState<Reservation>();
  const [datePicker, setDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
      <Text style={[styles.title, { color: TextColor }]}>Reset Password</Text>

      <TextInput
        style={[styles.input, { borderColor: PrimaryColor, color: TextColor }]}
        placeholder="Name"
        placeholderTextColor={SecondaryColor}
        value={reservation?.name}
        onChangeText={(name) => setReservations({ ...reservation!, name })}
      />
      <TextInput
        style={[styles.input, { borderColor: PrimaryColor, color: TextColor }]}
        placeholder="Phone"
        placeholderTextColor={SecondaryColor}
        inputMode="tel"
        value={reservation?.phone}
        onChangeText={(phone) => setReservations({ ...reservation!, phone })}
      />
      <TextInput
        style={[styles.input, { borderColor: PrimaryColor, color: TextColor }]}
        placeholder="email"
        placeholderTextColor={SecondaryColor}
        secureTextEntry
        value={reservation?.email}
        onChangeText={(email) => setReservations({ ...reservation!, email })}
      />

      <DatePicker
        onDateChange={(date) => { setReservations({ ...reservation!, reservationTime: date }); }}
        date={new Date(reservation?.reservationTime || new Date())}
      />

      {errorMessage ? (
        <Text style={[styles.errorText, { color: "red" }]}>{errorMessage}</Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: PrimaryColor }]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: "#969696" }]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
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
