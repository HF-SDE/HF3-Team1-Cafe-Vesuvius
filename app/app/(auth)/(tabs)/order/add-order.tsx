import { StyleSheet, View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function AddOrderScreen() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const navigation = useNavigation();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Example reservations (replace with your actual data)
  const reservations = [
    { id: 1, name: "Reservation 1" },
    { id: 2, name: "Reservation 2" },
    { id: 3, name: "Reservation 3" },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'New Order',
      headerBackVisible: false,
      headerLeft: () => null,
      headerTitleAlign: "center",
      headerStyle: { backgroundColor: PrimaryColor },
      headerTintColor: BackgroundColor,
    });
  }, [navigation]);

  const handleOrderSubmission = () => {
    console.log('Order Submitted:', {
      reservation: selectedReservation,
      // Add productName, quantity, and price if needed
    });
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: SecondaryColor }]}>
      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search reservations..."
        placeholderTextColor="gray"
        value={selectedReservation ? filteredReservations.find(res => res.id === selectedReservation)?.name : searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setShowDropdown(false)}
      />

      {showDropdown && filteredReservations.length > 0 && (
        <FlatList
          data={filteredReservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                //setSelectedReservation(item.id);
                setSearchQuery(item.name);
                setShowDropdown(false);
              }}
            >
              <Text style={{ color: TextColor }}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}

      {/* Spacer to fill space between input and buttons */}
      <View style={styles.spacer} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: PrimaryColor }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: BackgroundColor }]}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: PrimaryColor }]}
          onPress={handleOrderSubmission}
        >
          <Text style={[styles.buttonText, { color: BackgroundColor }]}>
            Submit Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    maxHeight: 150,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  spacer: {
    flex: 1,
  },
});
