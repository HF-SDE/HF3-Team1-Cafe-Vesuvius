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
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Index() {
  const { signIn } = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state variable

  const handleLogin = async () => {
    const isUsernameValid = username.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsUsernameEmpty(!isUsernameValid);
    setIsPasswordEmpty(!isPasswordValid);

    if (isUsernameValid && isPasswordValid) {
      setIsLoading(true); // Start loading
      const signInResult = await signIn(username, password);
      console.log(signInResult);
      
      if (signInResult === "authenticated") {
        setErrorMessage("");
        router.replace("/");
      } else {
        setErrorMessage(signInResult);
      }
      setIsLoading(false); // End loading
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
    <SafeAreaView style={[styles.container, { backgroundColor: SecondaryColor }]}>
      <View style={styles.logoContainer}>
        <Logo width={300} height={300} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <View style={styles.input_block}>
          <TextInput
            style={[styles.input, { borderColor: isUsernameEmpty ? "red" : PrimaryColor, color: PrimaryColor, backgroundColor: BackgroundColor}]}
            placeholder="Username"
            placeholderTextColor='gray'
            autoCorrect={false}
            autoCapitalize='none'
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setIsUsernameEmpty(false);
            }}          />
        </View>
        <View style={[styles.input_block]}>
          <TextInput
            style={[styles.input, { borderColor: isPasswordEmpty ? "red" : PrimaryColor, color: PrimaryColor, backgroundColor: BackgroundColor, paddingRight: 45 }]}
            placeholder="Password"
            placeholderTextColor='gray'
            autoCorrect={false}
            secureTextEntry={!showPassword}
            autoCapitalize='none'
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setIsPasswordEmpty(false);
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(previous => !previous)}
            style={styles.icon_container}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: PrimaryColor, opacity: isLoading ? 0.5 : 1 }]} // Adjust opacity
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, {color: BackgroundColor}]}>Sign In</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  icon_container: {
    padding: 5,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
