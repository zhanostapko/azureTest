import { StyleSheet, Text, View, ViewStyle, Platform } from "react-native";
import React from "react";
import { Color } from "../styles/GlobalStyles";

type Props = {
  containerStyle?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
};

const BlockWrapper = ({ containerStyle, children }: Props) => {
  return <View style={[styles.container, containerStyle]}>{children}</View>;
};

export default BlockWrapper;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: Color.color_grey90,
    // overflow: "hidden",
    ...Platform.select({
      android: {
        elevation: 10,
      },
      ios: {
        shadowOffsetborderRadius: 8,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 1,
        shadowOpacity: 1,
      },
    }),
  },
});
