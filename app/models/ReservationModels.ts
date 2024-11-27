import { DateType } from "react-native-ui-datepicker";
import { Table } from "./TableModels";

export interface Reservation {
  id?: string;
  name: string;
  amount: number | string;
  reservationTime: DateType;
  email: string;
  phone: string;
  Tables?: Table[];
  tableIds?: string[];
}

export interface ReservationSections {
  title: string;
  data: Reservation[];
}
