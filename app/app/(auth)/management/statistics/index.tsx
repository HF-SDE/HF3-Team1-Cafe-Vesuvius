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

import LineChartCustom from "@/components/LineChart";
import PieChartCustom from "@/components/PieChart";
import BarChartCustom from "@/components/BarChart";

import { useState, useMemo } from "react";

export default function StatsPage() {
  const theme = useThemeColor();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const chartOffset = 100;

  // Use the useStats hook directly
  const { stats, isLoading, error, refreshStats } = useStats();

  const data = [
    {
      value: stats?.reservations.tableUtilizationPercentage,
      text: "Used tables",
      color: theme.primary,
    },
    {
      value: 100 - Number(stats?.reservations.tableUtilizationPercentage),
      text: "Unused tables",
      color: theme.secondary,
    },
  ];

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshStats();
    } finally {
      setRefreshing(false);
    }
  };

  const lineChartData = useMemo(() => {
    const salesMonth = stats?.economy.salesMonth || [];

    const sortedSalesMonth = salesMonth
      .map((item) => ({
        ...item,
      }))
      .sort((a, b) => a.monthDate - b.monthDate); // Sort by the Date object in ascending order

    return sortedSalesMonth.map((item) => ({
      value: item.sales, // Map `sales` to `value`
      name: item.month, // Map `month` to `name`
      year: item.year,
    }));
  }, [stats]);

  const barChartLowest = useMemo(() => {
    const orderedStats = stats?.menuItems?.orderedStats || [];

    const bottomStats = [...orderedStats]
      .sort((a, b) => a.count - b.count)
      .slice(0, 5);

    return bottomStats.map((item) => ({
      value: item.count,
      name: item.name,
    }));
  }, [stats]);
  const barChartHighest = useMemo(() => {
    const orderedStats = stats?.menuItems?.orderedStats || [];

    const topStats = [...orderedStats]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return topStats.map((item) => ({
      value: item.count,
      name: item.name,
    }));
  }, [stats]);

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
              <View
                style={[
                  styles.sectionSpacer,
                  width < 500 && styles.sectionSpacerStack, // Switch to stacked layout if width is less than 500
                ]}
              >
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

          <View style={[styles.statItem, { paddingHorizontal: 0 }]}>
            <LineChartCustom data={lineChartData} width={width - chartOffset} />
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
              <View
                style={[
                  styles.sectionSpacer,
                  width < 500 && styles.sectionSpacerStack, // Switch to stacked layout if width is less than 500
                ]}
              >
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Total: {stats?.orders.ordersTotal}
                </Text>
                <Text style={[styles.sectionText, { color: theme.primary }]}>
                  Today: {stats?.orders.ordersToday}
                </Text>
              </View>
              <View
                style={[
                  styles.sectionSpacer,
                  width < 500 && styles.sectionSpacerStack, // Switch to stacked layout if width is less than 500
                ]}
              >
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
              <View
                style={[
                  styles.sectionSpacer,
                  width < 700 && styles.sectionSpacerStack, // Switch to stacked layout if width is less than 500
                ]}
              >
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
              <PieChartCustom data={data} width={width * 0.8 - chartOffset} />
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
                Ordered
              </Text>
            </View>

            <View style={styles.statItem}>
              <BarChartCustom
                data={barChartHighest}
                width={width - chartOffset}
                label="Most ordered"
              />
            </View>

            <View style={styles.statItem}>
              <BarChartCustom
                data={barChartLowest}
                width={width - chartOffset}
                label="Least ordered"
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
              {stats?.rawMaterials?.lowStock?.length &&
              stats?.rawMaterials.lowStock.length > 0 ? (
                stats.rawMaterials.lowStock.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.lowStockItem,
                      { borderColor: theme.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.lowStockItemName,
                        { color: theme.primary },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.lowStockItemQuantity,
                        { color: theme.primary },
                      ]}
                    >
                      Quantity: {item.quantity} {item.unit} ⚠️
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  There are currently no items with low storage.
                </Text>
              )}
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  chart: {
    borderRadius: 16,
    overflow: "visible",
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
  sectionSubTitle: {
    fontSize: 24,
    textAlign: "left",
    paddingHorizontal: 20,
  },
  sectionSpacer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  sectionSpacerStack: {
    flexDirection: "column", // Change to column for stacking
    alignItems: "center", // Align text when stacked
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
    fontWeight: "bold",
    flex: 1,
  },
  lowStockItemQuantity: {
    fontSize: 20,
    flexShrink: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "red",
  },
});
