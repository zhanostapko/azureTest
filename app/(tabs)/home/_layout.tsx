import { Redirect, Tabs, Stack, Navigator, Link } from "expo-router";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";
import { AppContext } from "../../../src/context/AppContext";
import { useContext } from "react";
import { Color } from "../../../src/styles/GlobalStyles";
import Logo from "../../../assets/images/logoSmall.svg";
import Avatar from "../../../src/components/Avatar";
import dummyAvatar from "../../../assets/dummy_assets/avatar.png";

export default function ApLayout() {
  const { userDataState } = useContext(AppContext);
  const { lastName, firstName } = userDataState;

  const HomeScreenRightHeader = () => {
    return (
      <View style={styles.homeRightContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>
        </View>
        <Link href={"home/profile"}>
          <View>
            <Avatar />
          </View>
        </Link>
      </View>
    );
  };
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Color.backgroundWhite,
          // paddingHorizontal: 16,
          paddingVertical: 16,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <></>,

          headerLeft: () => <Logo />,
          headerRight: () => <HomeScreenRightHeader />,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerBackTitle: "Home", headerTitle: "Profile" }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  homeRightContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "flex-end",
  },
  welcome: {
    fontFamily: "Inter",
    fontSize: 12,
    color: Color.color_grey60,
  },
  name: {
    fontSize: 13,
    fontFamily: "Inter",
  },
});
