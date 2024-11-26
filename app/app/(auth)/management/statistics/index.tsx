import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TemplateLayout from "@/components/TemplateLayout";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

export default function StatsPage() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const navigation = useNavigation();

  const chartConfig = {
    backgroundColor: PrimaryColor,
    backgroundGradientFrom: PrimaryColor,
    backgroundGradientTo: PrimaryColor,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  const progressData = {
    labels: ["Swim", "Bike", "Run"],
    data: [0.4, 0.6, 0.8],
  };

  const pieData = [
    {
      name: "Groceries",
      population: 40,
      color: "#ff6384",
      legendFontColor: TextColor,
      legendFontSize: 12,
    },
    {
      name: "Bills",
      population: 30,
      color: "#36a2eb",
      legendFontColor: TextColor,
      legendFontSize: 12,
    },
    {
      name: "Entertainment",
      population: 20,
      color: "#ffcd56",
      legendFontColor: TextColor,
      legendFontSize: 12,
    },
    {
      name: "Savings",
      population: 10,
      color: "#4bc0c0",
      legendFontColor: TextColor,
      legendFontSize: 12,
    },
  ];

  return (
    <TemplateLayout pageName="StatsPage" title="Statistics">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.header, { color: TextColor }]}>
          Your Statistics
        </Text>

        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                data: Array.from({ length: 6 }, () => Math.random() * 100),
              },
            ],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />

        <BarChart
          data={{
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
              {
                data: Array.from({ length: 4 }, () => Math.random() * 100),
              },
            ],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />

        <PieChart
          data={pieData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          style={styles.chart}
        />

        <ProgressChart
          data={progressData}
          width={Dimensions.get("window").width - 40}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          style={styles.chart}
        />

        <ContributionGraph
          values={[
            { date: "2023-11-01", count: 1 },
            { date: "2023-11-02", count: 3 },
            { date: "2023-11-03", count: 2 },
            { date: "2023-11-04", count: 4 },
          ]}
          endDate={new Date("2023-11-30")}
          numDays={30}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: PrimaryColor }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: BackgroundColor }]}>
            Back
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
