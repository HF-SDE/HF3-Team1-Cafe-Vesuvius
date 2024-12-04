import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFonts } from "expo-font";

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
  xAxisHeight = 70,
  width,
}) => {
  const theme = useThemeColor();

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
  }));

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.chartContainer, { width }]}>
        <BarChart
          data={chartData}
          noOfSections={4}
          width={500}
          parentWidth={500}
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
          yAxisLabelTexts={chartData.map((item) => `${item.value}`)}
          xAxisLabelTexts={chartData.map((item) => item.label)}
          showValuesAsTopLabel
          rotateLabel
          spacing={20}
          disableScroll={true}
          disablePress
          labelsExtraHeight={80}
          labelWidth={80}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AxesExample;
