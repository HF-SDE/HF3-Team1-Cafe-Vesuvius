import React, { useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFonts } from "expo-font";

import {
  triggerHapticFeedback,
  ImpactFeedbackStyle,
} from "@/utils/hapticFeedback";

interface DataPoint {
  value: number;
  name: string;
  year: string;
}

interface AxesExampleProps {
  data: Array<DataPoint>;
  width: number;
  height?: number;
}

const AxesExample: React.FC<AxesExampleProps> = ({
  data,
  width,
  height = 300,
}) => {
  const theme = useThemeColor();

  // Load custom font
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Extract unique years and find the newest year
  const uniqueYears = Array.from(new Set(data.map((item) => item.year))).sort(
    (a, b) => Number(b) - Number(a)
  );
  const newestYear = uniqueYears[0];

  const [selectedYear, setSelectedYear] = useState<string>(newestYear);

  // Display a loading indicator while the font is loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  // Filter data for the selected year
  const filteredData = data
    .filter((item) => item.year === selectedYear)
    .map((item) => ({
      value: item.value,
      label: item.name,
      year: item.year,
    }));

  const containerPadding = 20;
  const chartWidth = width - 2 * containerPadding;

  const maxValue =
    Math.ceil(Math.max(...filteredData.map((x) => x.value)) / 10) * 10;

  return (
    <View
      style={[
        styles.container,
        { width: "100%", paddingHorizontal: containerPadding },
      ]}
    >
      {/* Year Selection */}
      <View style={styles.yearSelector}>
        {uniqueYears.reverse().map((year) => (
          <TouchableOpacity
            key={year}
            onPress={() => {
              setSelectedYear(year);
              // Trigger haptic feedback when a year is selected
              triggerHapticFeedback(ImpactFeedbackStyle.Medium);
            }}
            style={[
              styles.yearButton,
              selectedYear === year && { backgroundColor: theme.primary },
              { borderColor: theme.primary },
            ]}
          >
            <Text
              style={[
                styles.yearText,
                {
                  color: selectedYear === year ? theme.accent : theme.text,
                },
              ]}
            >
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <LineChart
        data={filteredData}
        maxValue={maxValue}
        height={height}
        isAnimated
        width={chartWidth}
        spacing={chartWidth / (filteredData.length - 0.2 || 1)}
        showVerticalLines
        verticalLinesUptoDataPoint
        dataPointsColor1={theme.primary}
        dataPointsRadius1={6}
        curved
        rotateLabel
        color={theme.primary}
        xAxisColor={theme.primary}
        yAxisColor={theme.primary}
        xAxisLabelTextStyle={{
          color: theme.text,
          fontSize: 10,
          fontFamily: "SpaceMono-Regular",
        }}
        yAxisTextStyle={{
          color: theme.text,
          fontSize: 10,
          fontFamily: "SpaceMono-Regular",
        }}
        pointerConfig={{
          pointerStripUptoDataPoint: true,
          autoAdjustPointerLabelPosition: true,
          showPointerStrip: false,
          pointerColor: theme.accent,
          radius: 4,
          pointerLabelWidth: 100,
          pointerLabelHeight: 120,

          pointerLabelComponent: (items: any) => {
            triggerHapticFeedback();

            return (
              <View
                style={{
                  height: 40,
                  width: 100,
                  backgroundColor: theme.accent,
                  borderRadius: 4,
                  justifyContent: "center",
                  paddingLeft: 16,
                }}
              >
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 12,
                    fontFamily: "SpaceMono-Regular",
                  }}
                >
                  {items[0].label} {items[0].year}
                </Text>
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "bold",
                    fontFamily: "SpaceMono-Regular",
                  }}
                >
                  {items[0].value}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  yearSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    alignItems: "center",
  },
  yearButton: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 2,
  },
  yearText: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AxesExample;
