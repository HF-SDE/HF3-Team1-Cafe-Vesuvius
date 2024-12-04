import React from "react";
import { LineChart } from "react-native-gifted-charts";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFonts } from "expo-font";

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

  // Display a loading indicator while the font is loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  // Prepare data for GiftedCharts
  const chartData = data.map((item) => ({
    value: item.value,
    label: item.name,
  }));

  return (
    <View style={[styles.container, { width: "100%" }]}>
      <LineChart
        data={chartData}
        height={height}
        isAnimated
        //adjustToWidth // HERE
        dashWidth={1}
        dashGap={15}
        showVerticalLines
        verticalLinesUptoDataPoint
        dataPointsColor1={theme.primary}
        dataPointsRadius1={6}
        curved={true}
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

          pointerColor: "lightgray",
          radius: 4,
          pointerLabelWidth: 100,
          pointerLabelHeight: 120,
          pointerLabelComponent: (items: any) => {
            return (
              <View
                style={{
                  height: 40,
                  width: 100,
                  backgroundColor: "#282C3E",
                  borderRadius: 4,
                  justifyContent: "center",
                  paddingLeft: 16,
                }}
              >
                <Text style={{ color: "lightgray", fontSize: 12 }}>
                  {"TEST"}
                </Text>
                <Text style={{ color: "white", fontWeight: "bold" }}>
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AxesExample;
