import React from "react";
import { Grid, BarChart, XAxis, YAxis } from "react-native-svg-charts";
import { View, StyleSheet, DimensionValue } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface DecoratorProps {
  x: (arg: number) => number;
  y: (arg: number) => number;
  data: number[];
}

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

  const axesSvg = { fontSize: 10, fill: theme.primary };

  return (
    <View style={styles.container}>
      <YAxis
        data={data.map((item) => item.value)}
        style={styles.yAxis}
        contentInset={verticalContentInset}
        svg={axesSvg}
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
            ...axesSvg,
            rotation: 10, // Rotating by 30 degrees
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
});

export default AxesExample;
