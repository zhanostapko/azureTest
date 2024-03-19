import React, { useEffect, useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

import AppContextProvider, { AppContext } from "../src/context/AppContext";
import { customFonts } from "../src/styles/GlobalStyles";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NotificationProvider } from "../src/context/NotificationsContext";

export default function Layout() {
  const [fontsLoaded] = useFonts(customFonts);

  useEffect(() => {
    const hideScreen = async () => {
      await SplashScreen.preventAutoHideAsync();
    };
    hideScreen();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppContextProvider>
        <NotificationProvider>
          <BottomSheetModalProvider>
            <StatusBar style="auto" />
            <Slot />
          </BottomSheetModalProvider>
        </NotificationProvider>
      </AppContextProvider>
    </SafeAreaView>
  );
}
