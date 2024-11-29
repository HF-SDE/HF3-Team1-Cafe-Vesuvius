import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  const disabledColor = "#ccc";
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={onPrevPage}
        disabled={isPrevDisabled}
        style={[
          styles.paginationButton,
          { backgroundColor: PrimaryColor, borderColor: SecondaryColor },
          isPrevDisabled && styles.disabledButton,
        ]}
      >
        <FontAwesome6
          name="arrow-left"
          size={30}
          color={isPrevDisabled ? disabledColor : SecondaryColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNextPage}
        disabled={isNextDisabled}
        style={[
          styles.paginationButton,
          { backgroundColor: PrimaryColor, borderColor: SecondaryColor },
          isNextDisabled && styles.disabledButton,
        ]}
      >
        <FontAwesome6
          name="arrow-right"
          size={30}
          color={isNextDisabled ? disabledColor : SecondaryColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 70,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  paginationButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 5,
    borderStyle: "solid",
  },
  disabledButton: {
    visibility: "hidden",
    opacity: 0,
  },
});

export default Pagination;
