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
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const navigation = useNavigation();

  const chartConfig = {
    backgroundColor: AccentColor,
    backgroundGradientFrom: PrimaryColor,
    backgroundGradientTo: PrimaryColor,
    decimalPlaces: 2,
    color: (opacity = 1) => SecondaryColor,
    labelcolor: (opacity = 1) => SecondaryColor,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: PrimaryColor,
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
      color: BackgroundColor,
      legendFontColor: TextColor,
      legendFontSize: 12,
    },
    {
      name: "Bills",
      population: 30,
      color: SecondaryColor,
      legendFontColor: TextColor,
      legendFontSize: 12,
    },
    {
      name: "Entertainment",
      population: 20,
      color: AccentColor,
      legendFontColor: TextColor,
      legendFontSize: 12,
    },
    {
      name: "Savings",
      population: 10,
      color: TextColor,
      legendFontColor: TextColor,
      legendFontSize: 12,
    },
  ];

  return (
    <TemplateLayout pageName="StatsPage" title="Statistics">
      <ScrollView contentContainerStyle={styles.container}>
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
          backgroundColor={PrimaryColor}
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

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: PrimaryColor, borderColor: BackgroundColor },
          ]}
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    position: "sticky",
    marginHorizontal: "auto",
    width: "95%",
    bottom: 15,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
