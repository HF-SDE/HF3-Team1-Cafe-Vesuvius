import {
  StyleSheet,
  View,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";

import { useStats } from "@/hooks/useStats";

import TemplateLayout from "@/components/TemplateLayout";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";

export default function StatsPage() {
  const theme = useThemeColor();
  const { stats, isLoading, error, refreshStats } = useStats();
  const navigation = useNavigation();

  // Get current window dimensions
  const { width } = useWindowDimensions();

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
        <View style={styles.statItem}>
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  data: Array.from({ length: 6 }, () => Math.random() * 100),
                },
              ],
            }}
            width={width - 40} // Dynamically calculate width
            height={500}
            yAxisLabel=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.statItem}>
          <BarChart
            data={{
              labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
              datasets: [
                {
                  data: Array.from({ length: 4 }, () => Math.random() * 100),
                },
              ],
            }}
            width={width - 40} // Dynamically calculate width
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>

        <View style={styles.statItem}>
          <PieChart
            data={pieData}
            width={width - 40} // Dynamically calculate width
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={theme.primary}
            paddingLeft={"15"}
            style={styles.chart}
          />
        </View>

        <View style={styles.statItem}>
          <ProgressChart
            data={progressData}
            width={width - 40} // Dynamically calculate width
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  statItem: {
    width: "100%",
    marginVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
});
