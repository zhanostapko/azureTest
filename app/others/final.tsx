import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Color } from "../../src/styles/GlobalStyles";
import SuccessIcon from "../../assets/images/success.svg";
import { Entypo } from "@expo/vector-icons";

type Props = {};

const finalScreen = (props: Props) => {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { title, message } = params;

  return (
    <View style={[styles.screenWrapper, { paddingTop: insets.top }]}>
      <Text style={styles.title}>
        {title || "Thank you for the information"}
      </Text>
      <Text style={styles.additionalInfo}>
        {message || "We have sent your details to the planning department."}
      </Text>
      <SuccessIcon />
      <Link href={"/"} asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Home Page</Text>
          <Entypo
            name="chevron-thin-right"
            size={16}
            color={Color.color_blue50}
          />
        </Pressable>
      </Link>
    </View>
  );
};

export default finalScreen;

const styles = StyleSheet.create({
  screenWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 16,
    padding: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Inter_500",
  },
  additionalInfo: {
    textAlign: "center",
    fontSize: 14,
    color: Color.color_grey90,
    fontFamily: "Inter",
  },
  link: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    fontSize: 16,
    fontFamily: "Inter_500",
    color: Color.color_blue50,
  },
});
