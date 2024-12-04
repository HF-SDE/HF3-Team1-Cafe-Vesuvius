import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import { useFonts } from "expo-font";
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

  // Load the font
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Show a loading indicator until the font is loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  // Render the labels with the loaded font
  const Labels = ({ slices }: any) =>
    slices.map((slice: any, index: number) => {
      const { pieCentroid, data } = slice;

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
          fontFamily="SpaceMono-Regular" // Use the loaded font
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PieChartComponent;
