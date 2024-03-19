import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Color } from "../../styles/GlobalStyles";
import ShadowWrapper from "../ShadowWrapper";
import { ScrollView } from "react-native-gesture-handler";

import useFetch from "../../hooks/useFetch";
import { AppContext } from "../../context/AppContext";
import { ClipPath } from "react-native-svg";
import Loader from "../Loader";
import useApi from "../../hooks/useApi";
import FilterBar from "./FilterBar";
import ActualList from "./ActualList";
import HistoricalList from "./HistoricalList";

type Props = {};

export type BiddingItemType = {
  id: number;
  crewId: number;
  crewCode: string;
  fullName: string;
  position: string;
  qualification: string;
  rank: string;
  roles: string;
  availability: null;
  nia: string;
  priority: number;
  projectId: number;
  projectName: string;
  createdByManager: false;
  baseName: string;
  projectFrom: string;
  projectTo: string;
  bidFrom: string;
  bidTo: string;
  bidPoints: number;
  status: string;
  bidCrewTotal: number;
  bidCrewRank: number;
  projectCountry?: string;
  comment?: string;
  fullPeriod?: boolean;
  projectDestination: string;
  // fromDate: string;
  // tillDate: string;
};

const filterValues = ["Actual", "Approved", "Revoked", "Rejected", "Cancelled"];

const Applications = ({}: Props) => {
  const [filterValueIndex, setFilterValueIndex] = useState(0);

  return (
    <>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <FilterBar
            values={filterValues}
            onSelect={(index) => setFilterValueIndex(index)}
          />

          {filterValueIndex === 0 && <ActualList />}
          {filterValueIndex !== 0 && (
            <HistoricalList filterValue={filterValues[filterValueIndex]} />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Applications;

const styles = StyleSheet.create({
  screenContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Color.backgroundWhite,
  },
});
