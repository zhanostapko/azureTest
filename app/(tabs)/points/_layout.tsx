import { Stack } from "expo-router";
import { Color } from "../../../src/styles/GlobalStyles";
import useOrientation from "../../../src/hooks/useOrientation";

export default function ApLayout() {
  const orientation = useOrientation();
  const isPortrait = orientation === "PORTRAIT";
  return (
    <Stack
      screenOptions={{
        headerTitle: "Wallet",
        headerTitleAlign: "center",
        headerShown: isPortrait,
        contentStyle: {
          backgroundColor: Color.backgroundWhite,
          paddingHorizontal: 16,
          paddingVertical: 16,
        },
      }}
    ></Stack>
  );
}
