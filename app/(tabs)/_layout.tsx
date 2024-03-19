import { Redirect, Tabs, Stack } from "expo-router";
import { ScrollView, View, Text } from "react-native";
import { AppContext } from "../../src/context/AppContext";
import { useContext, useEffect, useState } from "react";
import { Color } from "../../src/styles/GlobalStyles";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import useApi from "../../src/hooks/useApi";
import useFetch from "../../src/hooks/useFetch";
import Loader from "../../src/components/Loader";
import useOrientation from "../../src/hooks/useOrientation";
import { FontAwesome } from "@expo/vector-icons";
import { useNotifications } from "../../src/context/NotificationsContext";

export type CrewType = {
  active: boolean;
  rank: string;
  qualification: string;
  additionalRoles: string | null;
  agency: string;
  base: string | null;
  birthDate: string;
  cellPhone: string;
  code: string;
  contractType: string;
  contractValidFrom: string;
  contractValidTill: string | null;
  email: string;
  endDate: string | null;
  firstName: string;
  gender: string;
  id: number;
  lastName: string;
  modified: string;
  nationality: string;
  nia: string;
  position: string;
  privateEmail: string;
  scale: number;
  startDate: string;
  status: string;
  pointsReceived: number;
  pointsSpent: number;
};

export default function AppLayout() {
  const { isLoggedIn, userState, setUserData, isLoading, logout } =
    useContext(AppContext);
  const { notificationCount } = useNotifications();
  const crewId = userState?.crewId;

  const {
    data: crewData,
    isLoading: crewDataLoading,
    error,
  } = useFetch<CrewType>(
    `api/Crew?crewId=${crewId}`,
    undefined,
    undefined,
    undefined,
    !isLoading && !!crewId
  );

  useEffect(() => {
    if (crewData) {
      setUserData(crewData);
    }
  }, [crewData]);

  if (error) logout();

  if (isLoading) return null;

  if (!isLoggedIn) return <Redirect href="others/login" />;

  // const { data: crewData, isLoading: crewDataLoading } = useFetch<CrewType>(
  //   `api/Crew?crewId=${crewId}`
  // );

  // const { data: userImage, isLoading: imageLoading } = useFetch<any>(
  //   `https://apiskyconnecttest.smartlynx.aero/api/Image?code=${userState?.code}`
  // );

  // List of needed requests for main page

  // Photo
  // https://apiskyconnecttest.smartlynx.aero/api/Image?code=OBE

  // List of made biding
  // https://apiskyconnecttest.smartlynx.aero/api/Bidding/GetByCrewList?crewId=4

  // Project list
  // https://apiskyconnecttest.smartlynx.aero/api/Project/GetList

  // const { data: crewData, isLoading, error, refetch } = useFetch<CrewType>(
  //   `api/Crew?crewId=${crewId}`
  // );

  if (crewData?.status && crewData?.status !== "Confirmed")
    return <Redirect href="others/verificationForm" />;
  const iconSize = 20;
  return (
    <>
      {crewDataLoading && <Loader />}
      {!crewDataLoading && crewData && (
        <Tabs
          initialRouteName="home"
          screenOptions={{
            headerShown: false,

            tabBarLabelStyle: {
              textTransform: "uppercase",
              fontSize: 8,
              marginBottom: 14,
            },
            tabBarActiveTintColor: Color.color_blue50,
            tabBarStyle: {
              // paddingHorizontal: 16,
              // paddingVertical: 14,
              height: 64,
            },
            tabBarItemStyle: { height: 64 },
            tabBarIconStyle: {
              marginBottom: 4,
            },
            tabBarLabelPosition: "below-icon",
            unmountOnBlur: true,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              href: "home",
              tabBarLabel: "Home",
              headerLeft: () => (
                <View>
                  <Text>text</Text>
                </View>
              ),
              headerRight: () => (
                <View>
                  <Text>text2</Text>
                </View>
              ),
              tabBarIcon: ({ color, size }) => (
                <Octicons name="home" size={iconSize} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="bases"
            options={{
              href: "bases",
              tabBarLabel: "Bases",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={iconSize}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="points"
            options={{
              tabBarLabel: "Points",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons
                  name="insert-chart-outlined"
                  size={iconSize}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="notifications"
            options={{
              tabBarBadge: notificationCount || undefined,
              tabBarBadgeStyle: { backgroundColor: Color.color_blue50 },
              tabBarLabel: "Notifications",
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="bell-o" size={iconSize} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="more"
            options={{
              href: null,
              tabBarLabel: "More",
              tabBarIcon: ({ color, size }) => (
                <Feather name="more-horizontal" size={iconSize} color={color} />
              ),
            }}
          />
        </Tabs>
      )}
    </>
  );
}
