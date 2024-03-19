import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { BiddingItemType } from "./Applications";
import useApi from "../../hooks/useApi";
import HistoricalBidItem from "./HistoricalBidItem";
import Loader from "../Loader";
import { Color } from "../../styles/GlobalStyles";

type Props = {
  filterValue: string;
};

const HistoricalList = ({ filterValue }: Props) => {
  const [historicalBids, setHistoricalBids] = useState<BiddingItemType[]>();
  const { userDataState } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const { apiRequest } = useApi();

  const fetchHistoricalBids = async () => {
    setIsLoading(true);
    const res = await apiRequest(
      `api/Bidding/GetByCrewList`,
      undefined,
      undefined,
      {
        crewId: userDataState.id,
        statuses: filterValue,
        pageSize: 100,
      }
    );

    const data = res.status === 204 ? [] : await res.json();

    // data?.forEach(
    //   (item: { key: string; value: CrewType[] | PaginationType }) => {
    //     if (item.key === "Pagination") {
    //       const newParams = {
    //         ...currentTableParams,
    //         pagination: item.value as PaginationType,
    //       };
    //       setTableParams("crewMembers", newParams);
    //     } else if (item.key === "Result") {
    //       setCrewList(item.value as CrewType[]);
    //     }
    //   }
    // );
    setHistoricalBids(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistoricalBids();
  }, [filterValue]);

  return (
    <>
      {isLoading && (
        <View>
          <Loader />
        </View>
      )}
      {!isLoading && historicalBids && historicalBids?.length === 0 && (
        <Text style={styles.noBidsFound}>No bids found</Text>
      )}

      {!isLoading &&
        historicalBids?.map((bid, i: number) => (
          <HistoricalBidItem key={bid.id} bid={bid} />
        ))}
    </>
  );
};

export default HistoricalList;

const styles = StyleSheet.create({
  noBidsFound: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_500",
    color: Color.color_grey60,
  },
});
