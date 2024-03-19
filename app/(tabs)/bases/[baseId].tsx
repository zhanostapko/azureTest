import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import AdditionalBaseView from "../../../src/components/Bases/AdditionalBaseView";
import Loader from "../../../src/components/Loader";

type Props = {};

const AdditionalView = (props: Props) => {
  const params = useLocalSearchParams();
  const { baseId, hasBid, hasBiddingWin } = params;

  if (baseId === undefined && hasBid === undefined) {
    return <Loader />;
  }

  return (
    <AdditionalBaseView
      baseId={baseId}
      hasBid={hasBid}
      hasBiddingWin={hasBiddingWin}
    />
  );
};

export default AdditionalView;

const styles = StyleSheet.create({});
