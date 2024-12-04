import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useFonts } from "expo-font";
import { useThemeColor } from "@/hooks/useThemeColor";

interface DataPoint {
  value: number;
  text: string;
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

  // Calculate the total value of all data points
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Map data to the structure required by react-native-gifted-charts
  const chartData = data.map((item) => ({
    value: item.value,
    color: item.color,
    text: item.text,
  }));

  const renderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          {data.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 120,
                marginRight: 20,
              }}
            >
              {renderDot(item.color)}
              <Text style={{ color: "white" }}>
                {item.text}: {((item.value / totalValue) * 100).toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
      </>
    );
  };
  const radius = width * 0.5;

  return (
    <View
      style={{
        borderRadius: 20,
      }}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Table Utilization Percentage
      </Text>

      <View style={{ padding: 20, alignItems: "center" }}>
        <PieChart
          data={chartData.reverse()}
          donut
          sectionAutoFocus
          radius={radius}
          innerRadius={radius * 0.6}
          innerCircleColor={theme.background}
          centerLabelComponent={() => {
            const usedTables = data.find((item) => item.text === "Used tables");
            const usedTablesPercentage = usedTables
              ? ((usedTables.value / totalValue) * 100).toFixed(0)
              : "0";
            return (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: theme.text,
                    fontWeight: "bold",
                  }}
                >
                  {usedTablesPercentage}%
                </Text>
              </View>
            );
          }}
        />
      </View>
      {renderLegendComponent()}
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
  centerLabel: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    position: "absolute",
  },
});

export default PieChartComponent;
