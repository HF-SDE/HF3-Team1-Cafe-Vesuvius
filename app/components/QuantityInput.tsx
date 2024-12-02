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
  onQuantityChanged?: (id: string, quantity: number) => void;
};

const QuantityInput: React.FC<QuantityInputProps> = ({
  itemId,
  initialQty,
  onQuantityChanged,
}) => {
  const theme = useThemeColor();

  // Local state to manage the quantity
  const [quantity, setQuantity] = useState<string>(initialQty.toString());

  const handleBlur = () => {
    // Convert quantity to a number when the input loses focus
    const numericQuantity = parseFloat(quantity);
    if (onQuantityChanged) {
      onQuantityChanged(itemId, numericQuantity); // Optionally handle quantity change
    }
    console.log("LEAVE");
  };

  return (
    <TextInput
      style={[styles.quantityInput, { borderColor: theme.secondary }]}
      value={quantity.toString()}
      keyboardType="decimal-pad"
      onChangeText={(text) => {
        text = text.replace(",", ".");

        const decimalIndex = text.indexOf(".");
        if (decimalIndex !== -1 && text.length - decimalIndex > 3) {
          // Limit to two decimals
          return;
        }

        if (text === "") {
          setQuantity("0");
          return;
        }
        if (text === ".") {
          setQuantity("0.");
          return;
        }
        if (text.split(".").length - 1 >= 2) {
          return;
        }

        if (text.charAt(text.length - 1) === ".") {
          setQuantity(text);
          return;
        }

        const parsedValue = parseFloat(text);

        if (isNaN(parsedValue)) {
          setQuantity("0");
          return;
        }

        const clampedValue = Math.min(parsedValue, 9999);

        const roundedValue = Math.round(clampedValue * 100) / 100;
        setQuantity(roundedValue.toString());
      }}
      onBlur={handleBlur}
    />
  );
};

const styles = StyleSheet.create({
  quantityInput: {
    width: 60,
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    textAlign: "center",
  },
});

export default QuantityInput;
