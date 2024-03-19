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
  style?: ViewStyle;
  textStyle?: TextStyle;
  code: string;
  nia?: boolean;
};

const ShortCodeBadge = ({ style, code, textStyle, nia }: Props) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: nia ? Color.color_green10 : Color.color_blue10 },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: nia ? Color.color_green50 : Color.color_blue50 },
          textStyle,
        ]}
      >
        {code}
      </Text>
    </View>
  );
};

export default ShortCodeBadge;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    textTransform: "uppercase",
    fontFamily: "Inter_600",
    fontSize: 14,
  },
});
