import {
  StyleSheet,
  View,
  ScrollView,
  useWindowDimensions,
  Text,
  RefreshControl,
  FlatList,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useStats } from "@/hooks/useStats";
import LoadingPage from "@/components/LoadingPage";

import TemplateLayout from "@/components/TemplateLayout";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import { useState, useMemo } from "react";

export default function StatsPage() {
  const theme = useThemeColor();
  const navigation = useNavigation();
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

  // Use the useStats hook directly
  const { stats, isLoading, error, refreshStats } = useStats();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshStats();
    } finally {
      setRefreshing(false);
    }
  };

  const lineChartData = useMemo(
    () => ({
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: Array.from({ length: 6 }, () => Math.random() * 100),
        },
      ],
    }),
    []
  );

  const barChartData = useMemo(
    () => ({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          data: Array.from({ length: 4 }, () => Math.random() * 100),
        },
      ],
    }),
    []
  );

  const progressData = useMemo(
    () => ({
      labels: ["Swim", "Bike", "Run"],
      data: [0.4, 0.6, 0.8],
    }),
    []
  );

  const pieData = useMemo(
    () => [
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
    ],
    []
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <TemplateLayout pageName="StatsPage" title="Statistics">
        <View style={styles.container}>
          <View style={styles.statItem}>
            <Text>{error}</Text>
          </View>
        </View>
      </TemplateLayout>
    );
  }
  console.log(stats);

  const renderItem = ({ item }: { item: any }) => (
    <View>
      <Text>{item.name}</Text>
      <Text>
        Quantity: {item.quantity} {item.unit}
      </Text>
    </View>
  );

  return (
    <TemplateLayout pageName="StatsPage" title="Statistics">
      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.secondary}
          />
        }
      >
        <View>
          <View>
            <Text>Sales Total</Text>
            <Text>
              {stats?.economy.salesTotal} {stats?.economy.valuta}
            </Text>
          </View>
          <View>
            <Text>Sales Today</Text>
            <Text>
              {stats?.economy.salesToday} {stats?.economy.valuta}
            </Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <LineChart
            data={lineChartData}
            width={width - 40} // Dynamically calculate width
            height={500}
            yAxisLabel=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View>
          <Text>Order</Text>
          <View>
            <Text>Total orders: {stats?.orders.ordersTotal}</Text>
            <Text>Today orders: {stats?.orders.ordersToday}</Text>
          </View>
          <View>
            <Text>Avg orders total: {stats?.orders.avgOrderValueTotal}</Text>
            <Text>Avg orders today: {stats?.orders.avgOrderValueToday}</Text>
          </View>
        </View>

        <View>
          <Text>Reservation</Text>
          <View>
            <Text>Total reservations: {stats?.reservations.total}</Text>
          </View>
          <View>
            <Text>Today reservations: {stats?.reservations.today}</Text>
            <Text>Upcoming reservations: {stats?.reservations.upcoming}</Text>
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
        </View>

        <View>
          <Text>Most ordered</Text>
          <View style={styles.statItem}>
            <BarChart
              data={barChartData}
              width={width - 40} // Dynamically calculate width
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
            />
          </View>
        </View>

        <View>
          <Text>Low storage</Text>
          <FlatList
            data={stats?.rawMaterials.lowStock}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
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
