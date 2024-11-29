import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useThemeColor } from "@/hooks/useThemeColor";

import TemplateLayout from "@/components/TemplateLayout";

import LoadingPage from "@/components/LoadingPage";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

export default function StatsPage() {
  const theme = useThemeColor();

  const navigation = useNavigation();

  const chartConfig = {
    backgroundColor: theme.accent,
    backgroundGradientFrom: theme.primary,
    backgroundGradientTo: theme.primary,
    decimalPlaces: 2,
    color: (opacity = 1) => theme.secondary,
    labelcolor: (opacity = 1) => theme.secondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.primary,
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
      color: theme.background,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: "Bills",
      population: 30,
      color: theme.secondary,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: "Entertainment",
      population: 20,
      color: theme.accent,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: "Savings",
      population: 10,
      color: theme.text,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
  ];

  return (
    <TemplateLayout pageName="StatsPage" title="Statistics">
      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
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
          yAxisLabel=""
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
          yAxisLabel=""
          yAxisSuffix=""
        />

        <PieChart
          data={pieData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={theme.primary}
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
      </ScrollView>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});