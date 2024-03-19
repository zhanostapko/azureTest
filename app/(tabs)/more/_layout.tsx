import { Redirect, Tabs, Stack } from "expo-router";
import { ScrollView } from "react-native";
import { AppContext } from "../../../src/context/AppContext";
import { useContext } from "react";
import { Color } from "../../../src/styles/GlobalStyles";

export default function ApLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Personal Details", headerTitleAlign: "center" }}
      />
    </Stack>
  );
}
