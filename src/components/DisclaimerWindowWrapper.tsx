import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";
import { Color } from "../styles/GlobalStyles";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle | TextStyle>;
};

const DisclaimerWindowWrapper = ({ children, style }: Props) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default DisclaimerWindowWrapper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.color_yellow20,
    borderRadius: 8,
    padding: 16,
  },
});
