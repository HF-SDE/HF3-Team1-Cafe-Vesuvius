import React from "react";
import { Grid, BarChart, XAxis, YAxis } from "react-native-svg-charts";
import {
  View,
  StyleSheet,
  DimensionValue,
  ActivityIndicator,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFonts } from "expo-font";

interface DataPoint {
  value: number;
  name: string;
}

interface AxesExampleProps {
  data: Array<DataPoint>;
  verticalContentInset?: { top: number; bottom: number };
  xAxisHeight?: number;
  width: DimensionValue;
}

const AxesExample: React.FC<AxesExampleProps> = ({
  data,
  verticalContentInset = { top: 10, bottom: 10 },
  xAxisHeight = 30,
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

  // Define custom SVG styles for axes using the loaded font
  const axesSvg = {
    fontSize: 10,
    fill: theme.primary,
    fontFamily: "SpaceMono-Regular", // Use the custom font
  };

  return (
    <View style={styles.container}>
      <YAxis
        data={data.map((item) => item.value)}
        style={styles.yAxis}
        contentInset={verticalContentInset}
        svg={axesSvg} // Apply the font to Y-axis labels
      />
      <View style={[styles.chartContainer, { maxWidth: width }]}>
        <BarChart
          style={styles.chart}
          data={data.map((item) => item.value)}
          contentInset={verticalContentInset}
          svg={{ fill: theme.primary }} // Set the bar color
        >
          <Grid
            svg={{ stroke: theme.primary, strokeWidth: 0.5 }}
            style={{ width: 200 }}
          />
        </BarChart>
        <XAxis
          style={[styles.xAxis, { height: xAxisHeight }]}
          data={data.map((item) => item.name)}
          formatLabel={(index: number) => data[index].name}
          contentInset={{ left: 60, right: 80 }}
          svg={{
            ...axesSvg, // Apply the font to X-axis labels
            rotation: 10, // Slight rotation for better readability
            y: 10,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    padding: 20,
    flexDirection: "row",
  },
  yAxis: {
    marginBottom: 30,
  },
  chartContainer: {
    marginLeft: 10,
    width: "100%",
  },
  chart: {
    flex: 1,
    paddingRight: 40,
  },
  xAxis: {
    marginHorizontal: -10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AxesExample;
