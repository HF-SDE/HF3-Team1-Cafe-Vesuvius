import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal,
  Pressable,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFonts } from "expo-font";
import NavBackground from "./NavBackground";

interface DataPoint {
  value: number;
  name: string;
}

interface AxesExampleProps {
  data: Array<DataPoint>;
  label: string;
  verticalContentInset?: { top: number; bottom: number };
  xAxisHeight?: number;
  width: number;
}

const AxesExample: React.FC<AxesExampleProps> = ({
  data,
  label,
  verticalContentInset = { top: 10, bottom: 10 },
  xAxisHeight = 30,
  width,
}) => {
  const theme = useThemeColor();
  const [selectedData, setSelectedData] = useState<DataPoint | null>(null);

  // Load custom font
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Display a loading indicator while the font is loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  // Map data for react-native-gifted-charts
  const chartData = data.map((item) => ({
    value: item.value,
    label: item.name,
    frontColor: theme.primary,
    onPress: () => setSelectedData(item), // Show modal on press
  }));

  const containerPadding = 20;
  const chartWidth = width - 2 * containerPadding;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.chartContainer, { width }]}>
        <BarChart
          data={chartData}
          noOfSections={4}
          width={chartWidth}
          barWidth={(chartWidth * 0.75) / chartData.length}
          spacing={(chartWidth * 0.2) / chartData.length}
          barBorderRadius={4}
          xAxisThickness={1}
          yAxisThickness={1}
          xAxisColor={theme.primary}
          yAxisColor={theme.primary}
          xAxisLabelTextStyle={{
            color: theme.primary,
            fontSize: 10,
            fontFamily: "SpaceMono-Regular",
          }}
          yAxisTextStyle={{
            color: theme.primary,
            fontSize: 10,
            fontFamily: "SpaceMono-Regular",
          }}
          xAxisLabelTexts={chartData.map((item) => item.label)}
          showValuesAsTopLabel
          rotateLabel
          disableScroll={true}
          topLabelTextStyle={{
            color: theme.text,
            fontSize: 12,
            fontFamily: "SpaceMono-Regular",
          }}
        />
      </View>

      {selectedData && (
        <Modal
          animationType="none"
          transparent={true}
          visible={!!selectedData}
          onRequestClose={() => setSelectedData(null)}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.background },
              ]}
            >
              <Text style={[styles.modalText, { color: theme.text }]}>
                {selectedData.name}
              </Text>
              <Pressable
                style={[styles.closeButton, { backgroundColor: theme.primary }]}
                onPress={() => setSelectedData(null)}
              >
                <Text style={{ color: theme.background }}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  chartContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default AxesExample;
