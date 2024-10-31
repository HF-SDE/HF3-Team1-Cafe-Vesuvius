import React from "react";
import { Text, SafeAreaView, Button } from "react-native";
import Logo from "../components/icons/CaféVesuviusLogo2.svg";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Index() {
  const backgroundColor = useThemeColor({}, "secondary");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <Logo width={250} height={250} />
      <Text>Sign in</Text>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </SafeAreaView>
  );
}
