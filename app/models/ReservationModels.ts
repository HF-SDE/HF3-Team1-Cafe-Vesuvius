import { DateType } from "react-native-ui-datepicker";
import { table } from "./TableModels";

export interface Reservation {
  id?: string;
  name: string;
  partySize: number | string;
  reservationTime: Date | string | DateType;
  email: string;
  phone: string;
  amount: number;
  tables: table[];
}
