import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TemplateLayout from "@/components/TemplateLayout";

export default function AddOrderScreen() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const navigation = useNavigation();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <TemplateLayout pageName="UsersPage" title="Users">
      <View style={[styles.container]}>
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
        </View>
      </View>
    </TemplateLayout>
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
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    width: "100%",
    maxHeight: 150,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
