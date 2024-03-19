import { Stack } from "expo-router";

import { Color } from "../../../src/styles/GlobalStyles";

export default function ApLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        contentStyle: {
          backgroundColor: Color.backgroundWhite,
          // paddingHorizontal: 16,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "Base Preference" }} />
      <Stack.Screen name="[baseId]" options={{ headerTitle: "Details" }} />
    </Stack>
  );
}
