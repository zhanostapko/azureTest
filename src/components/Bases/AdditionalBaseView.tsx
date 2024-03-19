import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  Platform,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import React, {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../Loader";
import MainInfo from "./MainInfo";
import { ProjectTypeShort } from "./BasesTopTab";
import { Color } from "../../styles/GlobalStyles";
import DisclaimerWindowWrapper from "../DisclaimerWindowWrapper";
import ShadowWrapper from "../ShadowWrapper";
import AircraftIcon from "../../../assets/custom_icons/aircraft.svg";
import FromIcon from "../../../assets/custom_icons/from.svg";
import ToIcon from "../../../assets/custom_icons/checkmarkCircle.svg";
import CrewSetIcon from "../../../assets/custom_icons/crewSet.svg";
import WorldIcon from "../../../assets/custom_icons/world.svg";
import PlusCircleIcon from "../../../assets/custom_icons/plusCircle.svg";
import CartIcon from "../../../assets/custom_icons/cart.svg";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import CustomModal from "../CustomModal";
import DropDownPicker from "react-native-dropdown-picker";

import { Feather } from "@expo/vector-icons";
import Button from "../Button";
import DatePicker from "../DatePicker";
import ConfirmModal from "./ConfirmModal";

export type FetchedListType = {
  id: number;
  name: string;
  type?: string;
  iataCode?: string;
  countryName?: string;
  isEnabledEmailNotification?: boolean;
};

export type ItemType = {
  id?: number;
  aircraftType: string;
  projectRanks: { id: number; crewRank: string; crewCount: string }[];
  numberOfAircrafts: number;
  crewCount: number;
  fromDate: string;
  tillDate: string;
};

export type FormDataType = {
  id?: number;
  status?: string | null;
  iataCode: string;
  name: string;
  destination: string;
  countryName: string;
  endDate: string;
  startDate?: string;
  comment: string;
  fullPeriod: boolean;
  tillDate?: string;
  fromDate?: string;
  details: ItemType[];
  information: {
    id?: number;
    rosterPattern: string;
    visas: FetchedListType[];
    vaccines: FetchedListType[];
    languages: FetchedListType[];
    additional: string;
  };
  notifications: {
    id?: number;
    sendNotifications: boolean;
    notificationGroups: { id: number }[];
    emailNotes: string;
  };
};

type PriorityType = {
  _index?: number;
  label: string;
  value: string;
};

export type ModalMethods = {
  open: () => void;
};

type Props = {
  baseId?: string | string[];
  hasBid?: string | string[] | undefined;
  hasBiddingWin?: string | string[];
};

const AdditionalBaseView = ({ baseId, hasBid, hasBiddingWin }: Props) => {
  const {
    data: project,
    isLoading,
    error,
  } = useFetch<FormDataType>(`api/Project?projectId=${baseId}`);

  const projectHasBid = JSON.parse(hasBid as string);
  const projectHasBiddingWinsOverlap = JSON.parse(hasBiddingWin as string);

  const modalRef = useRef<ModalMethods>();

  const handlePresentModalPress = useCallback(() => {
    modalRef.current?.open();
  }, []);

  if (!project || isLoading) return <Loader />;

  const {
    id,
    countryName,
    endDate,
    iataCode,
    name,
    destination,
    fullPeriod,
    startDate,
    status,
    tillDate,
    fromDate,
    details,
    information,
    comment,
  } = project;

  const mainInfo = {
    id,
    countryName,
    endDate,
    iataCode,
    name,
    destination,
    fullPeriod,
    startDate,
    status,
  } as ProjectTypeShort;

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.mainInfoContainer}
        // style={styles.mainInfoContainer}
      >
        <MainInfo projectInfo={mainInfo} />
        <View style={styles.sectionContainer}>
          <Text style={styles.containerTitle}>Date</Text>
          <View style={styles.datesWrapper}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>Start project</Text>
              <Text style={styles.dateText}>End project</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {(fromDate && format(new Date(fromDate), "dd MMM, yyyy")) ||
                  "-"}
              </Text>
              <Text style={styles.dateText}>
                {(tillDate && format(new Date(tillDate), "dd MMM, yyyy")) ||
                  "-"}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={styles.sectionContainer}>
          <Text style={styles.containerTitle}>disclaimer </Text>
        </View> */}
        <DisclaimerWindowWrapper>
          <View style={styles.disclaimerContainer}>
            <View style={styles.disclaimerHeaderContainer}>
              <View style={styles.disclaimerTitleContainer}>
                <Feather
                  name="alert-triangle"
                  size={16}
                  color={Color.color_yellow50}
                />
                <Text style={styles.disclaimerTitle}>Attention!</Text>
              </View>
            </View>
            <Text style={styles.disclaimerContent}>
              No rotations are expected, thus please apply only in case of
              availability for the whole length of the project.
            </Text>
          </View>
        </DisclaimerWindowWrapper>
        <View style={styles.sectionContainer}>
          <Text style={styles.containerTitle}>Project Details</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.itemsScrollViewContainer}
          >
            <View style={styles.aircraftItemTitlesContainer}>
              <View style={styles.titleContainer}>
                <AircraftIcon />
                <Text style={styles.titleText}>Aircraft</Text>
              </View>
              <View style={styles.titleContainer}>
                <CrewSetIcon />
                <Text style={styles.titleText}>CrewSet</Text>
              </View>
              <View>
                <Text style={styles.titleText}></Text>
              </View>
              <View style={styles.titleContainer}>
                <FromIcon />
                <Text style={styles.titleText}>From</Text>
              </View>
              <View style={styles.titleContainer}>
                <ToIcon />
                <Text style={styles.titleText}>To</Text>
              </View>
            </View>
            {details.map((detail) => {
              const { aircraftType, fromDate, tillDate, id } = detail;
              return (
                <ShadowWrapper
                  key={id}
                  containerStyle={styles.aircraftContainer}
                >
                  <Text style={[styles.titleText, styles.aircraftName]}>
                    {aircraftType}
                  </Text>
                  <View style={styles.aircraftItemSetContainer}>
                    <Text style={styles.titleText}>Needed for Aircraft</Text>
                    <View style={styles.aircraftCountBubble}>
                      <Text
                        style={[styles.titleText, styles.aircraftBubbleText]}
                      >
                        10
                      </Text>
                    </View>
                  </View>
                  <View style={styles.aircraftItemSetContainer}>
                    <Text style={styles.titleText}>Approved Crew Members</Text>
                    <View style={styles.aircraftCountBubble}>
                      <Text
                        style={[styles.titleText, styles.aircraftBubbleText]}
                      >
                        2
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.titleText}>
                    {format(new Date(fromDate), "MMM dd, yyyy")}
                  </Text>
                  <Text style={styles.titleText}>
                    {" "}
                    {format(new Date(tillDate), "MMM dd, yyyy")}
                  </Text>
                </ShadowWrapper>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.containerTitle}>Information</Text>
          <View>
            <View style={styles.informationItemContainer}>
              <View style={[styles.titleContainer, styles.informationColumn]}>
                <CartIcon />
                <Text style={styles.titleText}>Visas</Text>
              </View>

              <View style={styles.informationColumn}>
                {(information.visas.length &&
                  information.visas.map((item) => {
                    return (
                      <Text key={item.id} style={styles.titleText}>
                        {item.name}
                      </Text>
                    );
                  })) || <Text style={styles.titleText}>Not required</Text>}
              </View>
            </View>
            <View style={styles.informationItemContainer}>
              <View style={[styles.titleContainer, styles.informationColumn]}>
                <PlusCircleIcon />
                <Text style={styles.titleText}>Vaccines</Text>
              </View>

              <View style={styles.informationColumn}>
                {(information.vaccines.length &&
                  information.vaccines.map((item) => (
                    <Text key={item.id} style={styles.titleText}>
                      {item.name}
                    </Text>
                  ))) || <Text style={styles.titleText}>Not required</Text>}
              </View>
            </View>
            <View style={styles.informationItemContainer}>
              <View style={[styles.titleContainer, styles.informationColumn]}>
                <WorldIcon />
                <Text style={styles.titleText}>Languages</Text>
              </View>

              <View style={styles.informationColumn}>
                {(information.languages.length &&
                  information.languages.map((item) => (
                    <Text key={item.id} style={styles.titleText}>
                      {item.name}
                    </Text>
                  ))) || <Text style={styles.titleText}>Not required</Text>}
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.commentContainer]}>
          <Text style={styles.containerTitle}>Comment</Text>
          <Text style={styles.commentContent}>
            {comment || "No comments for this project"}
          </Text>
        </View>
        <Button
          disabled={projectHasBid.bidExist || projectHasBiddingWinsOverlap}
          title={
            projectHasBiddingWinsOverlap
              ? "You are already chosen for this time period"
              : projectHasBid.bidExist
              ? projectHasBid.bidType
              : "Submit Application"
          }
          onPress={handlePresentModalPress}
        />
        <ConfirmModal project={project} modalRef={modalRef} />
      </ScrollView>
    </>
  );
};

