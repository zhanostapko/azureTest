import { StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { Color } from "../../styles/GlobalStyles";
import { PointsReceivedType } from "./TransactionIncomeList";
import { splitByCapitalLetter } from "../../other/helpers";
import { format } from "date-fns";

type Props = {
  transaction: PointsReceivedType;
};

const TransactionIncome = ({ transaction }: Props) => {
  const {
    endDate,
    startDate,
    activityName,
    groupType,
    pointGroup,
    totalPoints,
    pointsPerDay,
    durationOnToday,
  } = transaction;

  return (
    <View style={styles.transactionContainer}>
      <Text style={styles.date}>
        {format(new Date(startDate), "dd MMM yyyy")} -
        {format(new Date(endDate), "dd MMM yyyy")}
      </Text>
      <View style={{ gap: 16 }}>
        <View style={styles.activityContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.indicator}></View>
            <View style={styles.activity}>
              <Text style={styles.activityLabel}>
                Activity{" "}
                <Text style={styles.activityValue}>{activityName}</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.points}>{totalPoints}</Text>
        </View>
        <View style={styles.additionalContainer}>
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
        </View>
      </View>
    </View>
  );
};

export default memo(TransactionIncome);

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
    backgroundColor: Color.color_green60,
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
  },
  additionalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  additionInfoLabel: {
    fontSize: 12,
    fontFamily: "Inter",
    color: Color.color_grey70,
  },
  additionalInfoValue: {
    fontFamily: "Inter_700",
  },
});
