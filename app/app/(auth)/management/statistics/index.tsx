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
    () => {
      const salesMonth = stats?.economy.salesMonth || [];

      const sortedSalesMonth = salesMonth
        .map((item) => ({
          ...item,
          monthDate: new Date(item.month), // Parse the month string into a Date object
        }))
        .sort((a, b) => a.monthDate - b.monthDate); // Sort by the Date object in ascending order

      const months = sortedSalesMonth.map((item) => item.month);
      const sales = sortedSalesMonth.map((item) => item.sales);

      return {
        labels: months, // Use months from salesMonth
        datasets: [
          {
            data: sales, // Use sales data for the line chart
          },
        ],
      };
    },
    [stats] // Re-run when stats change
  );

  const barChartData = useMemo(() => {
    const orderedStats = stats?.menuItems?.orderedStats || [];

    return {
      labels: orderedStats.map((item) => item.name), // Use 'name' for the labels
      datasets: [
        {
          data: orderedStats.map((item) => item.count), // Use 'count' for the data values
        },
      ],
    };
  }, [stats]);

  const pieData = useMemo(
    () => [
      {
        name: "Groceries",
        population: 40,
        color: theme.primary,
        legendFontColor: theme.primary,
        legendFontSize: 12,
      },
      {
        name: "Bills",
        population: 30,
        color: theme.secondary,
        legendFontColor: theme.secondary,
        legendFontSize: 12,
      },
      {
        name: "Entertainment",
        population: 20,
        color: theme.accent,
        legendFontColor: theme.accent,
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
    <View style={[styles.lowStockItem, { borderColor: theme.primary }]}>
      <Text style={[styles.lowStockItemName, { color: theme.primary }]}>
        {item.name}
      </Text>
      <Text style={[styles.lowStockItemQuantity, { color: theme.primary }]}>
        Quantity: {item.quantity} {item.unit} ⚠️
      </Text>
    </View>
  );

  return (
    <TemplateLayout pageName="StatsPage" title="Statistics">
      {isLoading ? (
        <LoadingPage />
      ) : error ? (
        <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
      ) : (
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
          <View
            style={[
              styles.sectionContainer,
              {
                borderColor: theme.primary,
              },
            ]}
          >
            <View style={styles.sectionContainerText}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Sales
              </Text>
              <View style={styles.sectionSpacer}>
                <View>
                  <Text style={[styles.sectionText, { color: theme.primary }]}>
                    Total: {stats?.economy.salesTotal} {stats?.economy.valuta}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.sectionText, { color: theme.primary }]}>
                    Today: {stats?.economy.salesToday} {stats?.economy.valuta}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.statItem}>
            <LineChart
              data={lineChartData}
              width={width - 43} // Dynamically calculate width
              height={350}
              yAxisLabel=""
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          <View
            style={[
              styles.sectionContainer,
              {
                borderColor: theme.primary,
              },
            ]}
          >
            <View style={styles.sectionContainerText}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Orders
              </Text>
              <View style={styles.sectionSpacer}>
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Total: {stats?.orders.ordersTotal}
                </Text>
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Today: {stats?.orders.ordersToday}
                </Text>
              </View>
              <View style={styles.sectionSpacer}>
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Avg total: {stats?.orders.avgOrderValueTotal}
                </Text>
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Avg today: {stats?.orders.avgOrderValueToday}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.sectionContainer,
              {
                borderColor: theme.primary,
              },
            ]}
          >
            <View style={styles.sectionContainerText}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Reservation
              </Text>
              <View style={styles.sectionSpacer}>
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Total: {stats?.reservations.total}
                </Text>
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Today: {stats?.reservations.today}
                </Text>
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Upcoming: {stats?.reservations.upcoming}
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <PieChart
                data={pieData}
                width={width - 43} // Dynamically calculate width
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                style={styles.chart}
              />
            </View>
          </View>

          <View
            style={[
              styles.sectionContainer,
              {
                borderColor: theme.primary,
              },
            ]}
          >
            <View style={styles.sectionContainerText}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Most ordered
              </Text>
            </View>

            <View style={styles.statItem}>
              <BarChart
                data={barChartData}
                width={width - 43} // Dynamically calculate width
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix=""
                //verticalLabelRotation={30}
              />
            </View>
          </View>

          <View
            style={[
              styles.sectionContainer,
              {
                borderColor: theme.primary,
              },
            ]}
          >
            <View style={styles.sectionContainerText}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Low storage
              </Text>
              <FlatList
                data={stats?.rawMaterials.lowStock}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    There are currently no items with low storage.
                  </Text>
                }
              />
            </View>
          </View>
        </ScrollView>
      )}
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  statItem: {
    width: "100%",
    marginVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
  sectionContainer: {
    borderWidth: 2,
    borderRadius: 20,
  },
  sectionContainerText: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 30,
    textAlign: "center",
  },
  sectionSpacer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 5,
  },
  sectionText: {
    fontSize: 22,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },

  lowStockItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    marginVertical: 8,
    borderBottomWidth: 1,
  },
  lowStockItemName: {
    fontSize: 22,
    fontWeight: "bold", // Make the name bold
    flex: 1, // Ensure the name takes available space
  },
  lowStockItemQuantity: {
    fontSize: 20,
    flexShrink: 1, // Ensure the quantity doesn't overflow
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "red",
  },
});
