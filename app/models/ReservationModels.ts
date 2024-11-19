import { table } from "./TableModels";

export interface Reservation {
  id?: string;
  name: string;
  reservationTime: Date | string;
  email: string;
  phone: string;
  amount: number;
  tables: table[];
}
