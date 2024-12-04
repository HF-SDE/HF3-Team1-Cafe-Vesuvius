import React from "react";
import { Grid, LineChart, XAxis, YAxis } from "react-native-svg-charts";
import { curveMonotoneX } from "d3-shape";
import { Circle } from "react-native-svg";
import {
  View,
  StyleSheet,
  DimensionValue,
  ActivityIndicator,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFonts } from "expo-font";

interface DecoratorProps {
  x: (arg: number) => number;
  y: (arg: number) => number;
  data: number[];
}

export const Dots = (props: Partial<DecoratorProps>) => {
  const theme = useThemeColor();

  const { x, y, data } = props;
  const defaultFn = (value: any) => value;

  return (
    <>
      {data?.map((value, index) => (
        <Circle
          key={index}
          cx={(x ?? defaultFn)(index)}
          cy={(y ?? defaultFn)(value)}
          r={6}
          stroke={"rgb(0, 0, 0)"}
          fill={theme.primary}
        />
      ))}
    </>
  );
};

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
        <LineChart
          style={styles.chart}
          data={data.map((item) => item.value)}
          contentInset={verticalContentInset}
          svg={{ stroke: theme.primary, strokeWidth: 2 }}
          curve={curveMonotoneX}
        >
          <Grid
            svg={{ stroke: theme.primary, strokeWidth: 0.5 }}
            style={{ width: 200 }}
          />
          <Dots />
        </LineChart>
        <XAxis
          style={[styles.xAxis, { height: xAxisHeight }]}
          data={data.map((item, index) => index)}
          formatLabel={(index: number) => data[index].name}
          contentInset={{ left: 40, right: 20 }}
          svg={{
            ...axesSvg, // Apply the font to X-axis labels
            rotation: 30,
            y: 15,
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
