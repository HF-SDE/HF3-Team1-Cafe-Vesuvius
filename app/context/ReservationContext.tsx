import { ReservationSections } from "@/models/ReservationModels";
import { createContext, Dispatch, ReactElement, SetStateAction, useContext, useState } from "react";

interface PropsContext { reservations: ReservationSections[] | undefined, setReservations: Dispatch<SetStateAction<ReservationSections[] | undefined>> }

export const ReservationContext = createContext<PropsContext>({ reservations: undefined, setReservations: () => { } });

interface Props {
    children: React.ReactNode;
}

export default function ReservationComponent(props: Props): ReactElement {
    const [reservations, setReservations] = useState<ReservationSections[] | undefined>();
    return (
        <ReservationContext.Provider value={{ reservations, setReservations }}>
            {props.children}
        </ReservationContext.Provider>
    );
};