import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";

import { Color } from "../../styles/GlobalStyles";
import { FlatList, TextInput } from "react-native-gesture-handler";
import BaseItem from "./BaseItem";
import ShadowWrapper from "../ShadowWrapper";
import SearchBar from "./SearchBar";
import useFetch from "../../hooks/useFetch";
import { FormDataType, ItemType } from "./AdditionalBaseView";
import useApi from "../../hooks/useApi";
import { useFocusEffect } from "expo-router";
import ConfirmModal from "./ConfirmModal";
import { ModalMethods } from "./AdditionalBaseView";
import Loader from "../Loader";
import { AppContext } from "../../context/AppContext";
import { BiddingItemType } from "./Applications";
import Button from "../Button";

type Props = {};

export type ProjectTypeShort = {
  id: number;
  iataCode: string;
  name: string;
  destination: string;
  endDate: string;
  fromDate?: string;
  tillDate?: string;
  fullPeriod: boolean;
  status?: string;
  startDate: string;
  countryName: string;
};
export type ProjectType = {
  id: number;
  iataCode: string;
  name: string;
  countryName: string;
  status: string;
  destination: string;
  startDate: string;
  endDate: string;
  fullPeriod: boolean;
  fromDate: string;
  tillDate: string;
  projectDetails: ItemType[];
};

type BiddingWin = {
  id: number;
  crewSelectId: number;
  projectId: number;
  projectDetailsId: number;
  start: string;
  end: string;
  comment: string;
};

const Separator = () => {
  return <View style={styles.separator}></View>;
};

const BasesTopTab = (props: Props) => {
  const { userDataState } = useContext(AppContext);
  const [projectList, setProjectList] = useState<ProjectType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [bids, setBids] = useState<BiddingItemType[]>();
  const [biddingWins, setBiddingWins] = useState<BiddingWin[]>();
  const [searchText, setSearchText] = useState("");

  const { apiRequest } = useApi();

  const fetchData = async () => {
    setIsLoading(true);

    const fetchBidsPromise = apiRequest(
      `api/Bidding/GetByCrewList`,
      undefined,
      undefined,
      {
        crewId: userDataState.id,
        statuses: ["Submitted", "Revoked"],
        pageSize: 5,
      }
    );

    const fetchBiddingWinsPromise = apiRequest(
      `api/BiddingWin/GetByCrewId?crewId=${userDataState.id}`
    );

    const fetchProjectPromise = apiRequest(
      "api/Project/GetList",
      undefined,
      undefined,
      {
        status: "Active",
        pageSize: 100,
        searchField: searchText,
      }
    );

    const [bidsResp, projectResp, biddingWinResp] = await Promise.all([
      fetchBidsPromise,
      fetchProjectPromise,
      fetchBiddingWinsPromise,
    ]);

    const bidsData = bidsResp.status === 204 ? [] : await bidsResp.json();
    const biddingWinData =
      biddingWinResp.status === 204 ? [] : await biddingWinResp.json();

    const projectData =
      projectResp.status === 204 ? [] : await projectResp.json();

    const projectDataList =
      projectData.length === 0 ? projectData : projectData[0].value;

    setBids(bidsData);
    setProjectList(projectDataList);
    setBiddingWins(biddingWinData);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const hasBidHandler = (
    id: number
  ): { bidExist: boolean; bidType?: string } => {
    const foundBid = bids?.find((bid: BiddingItemType) => bid.projectId === id);
    if (foundBid) {
      return { bidExist: true, bidType: foundBid.status };
    } else {
      return { bidExist: false };
    }
  };

  const hasBiddingWinHandler = (
    projectStartDate: string,
    projectEndDate: string
  ) => {
    return (
      biddingWins?.some((biddingWin) => {
        return (
          new Date(biddingWin.start) <= new Date(projectEndDate) &&
          new Date(biddingWin.end) >= new Date(projectStartDate)
        );
      }) || false
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && projectList && (
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <SearchBar handleSearch={handleSearch} searchValue={searchText} />
          {projectList.length === 0 ? (
            <>
              <Text style={styles.noProjects}>No active projects.</Text>
            </>
          ) : (
            <>
              <FlatList
                data={projectList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={({ item }) => (
                  <BaseItem
                    base={item}
                    hasBid={hasBidHandler(item.id)}
                    hasBiddingWin={hasBiddingWinHandler(
                      item.fromDate,
                      item.tillDate
                    )}
                  />
                )}
                ItemSeparatorComponent={Separator}
                ListHeaderComponent={Separator}
              />
            </>
          )}
        </View>
      )}
    </>
  );
};

export default BasesTopTab;

const styles = StyleSheet.create({
  separator: { backgroundColor: Color.color_blue10, height: 16 },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  noProjects: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 24,
    color: Color.color_grey20,
  },
});
