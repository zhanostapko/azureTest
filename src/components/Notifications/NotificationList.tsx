import {
  FlatList,
  Image,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Notification, { NotificationType } from "./Notification";
import { format, isToday } from "date-fns";
import { Color } from "../../styles/GlobalStyles";
import { useNotifications } from "../../context/NotificationsContext";
import doubleCheckMark from "../../../assets/custom_icons/doubleCheckMark.png";

type Props = {};

interface NotificationGroup {
  [date: string]: NotificationType[];
}

const NotificationList = ({}: Props) => {
  const { notifications } = useNotifications();

  const groupedNotifications = (
    notifications as any[]
  )?.reduce<NotificationGroup>((acc, item) => {
    const date = item.created?.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const sections = Object.keys(groupedNotifications).map((date) => {
    return {
      title: date,
      data: groupedNotifications[date],
    };
  });

  return (
    <>
      {sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={doubleCheckMark} />
          <Text style={styles.emptyTitle}>No unread notifications</Text>
          <Text style={styles.emptyContent}>
            Read all messages for the last 30 days.
          </Text>
        </View>
      ) : (
        <>
          <SectionList
            style={styles.listContainer}
            sections={sections}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => <Notification item={item} />}
            renderSectionHeader={({ section: { title } }) => {
              const isTodayCheck = isToday(new Date(title));
              const titleDate = isTodayCheck
                ? "TODAY"
                : format(new Date(title), "dd.MM.yyyy");
              return <Text style={styles.headerTitle}>{titleDate}</Text>;
            }}
          />
        </>
      )}
    </>
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  listContainer: {
    gap: 16,
    marginBottom: 64,
    height: "100%",
  },

  headerTitle: {
    textAlign: "center",
    marginTop: 8,
    color: Color.color_grey50,
    fontFamily: "Inter_500",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    maxWidth: "70%",
    alignSelf: "center",
    gap: 16,
  },
  emptyTitle: {
    fontFamily: "Inter_500",
    fontSize: 28,
    textAlign: "center",
    lineHeight: 36,
  },
  emptyContent: {
    fontFamily: "Inter_400",
    fontSize: 12,
    lineHeight: 16,
    color: Color.color_grey50,
    textAlign: "center",
  },
});
