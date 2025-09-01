import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const SearchScreen = () => {
  const TRENDING_TOPICS = [
    {
      topic: "#React Native",
      tweets: "125K",
    },
    {
      topic: "#Type Script",
      tweets: "85K",
    },
    {
      topic: "#React",
      tweets: "75K",
    },
    {
      topic: "#Spring Boot",
      tweets: "105K",
    },
    {
      topic: "#.NET",
      tweets: "80K",
    },
  ];
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className=" px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color={"#657786"} />
          <TextInput
            placeholder="Search Twitter"
            className="flex-1 ml-3 text-base"
            placeholderTextColor={"#657786"}
          />
        </View>
      </View>

      {/* TRENDING TOPICS */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Trending for you
          </Text>
          {TRENDING_TOPICS.map((topic, index) => (
            <TouchableOpacity
              key={index}
              className="py-3 border-b border-gray-100"
            >
              <Text className="text-base font-semibold text-gray-900">
                {topic.topic}
              </Text>
              <Text className="text-sm text-gray-600">{topic.tweets}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
