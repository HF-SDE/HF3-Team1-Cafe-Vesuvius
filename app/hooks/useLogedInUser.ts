import { useEffect, useState } from "react";
import { getStorageItemAsync } from "../hooks/useStorageState";
import { UserInfo } from "@/models/userModels";

function decodeJwt(token: string): any {
  try {
    const payload = token.split(".")[1]; // Extract payload
    const decodedPayload = atob(payload); // Decode base64 string
    return JSON.parse(decodedPayload); // Parse JSON
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
}

export const useLogedInUser = (): UserInfo | null => {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserFromToken = async () => {
      const token = await getStorageItemAsync("token");

      if (!token) {
        setCurrentUser(null);
        return;
      }

      const decoded = decodeJwt(token);

      if (!decoded || !decoded.sub) {
        setCurrentUser(null);
        return;
      }

      //   // Extract the user data (e.g., ID)
      //   const user: User = {
      //     id: decoded.sub, // `sub` is the user ID
      //     ...decoded, // Include any other fields from the token payload
      //   };

      setCurrentUser(decoded.sub);
    };

    fetchUserFromToken();
  }, []); // Runs once when the component mounts

  return currentUser;
};
