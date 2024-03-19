import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Color } from "../../styles/GlobalStyles";
import ShadowWrapper from "../ShadowWrapper";
import { BiddingItemType } from "./Applications";
import DisclaimerWindowWrapper from "../DisclaimerWindowWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShortCodeBadge from "../ShortCodeBadge";
import AircraftIcon from "../../../assets/custom_icons/aircraft.svg";
import ProgressBar from "../ProgressBar";
import ArrowLeft from "../../../assets/custom_icons/arrowLeft.svg";
import ArrowRight from "../../../assets/custom_icons/arrowRight.svg";
import SmallArrowLeft from "../../../assets/custom_icons/smallArrowLeft.svg";
import SmallArrowRight from "../../../assets/custom_icons/smallArrowRight.svg";
import { format } from "date-fns";
import Button from "../Button";
import RevokeConfirmModal from "./RevokeConfirmModal";

type Props = {
  bidNumber: number;
  bid: BiddingItemType | null;
  refetchBids: () => Promise<void>;
};

const ActualBidItem = ({ bidNumber, bid, refetchBids }: Props) => {
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const niaMatch = bid?.nia === bid?.baseName;
  let progressPercentage: number = 0,
    timeOffset: number = 0;

  const wholeProjectBid =
    bid &&
    ((bid?.bidFrom === bid?.projectFrom && bid?.bidTo === bid?.projectTo) ||
      bid.fullPeriod);

  if (bid) {
    const progressBarFilling = () => {
      const totalDuration =
        new Date(bid.projectTo).getTime() - new Date(bid.projectFrom).getTime();
      const filledDuration =
        new Date(bid.bidTo).getTime() - new Date(bid.bidFrom).getTime();
      const progressPercentage = (filledDuration / totalDuration) * 100;

      const timeOffset = +(
        ((new Date(bid.bidFrom).getTime() -
          new Date(bid.projectFrom).getTime()) /
          totalDuration) *
        100
      ).toFixed(2);

      return { timeOffset, progressPercentage };
    };

    const additionalBarInfo = progressBarFilling();
    progressPercentage = additionalBarInfo.progressPercentage;
    timeOffset = additionalBarInfo.timeOffset;
  }

  return (
    <>
      <View style={styles.itemContainer}>
        <View style={styles.timelineContainer}>
          <ShadowWrapper containerStyle={styles.badgeContainer}>
            <Text style={styles.textInBadge}>{bidNumber}</Text>
          </ShadowWrapper>
          {bidNumber !== 3 && <View style={styles.timeline}></View>}
        </View>

        {bid ? (
          <View style={styles.dataContainer}>
            <View>
              <View style={styles.headerContainer}>
                <View style={styles.header}>
                  <View style={styles.projectTitleContainer}>
                    <Text style={styles.projectTitle} numberOfLines={0}>
                      {bid.projectName}
                    </Text>
                    {/* <Text style={styles.newBadge}>New</Text> */}
                  </View>
                  <View style={styles.additionalInfo}>
                    <View style={styles.additionalItemContainer}>
                      <MaterialCommunityIcons
                        name="map-marker-radius-outline"
                        size={16}
                        color={Color.color_grey60}
                      />
                      <Text style={styles.additionalItemText}>
                        {bid.projectCountry}
                      </Text>
                    </View>
                    {bid.projectDestination && (
                      <View style={styles.additionalItemContainer}>
                        <AircraftIcon />
                        <Text style={styles.additionalItemText}>
                          {bid.projectDestination}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <ShortCodeBadge
                  code={bid.baseName}
                  style={styles.baseBadge}
                  textStyle={styles.textBadge}
                  nia={niaMatch}
                />
              </View>
            </View>
            <View style={styles.durationContainer}>
              <View style={styles.projectDuration}>
                <Text style={styles.projectDate}>
                  {format(new Date(bid.projectFrom), "MMM dd, yyyy")}
                </Text>
                <View style={styles.projectDurationLabelContainer}>
                  <ArrowLeft />
                  <Text style={styles.projectDurationLabel}>Project Dates</Text>
                  <ArrowRight />
                </View>
                <Text style={styles.projectDate}>
                  {" "}
                  {format(new Date(bid.projectTo), "MMM dd, yyyy")}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <ProgressBar
                  style={{ flex: 1 }}
                  fillInPercentage={progressPercentage}
                  timeOffset={timeOffset}
                  fullPeriod={wholeProjectBid || false}
                />
              </View>
              <View
                style={[
                  styles.biddingDuration,
                  { width: `${progressPercentage}%`, left: timeOffset },
                ]}
              >
                <Text
                  style={[
                    styles.biddingDate,
                    {
                      color: wholeProjectBid
                        ? Color.color_green50
                        : Color.color_blue50,
                    },
                  ]}
                >
                  {format(new Date(bid.bidFrom), "MMM dd")}
                </Text>
                {wholeProjectBid && (
                  <View style={styles.wholeProjectDateContainer}>
                    <SmallArrowLeft
                      stroke={
                        wholeProjectBid
                          ? Color.color_green50
                          : Color.color_blue50
                      }
                    />
                    <Text
                      style={[
                        styles.wholeProjectDateLabel,
                        {
                          color: wholeProjectBid
                            ? Color.color_green50
                            : Color.color_blue50,
                        },
                      ]}
                    >
                      Application for a complete project
                    </Text>
                    <SmallArrowRight
                      stroke={
                        wholeProjectBid
                          ? Color.color_green50
                          : Color.color_blue50
                      }
                    />
                  </View>
                )}
                <Text
                  style={[
                    styles.biddingDate,
                    {
                      color: wholeProjectBid
                        ? Color.color_green50
                        : Color.color_blue50,
                    },
                  ]}
                >
                  {format(new Date(bid.bidTo), "MMM dd")}
                </Text>
              </View>
            </View>
            {bid.comment && (
              <DisclaimerWindowWrapper style={styles.commentWrapper}>
                <Text style={styles.commentTitle}>Comment</Text>
                <Text style={styles.commentText}>{bid.comment}</Text>
              </DisclaimerWindowWrapper>
            )}

            <Button
              style={styles.buttonStyles}
              textStyle={styles.buttonTextStyle}
              title="Revoke"
              onPress={() => setRevokeModalOpen(true)}
            />
            <RevokeConfirmModal
              bid={bid}
              modalVisible={revokeModalOpen}
              onClose={() => setRevokeModalOpen(false)}
              refetchBids={refetchBids}
            />
          </View>
        ) : (
          <DisclaimerWindowWrapper style={styles.noBidContainer}>
            <Text style={styles.noBidText}>No Bid</Text>
          </DisclaimerWindowWrapper>
        )}
      </View>
    </>
  );
};

export default ActualBidItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    gap: 16,
  },
  timelineContainer: {
    position: "relative",
    alignItems: "center",
  },
  timeline: {
    width: 1,
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    zIndex: -1,
    backgroundColor: Color.color_blue10,
  },
  badgeContainer: {
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textInBadge: {
    color: Color.color_grey90,
    fontSize: 16,
    fontFamily: "Inter_600",
  },
  dataContainer: {
    flex: 1,
    gap: 16,
    marginBottom: 24,
  },
  noBidContainer: {
    flex: 1,
    marginBottom: 24,
    backgroundColor: Color.color_grey5,
  },
  noBidText: {
    color: Color.color_grey70,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    maxWidth: "100%",
    gap: 8,
  },
  header: {
    gap: 8,
    flex: 1,
  },
  projectTitleContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  additionalInfo: {
    flexDirection: "row",
    gap: 6,
  },
  baseBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  textBadge: {
    fontSize: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: "Inter_500",
    color: Color.color_grey90,
    flexShrink: 1,
  },
  newBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    padding: 2,
    fontFamily: "Inter",
    color: Color.backgroundWhite,
    backgroundColor: Color.color_blue50,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  additionalItemContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  additionalItemText: {
    textTransform: "uppercase",
    color: Color.color_grey70,
    fontSize: 12,
    fontFamily: "Inter_500",
  },
  durationContainer: { gap: 8 },
  projectDuration: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectDurationLabelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  projectDurationLabel: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Inter_700",
    color: Color.color_grey70,
  },
  projectDate: {
    color: Color.color_grey70,
    fontFamily: "Inter",
    fontSize: 10,
  },
  biddingDuration: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 75,
  },
  biddingDate: {
    fontSize: 10,
    fontFamily: "Inter",
  },
  progressBarContainer: {
    flexDirection: "row",
  },
  commentWrapper: {
    backgroundColor: Color.backgroundWhite,
    borderWidth: 1,
    borderColor: Color.color_grey10,
    gap: 16,
  },
  commentTitle: {
    fontFamily: "Inter_500",
    fontSize: 14,
    color: Color.color_grey90,
  },
  commentText: {
    fontSize: 12,
    fontFamily: "Inter",
    color: Color.color_grey70,
  },
  wholeProjectDateContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  wholeProjectDateLabel: {
    fontSize: 10,
    fontFamily: "Inter",
  },
  buttonStyles: {
    backgroundColor: Color.backgroundWhite,
    borderWidth: 1,
    borderColor: Color.borderColor,
  },
  buttonTextStyle: {
    color: Color.color_grey90,
  },
});
