import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ExpensesType } from "./TransactionExpenseList";
import { Color } from "../../styles/GlobalStyles";
import { format } from "date-fns";

type Props = {
  transaction: ExpensesType;
};

const TransactionExpense = ({ transaction }: Props) => {
  const { created, points, projectName } = transaction;
  return (
    <View style={styles.transactionContainer}>
      <Text style={styles.date}>
        {format(new Date(created), "dd MMM yyyy")}
      </Text>
      <View style={{ gap: 16 }}>
        <View style={styles.activityContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.indicator}></View>
            <View style={styles.activity}>
              <Text style={styles.activityLabel}>
                Project: <Text style={styles.activityValue}>{projectName}</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.points}>-{points}</Text>
        </View>
        {/* <View style={styles.additionalContainer}>
          <View>
            <Text style={styles.additionInfoLabel}>
              Category:{" "}
              <Text style={styles.additionalInfoValue}>
                {splitByCapitalLetter(groupType)}
              </Text>
            </Text>
            <Text style={styles.additionInfoLabel}>
              Group:{" "}
              <Text style={styles.additionalInfoValue}>{pointGroup}</Text>
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.additionInfoLabel}>
              Points par Day:{" "}
              <Text style={styles.additionalInfoValue}>{pointsPerDay}</Text>
            </Text>
            <Text style={styles.additionInfoLabel}>
              Duration on today:{" "}
              <Text style={styles.additionalInfoValue}>{durationOnToday}</Text>
            </Text>
          </View>
        </View> */}
      </View>
    </View>
  );
};

export default TransactionExpense;

const styles = StyleSheet.create({
  date: {
    fontSize: 12,
    fontFamily: "Inter",
    color: Color.color_grey50,
  },
  transactionContainer: {
    paddingVertical: 25,
    gap: 16,
  },
  activityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  indicator: {
    backgroundColor: Color.color_red50,
    height: 16,
    width: 16,
    borderRadius: 8,
  },
  activity: {
    flexDirection: "row",
  },
  activityLabel: {
    fontFamily: "Inter",
    fontSize: 16,
  },
  activityValue: {
    fontFamily: "Inter_700",
    fontSize: 16,
  },
  points: {
    fontFamily: "Inter_700",
    fontSize: 16,
    color: Color.color_red50,
  },
});
