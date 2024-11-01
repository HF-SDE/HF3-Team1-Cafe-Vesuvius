import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Logo from "../components/icons/CaféVesuviusLogo2.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useSession } from "./ctx";


export default function Index() {

  const { signIn } = useSession();
  const handleLogin = () => {
    //Adicione sua lógica de login aqui
    signIn();
    //Antes de navegar, tenha certeza de que o usuário está autenticado
    router.replace("/");
  };


  // Theme colors
  const SecondaryColor = useThemeColor({}, "secondary");
  const BackgroundColor = useThemeColor({}, "background");
  const PrimaryColor = useThemeColor({}, "primary");

  // State variables for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: SecondaryColor,
        gap: 50,
      }}
    >
      <Logo width={300} height={300} />
      <View
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          style={[
            styles.input,
            {
              borderColor: PrimaryColor,
              color: PrimaryColor,
              backgroundColor: BackgroundColor,
            },
          ]}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: PrimaryColor,
              color: PrimaryColor,
              backgroundColor: BackgroundColor,
            },
          ]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Hide password input
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: PrimaryColor }]}
          onPress={handleLogin}
        >
          <Text style={{ color: BackgroundColor, textAlign: "center" }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "80%",
    maxWidth: 300,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    width: "80%",
    maxWidth: 300,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
});
