import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { ProjectTypeShort } from "./BasesTopTab";
import { format, differenceInDays } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AircraftIcon from "../../../assets/custom_icons/aircraft.svg";
import ProgressBar from "../ProgressBar";
import ShortCodeBadge from "../ShortCodeBadge";
import { Color } from "../../styles/GlobalStyles";
import { AppContext } from "../../context/AppContext";

type Props = {
  projectInfo: ProjectTypeShort;
};

const MainInfo = ({ projectInfo }: Props) => {
  const { userDataState } = useContext(AppContext);
  const { nia } = userDataState;

  const { endDate, startDate, name, countryName, destination, iataCode } =
    projectInfo;
  const niaMatch = nia === iataCode;
  const totalDays = differenceInDays(new Date(endDate), new Date(startDate));
  const timeLeft = differenceInDays(new Date(endDate), new Date());
  const leftInPercentages =
    timeLeft > 0 ? 100 - Math.round((timeLeft / totalDays) * 100) : 0;
  return (
    <>
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.projectTitleContainer}>
              <Text style={styles.projectTitle}>{name}</Text>
              {/* <Text style={styles.newBadge}>New</Text> */}
            </View>
            <View style={styles.additionalInfo}>
              <View style={styles.additionalItemContainer}>
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={16}
                  color={Color.color_grey60}
                />
                <Text style={styles.additionalItemText}>{countryName}</Text>
              </View>
              {destination && (
                <View style={styles.additionalItemContainer}>
                  <AircraftIcon />
                  <Text style={styles.additionalItemText}>{destination}</Text>
                </View>
              )}
            </View>
          </View>
          <ShortCodeBadge
            code={iataCode}
            style={styles.baseBadge}
            textStyle={styles.textBadge}
            nia={niaMatch}
          />
        </View>
      </View>
      <View style={styles.duration}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>
            {format(new Date(startDate), "MMM d, yyyy")}
          </Text>
          <Text style={styles.dateLabel}>Start Bidding</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            style={styles.progressBar}
            fillInPercentage={leftInPercentages}
          />
          <Text style={styles.progressBarLabel}>{`${Math.abs(timeLeft)} days ${
            timeLeft > 0 ? "left" : "past"
          }`}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>
            {" "}
            {format(new Date(endDate), "MMM d, yyyy")}
          </Text>
          <Text style={styles.dateLabel}>End Bidding</Text>
        </View>
      </View>
    </>
  );
};

export default MainInfo;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    gap: 8,
  },
  projectTitleContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  additionalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  baseBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  textBadge: {
    fontSize: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: "Inter_500",
    color: Color.color_grey90,
  },
  newBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    padding: 2,
    fontFamily: "Inter",
    color: Color.backgroundWhite,
    backgroundColor: Color.color_blue50,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  additionalItemContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  additionalItemText: {
    textTransform: "uppercase",
    color: Color.color_grey70,
    fontSize: 12,
    fontFamily: "Inter_500",
  },
  duration: { flexDirection: "row", justifyContent: "space-between", gap: 24 },
  dateContainer: {
    gap: 6,
  },
  date: {
    fontSize: 12,
    fontFamily: "Inter",
    color: Color.color_grey90,
  },
  dateLabel: {
    fontSize: 12,
    fontFamily: "Inter",
    color: Color.color_grey70,
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 6,
  },
  progressBar: { width: "100%" },
  progressBarLabel: {
    color: Color.color_grey70,
    fontFamily: "Inter",
    fontSize: 12,
  },
});
