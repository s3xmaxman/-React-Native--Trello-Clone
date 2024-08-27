import { useSupabase } from "@/context/SupabaseContext";
import { Task } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, Image, Text, View } from "react-native";
import {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

const ListItem = () => {
  return (
    <View>
      <Text>ListItem</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rowItem: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
});

export default ListItem;
