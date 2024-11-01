import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from "react-native";
import Logo from "../components/icons/CaféVesuviusLogo2.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useSession } from "./ctx";
//  import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';



export default function Index() {
  const { signIn } = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rightIcon, setRightIcon] = useState("eye");


  const handleLogin = () => {
    const isUsernameValid = username.trim() !== "";
    const isPasswordValid = password.trim() !== "";
    
    setIsUsernameEmpty(!isUsernameValid);
    setIsPasswordEmpty(!isPasswordValid);

    if (isUsernameValid && isPasswordValid) {
      const signInResult = signIn(username, password);
      if (signInResult) {
        setErrorMessage("");
        router.replace("/");
      } else {
        setErrorMessage("Wrong username or password");
      }
    } else {
      setErrorMessage("Please fill out username and password");
    }
  };

  // Clear error message once both fields are filled
  useEffect(() => {
    if (username.trim() && password.trim()) {
      setErrorMessage("");
    }
  }, [username, password]);

  // Theme colors
  const SecondaryColor = useThemeColor({}, "secondary");
  const BackgroundColor = useThemeColor({}, "background");
  const PrimaryColor = useThemeColor({}, "primary");

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              borderColor: isUsernameEmpty
              ? "red" // Change border color on focus
              : PrimaryColor,
              color: PrimaryColor,
              backgroundColor: BackgroundColor,
            },
          ]}
          placeholder="Username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setIsUsernameEmpty(false);
          }}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: isPasswordEmpty
              ? "red" // Change border color on focus
              : PrimaryColor,
              color: PrimaryColor,
              backgroundColor: BackgroundColor,
            },
          ]}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setIsPasswordEmpty(false);
          }}
          secureTextEntry={!showPassword}
          autoCorrect={false}
          autoCapitalize="none"
          

        />

        {errorMessage ? (
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: PrimaryColor }]}
          onPress={handleLogin}
        >
          <Text style={{ color: BackgroundColor, textAlign: "center" }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
