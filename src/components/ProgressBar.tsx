import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { Color } from "../styles/GlobalStyles";

type Props = {
  style?: ViewStyle;
  fillInPercentage?: number;
  timeOffset?: number;
  fullPeriod?: boolean;
};

const ProgressBar = ({
  style,
  fillInPercentage = 0,
  timeOffset = 0,
  fullPeriod,
}: Props) => {
  return (
    <View style={[styles.progressBar, style]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: fullPeriod
              ? Color.color_green50
              : Color.color_blue50,
          },
          { width: `${fillInPercentage}%`, left: `${timeOffset}%` },
        ]}
      ></View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  progressBar: {
    height: 4,
    width: 60,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: Color.color_blue10,
  },
  fill: {
    height: "100%",
    backgroundColor: Color.color_blue50,
  },
});
