import React from "react";
import { View, StyleSheet } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import { useThemeColor } from "@/hooks/useThemeColor";

interface DataPoint {
  value: number;
  label: string;
  color: string;
}

interface PieChartProps {
  data: DataPoint[];
  height?: number;
  width?: number;
}

const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  height = 200,
  width = 200,
}) => {
  const theme = useThemeColor();

  const Labels = ({ slices }: any) =>
    slices.map((slice: any, index: number) => {
      const { pieCentroid, data } = slice;

      // Ensure `data.label` is a string before rendering
      const label =
        typeof data.label === "string" ? data.label : String(data.label);

      return (
        <Text
          key={data.label}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={theme.text}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={12}
        >
          {label}
        </Text>
      );
    });

  return (
    <View style={styles.container}>
      <PieChart
        style={{ height, width }}
        valueAccessor={({ item }: { item: DataPoint }) => item.value}
        data={data.map((item) => ({
          value: item.value,
          svg: { fill: item.color },
          label: item.label,
        }))}
        spacing={0}
      >
        <Labels />
      </PieChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PieChartComponent;
