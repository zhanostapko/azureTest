import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../src/components/Button";
import { Color } from "../../src/styles/GlobalStyles";
import WarningImage from "../../assets/custom_icons/warningRevoke.svg";

type Props = {};

const revokeConfirmation = (props: Props) => {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.content}>
        <WarningImage />
        <Text style={styles.confirmTitle}>Please Confirm</Text>
        <Text style={styles.confirmText}>
          Do you really want to cancel your application for the base{" "}
          <Text style={styles.projectTitle}>SKY CANA</Text>?
        </Text>
      </View>
      <View style={styles.actions}>
        <Button title="Confirm" onPress={() => console.log("Confirm")} />
        <Button
          style={styles.cancelButton}
          textStyle={styles.cancelText}
          title="Cancel"
          onPress={() => console.log("Cancel")}
        />
      </View>
    </SafeAreaView>
  );
};

export default revokeConfirmation;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  actions: {
    gap: 16,
  },
  cancelButton: {
    backgroundColor: Color.backgroundWhite,
  },
  cancelText: {
    color: Color.color_grey90,
  },
  confirmTitle: { fontSize: 28, fontFamily: "Lato", color: Color.color_grey90 },
  confirmText: {
    fontSize: 12,
    fontFamily: "Lato",
    color: Color.color_grey60,
    textAlign: "center",
    lineHeight: 16,
  },
  projectTitle: { fontWeight: "700", fontFamily: "Lato" },
});
