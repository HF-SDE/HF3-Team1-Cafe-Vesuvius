import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useThemeColor } from "@/hooks/useThemeColor";

type QuantityInputProps = {
  itemId: string;
  initialQty: number; // Change adjustedQty to initialQty for better clarity
  onQuantityChange?: (itemId: string, newQty: number) => void;
};

const QuantityInput: React.FC<QuantityInputProps> = ({
  itemId,
  initialQty,
  onQuantityChange,
}) => {
  const SecondaryColor = useThemeColor({}, "secondary");

  // Local state to manage the quantity
  const [quantity, setQuantity] = useState<number>(initialQty);

  // Function to handle increasing the quantity
  const onIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    if (onQuantityChange) {
      onQuantityChange(itemId, newQty);
    }
  };

  // Function to handle decreasing the quantity
  const onDecrease = () => {
    const newQty = quantity > 0 ? quantity - 1 : 0;
    setQuantity(newQty);
    if (onQuantityChange) {
      onQuantityChange(itemId, newQty);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.itemRow}>
        <TouchableOpacity onPress={onDecrease}>
          <FontAwesome6 name="square-minus" size={45} color={SecondaryColor} />
        </TouchableOpacity>

        <TextInput
          style={[
            styles.textInput,
            { color: SecondaryColor, borderColor: SecondaryColor },
          ]}
          value={quantity.toString()}
          keyboardType="number-pad"
          onChangeText={(text) => {
            const newQty = parseInt(text, 10);
            if (!isNaN(newQty)) {
              setQuantity(newQty);
              onQuantityChange(itemId, newQty);
            }
          }}
        />

        <TouchableOpacity onPress={onIncrease}>
          <FontAwesome6 name="square-plus" size={45} color={SecondaryColor} />
        </TouchableOpacity>
      </View>
      <Text>Current stock {initialQty}</Text>
      <Text>New stock {initialQty + quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  textInput: {
    width: 60,
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 3,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  itemStock: {
    fontSize: 14,
    marginTop: 5,
    marginRight: 5,
    fontWeight: "bold",
  },
});

export default QuantityInput;
