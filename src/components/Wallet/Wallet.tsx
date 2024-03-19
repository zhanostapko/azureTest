import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useContext, useLayoutEffect } from "react";
import { Color } from "../../styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import TotalContainer from "./TotalContainer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TransactionIncomeList from "./TransactionIncomeList";
import TransactionExpenseList from "./TransactionExpenseList";
import { AppContext } from "../../context/AppContext";
import useFetch from "../../hooks/useFetch";
import { format } from "date-fns";

import Loader from "../Loader";
import useOrientation from "../../hooks/useOrientation";

const Tab = createMaterialTopTabNavigator();

type Props = {
  renderInBottomSheet?: boolean;
};

const Wallet = ({ renderInBottomSheet }: Props) => {
  const { userDataState } = useContext(AppContext);
  const { pointsReceived, pointsSpent } = userDataState;
  const orientation = useOrientation();

  const {
    data: lastPointUpdate,
    isLoading,
    error,
  } = useFetch<string>(`api/Crew/PointsLastUpdate?code=${userDataState?.code}`);

  return (
    // <ScrollView
    //   nestedScrollEnabled={true}
    //   contentContainerStyle={styles.walletWrapper}
    // >
    <View style={styles.walletWrapper}>
      {isLoading && <Loader />}
      {!isLoading && lastPointUpdate && (
        <>
          {orientation === "PORTRAIT" && (
            <>
              <View style={styles.walletHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Smart Points</Text>
                  {/* Settings for future */}
                  {/* <Ionicons
                name="md-options-outline"
                size={16}
                color={Color.color_grey60}
              /> */}
                </View>
                <View style={styles.lastUpdatedContainer}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={14}
                    color={Color.color_grey50}
                  />
                  <Text style={styles.lastUpdate}>
                    Last update{" "}
                    <Text style={styles.date}>
                      {format(new Date(lastPointUpdate), "dd MM yyyy") || "-"}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={styles.statsContainer}>
                <TotalContainer
                  pointsType={"incomes"}
                  points={pointsReceived}
                />
                <TotalContainer pointsType={"expenses"} points={pointsSpent} />
              </View>
            </>
          )}

          <Tab.Navigator>
            <Tab.Screen
              name="Income"
              children={() => (
                <TransactionIncomeList
                  renderInBottomSheet={renderInBottomSheet}
                />
              )}
            />
            <Tab.Screen
              name="Expense"
              children={() => (
                <TransactionExpenseList
                  renderInBottomSheet={renderInBottomSheet}
                />
              )}
            />
          </Tab.Navigator>
        </>
      )}
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  walletWrapper: {
    gap: 24,
    // backgroundColor: "pink",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  walletHeader: {
    gap: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600",
  },
  lastUpdatedContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  lastUpdate: {
    fontSize: 14,
    color: Color.color_grey70,
    fontFamily: "Inter",
  },
  date: {
    fontFamily: "Inter_700",
  },
});
