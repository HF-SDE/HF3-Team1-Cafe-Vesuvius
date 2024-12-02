/**
 * Interface for the economy statistics
 */
interface EconomyStats {
  totalSales: number;
  valuta: string;
  avgOrderValue: number;
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
  total: number;
  today: number;
  completed: number;
  pending: number;
}

/**
 * Interface for menu items statistics
 */
interface MenuItemStats {
  total: number;
  mostOrdered: { name: string; count: number }[];
  leastOrdered: { name: string; count: number }[];
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
export interface StatsResponse {
  economy: EconomyStats;
  reservations: ReservationStats;
  orders: OrderStats;
  menuItems: MenuItemStats;
  rawMaterials: RawMaterialStats;
}
