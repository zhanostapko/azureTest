import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ShadowWrapper from "../ShadowWrapper";
import Button from "../Button";
import { Color } from "../../styles/GlobalStyles";
import { useNotifications } from "../../context/NotificationsContext";
import { isLoaded } from "expo-font";
import Loader from "../Loader";

type Props = {
  item: NotificationType;
};

export type NotificationType = {
  id: number;
  recipientCode: string;
  message: string;
  isNew: boolean;
  created: string;
  updated: string;
  createdByCode: string;
  updatedByCode: string;
};

const Notification = ({ item }: Props) => {
  const { isNew } = item;

  const { markAsReadHandler, updateNotificationsList, isLoading } =
    useNotifications();

  const markReadHandler = async () => {
    await markAsReadHandler(item.id);
    updateNotificationsList();
  };
  return (
    <>
      {/* {isLoading && <Loader />} */}
      <ShadowWrapper containerStyle={styles.wrapper}>
        <Text
          style={[
            styles.contentText,
            { fontFamily: isNew ? "Inter_600" : "Inter" },
          ]}
        >
          {item.message}
        </Text>
        {isNew && (
          <Button
            title="Mark as read"
            style={styles.buttonContainer}
            textStyle={styles.buttonText}
            containerStyle={{ width: "100%" }}
            onPress={markReadHandler}
          />
        )}
      </ShadowWrapper>
    </>
  );
};

export default Notification;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    gap: 16,
    padding: 16,
    alignItems: "center",
  },
  contentText: {
    color: Color.color_grey70,
    fontSize: 12,
    fontFamily: "Inter",
    // textAlign: "center",
  },
  buttonContainer: {
    backgroundColor: Color.backgroundWhite,
    borderColor: Color.color_grey20,
    borderWidth: 1,
  },
  buttonText: {
    color: "black",
  },
});
