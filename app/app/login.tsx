import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LogoLight from "../components/icons/CaféVesuviusLogo2.svg";
import LogoDark from "../components/icons/CaféVesuviusLogo3.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useSession } from "./ctx";
import { useColorScheme } from "react-native";
import PasswordInput from "../components/PasswordInput";

import TextInput from "../components/TextInput";

export default function Index() {
  const { signIn } = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colorScheme = useColorScheme(); // Detect light or dark mode
  const Logo = colorScheme === "dark" ? LogoDark : LogoLight; // Choose logo based on theme

  const handleLogin = async () => {
    const trimedUsername = username.trim();
    const trimedPassword = password.trim();

    setUsername(trimedUsername);
    setPassword(trimedPassword);

    const isUsernameValid = trimedUsername !== "";
    const isPasswordValid = trimedPassword !== "";

    setIsUsernameEmpty(!isUsernameValid);
    setIsPasswordEmpty(!isPasswordValid);

    if (isUsernameValid && isPasswordValid) {
      setIsLoading(true);
      const signInResult = await signIn(trimedUsername, trimedPassword);

      if (signInResult === "authenticated") {
        setErrorMessage("");
        router.replace("/");
      } else {
        setErrorMessage(signInResult);
      }
      setIsLoading(false);
    } else {
      setErrorMessage("Please fill out username and password");
    }
  };

  useEffect(() => {
    if (username.trim() && password.trim()) {
      setErrorMessage("");
    }
  }, [username, password]);

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: BackgroundColor }]}
    >
      <View style={styles.logoContainer}>
        <Logo width={340} height={340} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <View style={styles.input_block}>
          <TextInput
            label="Username"
            autoCorrect={false}
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setIsUsernameEmpty(false);
            }}
            onSubmitEditing={handleLogin}
            clearTextOnFocus={false}
            autoComplete="off"
            isHighlighted={isUsernameEmpty}
          />
        </View>
        <View style={[styles.input_block]}>
          <PasswordInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setIsPasswordEmpty(false);
            }}
            isInvalid={isPasswordEmpty}
            onSubmitEditing={handleLogin}
            isHighlighted={isPasswordEmpty}
          />
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: PrimaryColor, opacity: isLoading ? 0.5 : 1 },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, { color: BackgroundColor }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    gap: 10,
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input_block: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  icon_container: {
    padding: 5,
    position: "absolute",
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
