import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import { Color } from "../styles/GlobalStyles";

type Props = {};

const Loader = (props: Props) => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator color={Color.color_blue50} size={"large"} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
