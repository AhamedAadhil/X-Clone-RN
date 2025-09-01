import { TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useSignout } from "@/hooks/useSignout";

const SignoutButton = () => {
  const { handleSignout } = useSignout();
  return (
    <TouchableOpacity onPress={handleSignout}>
      <Feather name="log-out" size={24} color="#E0245E" />
    </TouchableOpacity>
  );
};

export default SignoutButton;
