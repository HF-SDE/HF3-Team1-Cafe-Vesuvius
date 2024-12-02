/**
 * Interface for the economy statistics
 */
interface EconomyStats {
  salesTotal: number;
  salesToday: number;
  valuta: string;
  salesMonth: {
    month: string;
    sales: number;
    orders: number;
    reservations: number;
  }[];
}

/**
 * Interface for reservations statistics
 */
interface ReservationStats {
  total: number;
  today: number;
  upcoming: number;
}

/**
 * Interface for orders statistics
 */
interface OrderStats {
  ordersTotal: number;
  ordersToday: number;
  avgOrderValueTotal: number;
  avgOrderValueToday: number;
}

/**
 * Interface for menu items statistics
 */
interface MenuItemStats {
  total: number;
  orderedStats: { name: string; count: number }[];
}

/**
 * Interface for raw materials statistics
 */
interface RawMaterialStats {
  total: number;
  lowStock: { name: string; quantity: number; unit: string }[];
}

/**
 * Interface for the complete statistics response
 */
export interface StatsModel {
  economy: EconomyStats;
  reservations: ReservationStats;
  orders: OrderStats;
  menuItems: MenuItemStats;
  rawMaterials: RawMaterialStats;
}
