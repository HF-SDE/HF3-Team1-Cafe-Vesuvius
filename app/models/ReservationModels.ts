import { DateType } from "react-native-ui-datepicker";
import { Table } from "./TableModels";

export interface Reservation {
  id?: string;
  name: string;
  partySize: number | string;
  reservationTime: DateType;
  email: string;
  phone: string;
  amount: number;
  tables: Table[];
}
