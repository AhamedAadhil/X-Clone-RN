import { Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignoutButton from "@/components/SignoutButton";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <Text>HomeScreen</Text>
      <SignoutButton />
    </SafeAreaView>
  );
};

export default HomeScreen;
