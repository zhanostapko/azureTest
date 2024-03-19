import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Color } from "../../styles/GlobalStyles";
import { Switch } from "react-native-gesture-handler";
import { useNotifications } from "../../context/NotificationsContext";

type Props = {};

const UnreadHeader = ({}: Props) => {
  const { updateNotificationsList, switchState, setSwitchState } =
    useNotifications();

  // useEffect(() => {
  //   updateNotificationsList(switchState);
  // }, [switchState]);

  const switchChangeHandler = (state: boolean) => {
    setSwitchState(state);
  };

  return (
    <View style={styles.switchContainer}>
      <Text style={styles.text}>Show only unread</Text>
      <Switch
        value={switchState}
        onValueChange={(state) => switchChangeHandler(state)}
        trackColor={{
          true: !switchState ? Color.color_grey10 : Color.color_blue50,
        }}
        thumbColor={Color.backgroundWhite}
      />
    </View>
  );
};

export default UnreadHeader;

const styles = StyleSheet.create({
  switchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "white",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    shadowColor: "#000",
    elevation: 7,
  },
  text: {
    fontFamily: "Inter_500",
    fontSize: 16,
  },
});
