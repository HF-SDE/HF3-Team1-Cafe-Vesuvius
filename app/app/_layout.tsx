import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import SessionProvider from "./ctx";

import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { Slot } from "expo-router";
import dayjs from "dayjs";
import ReservationComponent from "@/context/ReservationContext";
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(FontAwesome.font);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SessionProvider>
      <ReservationComponent>
        <Slot />
      </ReservationComponent>
    </SessionProvider>
  );
}
