import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import ShadowWrapper from "../ShadowWrapper";
import { Color } from "../../styles/GlobalStyles";
import { formattedPointsFunc } from "../../other/helpers";

type Props = {
  pointsType: "incomes" | "expenses";
  points?: number;
};

const TotalContainer = ({ pointsType, points }: Props) => {
  let gradientColor = [];
  let textColor;
  const label = pointsType === "incomes" ? "Point balance" : "Total spent";
  const formattedPoints = points ? formattedPointsFunc(points) : 0;

  switch (pointsType) {
    case "incomes":
      gradientColor = ["rgba(255, 255, 255, 0.5)", "rgba(230, 252, 243, 0.5) "];
      textColor = Color.color_green50;
      break;
    case "expenses":
      gradientColor = ["rgba(255, 255, 255, 0.5) ", "rgba(249, 229, 229, 0.5)"];
      textColor = Color.color_red50;
      break;
  }

  return (
    <ShadowWrapper containerStyle={{ flex: 1 }}>
      <LinearGradient
        locations={[0.1, 0.5]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={gradientColor}
        style={{
          borderRadius: 8,
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      />
      <View>
        <Text style={styles.title}>{label}</Text>
        <Text style={[styles.points, { color: textColor }]}>
          {formattedPoints}
        </Text>
      </View>

      {/* <View style={styles.statsBoard}>
      <View style={styles.statsData}>
        <Text style={styles.title}>Total Spent</Text>
        <Text>125</Text>
      </View>
    </View> */}
    </ShadowWrapper>
  );
};

export default TotalContainer;

const styles = StyleSheet.create({
  innerContainer: {
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontFamily: "Inter_700",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    color: Color.color_grey70,
  },
  points: {
    fontSize: 24,
    fontFamily: "Inter_500",
  },
});
