import {
  Pressable,
  StyleSheet,
  Text,
  View,
  PressableStateCallbackType,
  ViewStyle,
  StyleProp,
  TextStyle,
} from "react-native";
import React, { forwardRef, Ref } from "react";
import { Color } from "../styles/GlobalStyles";

type Props = {
  onPress?: () => any;
  title: string | React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  rippleColor?: string;
  // containerStyle?: ViewStyle;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const Button = (
  {
    title,
    onPress,
    style,
    textStyle,
    rippleColor,
    containerStyle,
    disabled,
  }: Props,
  ref: Ref<View>
) => {
  return (
    <View style={[styles.buttonContainer, containerStyle]}>
      <Pressable
        ref={ref}
        disabled={disabled}
        android_ripple={{ color: `${rippleColor}` }}
        style={({
          pressed,
        }: PressableStateCallbackType): StyleProp<ViewStyle> => [
          styles.button,
          style,
          disabled ? { backgroundColor: Color.color_grey10 } : null,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onPress}
      >
        <View>
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default React.forwardRef(Button);

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 4,
    overflow: "hidden",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: Color.color_blue50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonText: {
    fontFamily: "Inter_500",
    color: Color.backgroundWhite,
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
