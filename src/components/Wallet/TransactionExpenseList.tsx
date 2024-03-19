import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import TransactionIncome from "./TransactionIncome";
import TransactionExpense from "./TransactionExpense";
import useFetch from "../../hooks/useFetch";
import { AppContext } from "../../context/AppContext";
import Loader from "../Loader";
import { Color } from "../../styles/GlobalStyles";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

type Props = {
  renderInBottomSheet?: boolean;
};

export type ExpensesType = {
  projectName: string;
  points: string;
  created: string;
};

const TransactionExpenseList = ({ renderInBottomSheet }: Props) => {
  const { userDataState } = useContext(AppContext);

  const urlToFetch = `api/Crew/GetPointSpentList?code=${userDataState?.code}`;

  const { data, isLoading, error } = useFetch<ExpensesType[]>(urlToFetch);

  const sortedData = (data as ExpensesType[])?.sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  const ListComponent = renderInBottomSheet ? BottomSheetFlatList : FlatList;

  return (
    <View style={styles.tabContainer}>
      {isLoading && <Loader />}
      {!isLoading && sortedData?.length === 0 && (
        <Text style={styles.noPointsText}>No points spent</Text>
      )}
      {!isLoading && sortedData && (
        <ListComponent
          style={{ backgroundColor: "white" }}
          keyExtractor={(item) => `${item.projectName}${item.created}`}
          data={sortedData}
          renderItem={({ item }) => <TransactionExpense transaction={item} />}
        />
      )}
    </View>
    // <View style={{ flex: 1, backgroundColor: "white" }}>{listContent}</View>
  );
};

export default TransactionExpenseList;

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