export default AdditionalBaseView;

const styles = StyleSheet.create({
  mainInfoContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 24,
  },
  sectionContainer: { gap: 26 },
  containerTitle: {
    color: Color.color_grey90,
    fontSize: 16,
    fontFamily: "Inter_500",
  },
  datesWrapper: {
    flexDirection: "row",
    gap: 42,
  },
  dateContainer: {
    gap: 20,
    justifyContent: "space-between",
  },
  dateText: {
    fontFamily: "Inter",
    fontSize: 12,
    color: Color.color_grey90,
  },
  disclaimerContainer: {
    gap: 16,
  },
  disclaimerHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disclaimerTitleContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  disclaimerTitle: {
    color: Color.color_yellow50,
    fontFamily: "Inter_700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 2.4,
  },
  disclaimerContent: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 20,
    color: Color.color_grey90,
  },
  aircraftContainer: {
    gap: 16,
    minWidth: 200,
  },
  aircraftItemTitlesContainer: {
    gap: 16,
    paddingVertical: 16,
  },
  titleText: {
    fontSize: 12,
    fontFamily: "Inter",
    color: Color.color_grey90,
    lineHeight: 14,
  },
  aircraftName: {
    fontSize: 14,
    fontFamily: "Inter_500",
  },
  aircraftItemSetContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aircraftCountBubble: {
    backgroundColor: Color.color_blue10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  aircraftBubbleText: {
    color: Color.color_blue50,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  commentContainer: {
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Color.color_grey10,
    borderRadius: 8,
  },
  commentContent: {
    color: Color.color_grey70,
    fontSize: 12,
    fontFamily: "Inter",
  },
  informationItemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  informationColumn: {
    flex: 1,
    gap: 20,
    marginBottom: 20,
  },
  itemsScrollViewContainer: {
    paddingBottom: 16,
    paddingRight: 16,
    paddingTop: 2,
    gap: 16,
  },
});
