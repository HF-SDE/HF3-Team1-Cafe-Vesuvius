import { useThemeColor } from "@/hooks/useThemeColor";
import { Reservation } from "@/models/ReservationModels";
import { Table } from "@/models/TableModels";
import { Dispatch, ReactElement, SetStateAction } from "react";
import {
    Text,
    Pressable,
    StyleSheet,
} from "react-native";

/**
 * Table Props
 * @interface TableProps
 * @typedef {TableProps}
 */
interface TableProps {
    table: Table;
    tableSelect: number;
    tableSelectNeed: number;
    setTableSelect: Dispatch<SetStateAction<number>>;
    reservation: [Reservation, Dispatch<SetStateAction<Reservation>>];
    disabled: boolean;
}


/**
 * The item component for the flatlist
 * @param {TableProps} props - The props for the item
 */
export default function NewReservationsItem(props: TableProps): ReactElement {
    const disabled = isTableDisabled(
        props.disabled,
        props.table,
        props.tableSelect,
        props.tableSelectNeed,
        [props.reservation[0], props.reservation[1]]
    );
    const theme = useThemeColor();

    const selected = isTableSelected(props.table, props.reservation[0]);

    function onPress() {
        if (selected) {
            props.reservation[1]({
                ...props.reservation[0],
                Tables: [
                    ...props.reservation[0].Tables!.filter(
                        (table) => table.id !== props.table.id
                    ),
                ],
            });
            props.setTableSelect(props.tableSelect - 1);
        } else {
            props.reservation[1]({
                ...props.reservation[0],
                Tables: [...props.reservation[0].Tables!, props.table],
            });
            props.setTableSelect(props.tableSelect + 1);
        }
    }

    return (
        <Pressable
            style={
                selected
                    ? { ...styles.item, backgroundColor: theme.accent }
                    : disabled
                        ? {
                            ...styles.item,
                            backgroundColor: `${theme.primary}60`,
                            borderColor: theme.background,
                        }
                        : {
                            ...styles.item,
                            backgroundColor: theme.primary,
                            borderColor: theme.background,
                        }
            }
            onPress={onPress}
            disabled={disabled}
        >
            <Text
                style={[
                    { fontWeight: "bold", fontSize: 18 },
                    selected
                        ? { color: theme.text }
                        : disabled
                            ? { color: theme.background }
                            : { color: theme.background },
                ]}
            >
                {props.table.number}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        maxWidth: "25%",
        alignItems: "center",
        width: "100%",

        padding: 10,
        borderWidth: 1.5,
        borderRadius: 3,
    }
});

/**
 * Check if the table need to be disabled
 * @param {Table} table - The table to check
 * @param {number} tableSelect - The number of tables selected
 * @param {number} tableSelectNeed - The number of tables needed
 * @param {[Reservation, Dispatch<SetStateAction<Reservation>>]} action - The action to update the reservation
 * @returns {boolean} - True if the item should be disabled, false otherwise
 */
function isTableDisabled(
    disabled: boolean,
    table: Table,
    tableSelect: number,
    tableSelectNeed: number,
    action: [Reservation, Dispatch<SetStateAction<Reservation>>]
): boolean {
    if (disabled) return true;

    if (action[0].Tables) {
        for (const key in action[0].Tables) {
            if (action[0].Tables[key].id === table.id) {
                return false;
            }
        }
        if (tableSelect === tableSelectNeed) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

/**
 * Check if the table is selected
 * @param {Table} table
 * @param {Reservation} reservation
 * @returns {boolean}
 */
function isTableSelected(table: Table, reservation: Reservation): boolean {
    if (reservation.Tables) {
        for (const key in reservation.Tables) {
            if (reservation.Tables[key].id === table.id) {
                return true;
            }
        }
        return false;
    }
    return true;
}