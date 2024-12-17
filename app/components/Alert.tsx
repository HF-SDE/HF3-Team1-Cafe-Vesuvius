import { Alert, Platform } from "react-native";

const alertPolyfill = (title: string, description: string, options: any) => {
  const result = window.confirm(
    [title, description].filter(Boolean).join("\n")
  );

  if (result) {
    const confirmOption = options.find(
      ({ style }: { style: string }) => style !== "cancel"
    );
    confirmOption && confirmOption.onPress();
  } else {
    const cancelOption = options.find(
      ({ style }: { style: string }) => style === "cancel"
    );
    cancelOption && cancelOption.onPress();
  }
};

const alert = Platform.OS === "web" ? alertPolyfill : Alert.alert;

export default alert;
