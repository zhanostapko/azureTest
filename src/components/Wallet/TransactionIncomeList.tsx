import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import TransactionIncome from "./TransactionIncome";
import TransactionExpense from "./TransactionExpense";
import useFetch from "../../hooks/useFetch";
import { AppContext } from "../../context/AppContext";
import Loader from "../Loader";
import { Color } from "../../styles/GlobalStyles";
import { ScrollView } from "react-native-gesture-handler";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

type Props = {
  renderInBottomSheet?: boolean;
};

export type PointsReceivedType = {
  activityName: string;
  groupType: string;
  durationOnToday: number;
  endDate: string;
  pointGroup: string;
  pointsPerDay: number;
  startDate: string;
  totalPoints: number;
};

const TransactionIncomeList = ({ renderInBottomSheet }: Props) => {
  const { userDataState } = useContext(AppContext);
  const urlToFetch = `api/Crew/GetPointsReceivedList?code=${userDataState?.code}`;

  const { data, isLoading, error } = useFetch<PointsReceivedType[]>(urlToFetch);

  const sortedData = data?.sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  );

  const ListComponent = renderInBottomSheet ? BottomSheetFlatList : FlatList;

  return (
    <View style={styles.tabContainer}>
      {isLoading && <Loader />}

      {!isLoading && sortedData?.length === 0 && (
        <Text style={styles.noPointsText}>No points received</Text>
      )}
      {!isLoading && sortedData && (
        <ListComponent
          initialNumToRender={20}
          // style={{ backgroundColor: "white" }}
          keyExtractor={(item) => `${item.activityName}${item.startDate}`}
          data={sortedData}
          renderItem={({ item }) => <TransactionIncome transaction={item} />}
        />
      )}
    </View>
    // <View style={{ flex: 1, backgroundColor: "white" }}>{listContent}</View>
  );
};

export default TransactionIncomeList;

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: Color.backgroundWhite,
    flex: 1,
  },
  noPointsText: {
    fontSize: 18,
    fontFamily: "Inter_500",
    color: Color.color_grey60,
    marginTop: 10,
    textAlign: "center",
  },
});
