import React from "react";
import { useStorageState } from "../storage/useStorageState";
import { Buffer } from 'buffer';
import apiClient from "../api/apiClient";


const AuthContext = React.createContext<{
  signIn: (username: string, password: string) => Promise<string>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => "false",
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  return (
    <AuthContext.Provider
      value={{
        signIn: async (username, password) => {
          const isUsernameValid = username.trim() !== "";
          const isPasswordValid = password.trim() !== "";

          if (!isUsernameValid || !isPasswordValid) {
            setSession(null);
            return "Please fill out username and password";
          }

          const encodedPassword = Buffer.from(password).toString("base64");

          const loginData = {
            username: username,
            password: encodedPassword,
          };
          setSession("null")
          try {

            const response = await apiClient.post('/login', loginData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            // const response = {
            //   status: 200,
            //   data: {
            //     token: "GG"
            //   }
            // };

            if (!response) {
              throw new Error("No response");
            }

            if (response.status !== 200) {
              return "Wrong username or password";
            }

            const result = response.data;

            if (!result || !result.token) {
              throw new Error("No token found in response");
            }

            console.log(result.token);
            setSession(result.token);
            return "authenticated";
          } catch (error) {
            console.error(error);
            setSession(null);
            return "Something went wrong on our end. Please contact support";
          }
        
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
