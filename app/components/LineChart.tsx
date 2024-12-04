import React from "react";
import { Grid, LineChart, XAxis, YAxis } from "react-native-svg-charts";
import { curveMonotoneX } from "d3-shape";
import { Circle } from "react-native-svg";
import { View, StyleSheet, DimensionValue } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

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

  const axesSvg = { fontSize: 10, fill: theme.primary };

  const horizontalContentInset = { left: 6, right: 6 }; // Adjusted insets

  return (
    <View style={styles.container}>
      <YAxis
        data={data.map((item) => item.value)}
        style={styles.yAxis}
        contentInset={verticalContentInset}
        svg={axesSvg}
      />
      <View style={[styles.chartContainer, { maxWidth: width }]}>
        <LineChart
          style={styles.chart}
          data={data.map((item) => item.value)}
          contentInset={{ ...verticalContentInset, ...horizontalContentInset }}
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
            ...axesSvg,
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
});

export default AxesExample;
