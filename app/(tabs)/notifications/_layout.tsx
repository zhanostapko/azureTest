import { Redirect, Tabs, Stack } from "expo-router";
import { ScrollView, Text } from "react-native";
import { AppContext } from "../../../src/context/AppContext";
import { useContext } from "react";
import { Color } from "../../../src/styles/GlobalStyles";
import Avatar from "../../../src/components/Avatar";
import { Ionicons } from "@expo/vector-icons";

export default function ApLayout() {
  //   const history = useHistory()

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        contentStyle: {
          backgroundColor: Color.backgroundWhite,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Notifications",
          headerTitleAlign: "center",
          headerRight: () => <Avatar />,
        }}
      />
    </Stack>
  );
}
