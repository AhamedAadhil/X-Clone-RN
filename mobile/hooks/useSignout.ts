import { useClerk } from "@clerk/clerk-expo";
import { Alert } from "react-native";

export const useSignout = () => {
  const { signOut } = useClerk();
  const handleSignout = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => signOut(),
        },
      ],
      { cancelable: true }
    );
  };
  return {
    handleSignout,
  };
};
