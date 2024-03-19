import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useContext, useRef, useCallback, useState } from "react";
import { Color } from "../../styles/GlobalStyles";

import { Link } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import Button from "../Button";

import { AppContext } from "../../context/AppContext";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useApi from "../../hooks/useApi";
import MainInfo from "./MainInfo";
import { ProjectTypeShort } from "./BasesTopTab";
import ConfirmModal from "./ConfirmModal";
import { ModalMethods } from "./AdditionalBaseView";

type Props = {
  base: ProjectTypeShort;
  hasBid: { bidExist: boolean; bidType?: string };
  hasBiddingWin: boolean;
};

type RootStackParamList = {
  "others/final": { title: string; message: string };
};

// const biddingBody = {
//   crewId, priority,projectId,createdByManager,bidFrom,bidTo, status
// }
const BaseItem = ({ base, hasBid, hasBiddingWin }: Props) => {
  const { userDataState } = useContext(AppContext);
  const modalRef = useRef<ModalMethods>(null);
  const handlePresentModalPress = useCallback(() => {
    modalRef.current?.open();
  }, []);
  const { id: crewId } = userDataState;
  const { apiRequest } = useApi();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { id, fromDate, tillDate } = base;

  const submitApplicationHandler = async () => {
    // const requestBody = {
    //   id: 0,
    //   crewId: crewId,
    //   priority: 1,
    //   projectId: id,
    //   createdByManager: false,
    //   bidFrom: fromDate,
    //   bidTo: tillDate,
    //   status: "Submitted",
    //   comment: "",
    // };
    // await apiRequest("api/Bidding", "POST", requestBody);
    // navigation.navigate("others/final", {
    //   title: "Thank you for the information",
    //   message: "We have sent your details to the planning department.",
    // });
  };

  return (
    <>
      <View style={styles.baseContainer}>
        <MainInfo projectInfo={base} />
        <Button
          disabled={hasBid.bidExist || hasBiddingWin}
          onPress={handlePresentModalPress}
          title={
            hasBiddingWin
              ? "You are already chosen for this time period"
              : hasBid.bidExist
              ? hasBid.bidType
              : "Submit Application"
          }
          textStyle={styles.buttonTextStyle}
          style={styles.buttonStyles}
        />
        <Link
          href={{
            pathname: "/bases/[baseId]",
            params: {
              baseId: `${id}`,
              hasBid: JSON.stringify(hasBid),
              hasBiddingWin: hasBiddingWin,
            },
          }}
          asChild
        >
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>More Details</Text>
            <Entypo
              name="chevron-thin-right"
              size={16}
              color={Color.color_blue50}
            />
          </Pressable>
        </Link>
      </View>
      <ConfirmModal modalRef={modalRef} project={base} />
    </>
  );
};

export default BaseItem;

const styles = StyleSheet.create({
  baseContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 24,
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
  buttonStyles: {
    backgroundColor: Color.backgroundWhite,
    borderWidth: 1,
    borderColor: Color.borderColor,
  },
  buttonTextStyle: {
    color: Color.color_grey90,
  },
});
