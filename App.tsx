const Stack = createNativeStackNavigator();
import React, { useEffect, useContext, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View, Text, Platform } from "react-native";
import LoginForm from "./src/screens/LoginForm";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { customFonts } from "./src/styles/GlobalStyles";
import * as Font from "expo-font";
import * as SecureStore from "expo-secure-store";
import AppContextProvider, { AppContext } from "./src/context/AppContext";
import * as SplashScreen from "expo-splash-screen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas.projectId,
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token?.data;
}

const App = () => {
  const [fontsLoaded] = useFonts(customFonts);

  useEffect(() => {
    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // });

    const hideScreen = async () => {
      await SplashScreen.preventAutoHideAsync();
    };
    hideScreen();
  }, []);

  // Clear token for testing just set always login screen

  useEffect(() => {
    const clearTokenOnReload = async () => {
      await SecureStore.deleteItemAsync("userToken");
    };

    clearTokenOnReload();
  }, []);
  //

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <AppContextProvider>
      <Content />
    </AppContextProvider>
  );
};

export default App;

const Content = () => {
  const { isLoggedIn, logout } = useContext(AppContext);
  useEffect(() => {
    if (isLoggedIn) {
      logout();
    }
  }, []);
  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <LoginForm />
      ) : (
        <View>
          <Text>Some text</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
