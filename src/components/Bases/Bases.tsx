import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BasesTopTab from "./BasesTopTab";
import Applications from "./Applications";
import { Color } from "../../styles/GlobalStyles";
import { useLocalSearchParams } from "expo-router";
import { AppContext } from "../../context/AppContext";
import useApi from "../../hooks/useApi";

type Props = {};

const Tab = createMaterialTopTabNavigator();

const Bases = (props: Props) => {
  const params = useLocalSearchParams();
  const initialTab = params?.tab === "Applications" ? params.tab : "Bases";

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      style={{ backgroundColor: Color.backgroundWhite, flex: 1 }}
      screenOptions={{
        tabBarLabelStyle: { fontFamily: "Inter_500", fontSize: 12 },
        tabBarActiveTintColor: Color.color_blue50,
        tabBarInactiveTintColor: Color.color_grey70,
      }}
    >
      <Tab.Screen name="Bases" component={BasesTopTab} />
      <Tab.Screen name="Applications" component={Applications} />
    </Tab.Navigator>
  );
};

export default Bases;

const styles = StyleSheet.create({});
