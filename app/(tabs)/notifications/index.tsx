import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import UnreadHeader from "../../../src/components/Notifications/UnreadHeader";
import NotificationList from "../../../src/components/Notifications/NotificationList";
import { useNotifications } from "../../../src/context/NotificationsContext";

type Props = {};

const notifications = (props: Props) => {
  return (
    <View>
      <UnreadHeader />
      <NotificationList />
    </View>
  );
};

export default notifications;

const styles = StyleSheet.create({});
