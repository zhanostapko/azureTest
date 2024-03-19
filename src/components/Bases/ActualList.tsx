import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { BiddingItemType } from "./Applications";
import useApi from "../../hooks/useApi";
import ActualBidItem from "./ActualBidItem";
import Loader from "../Loader";

type Props = {};

const ApplicationsList = (props: Props) => {
  const timeline: (null | BiddingItemType)[] = [null, null, null];

  const { userDataState } = useContext(AppContext);
  const { apiRequest } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [bids, setBids] = useState<BiddingItemType[]>();

  const fetchBids = async () => {
    setIsLoading(true);
    const res = await apiRequest(
      `api/Bidding/GetByCrewList`,
      undefined,
      undefined,
      {
        crewId: userDataState.id,
        statuses: "Submitted",
        pageSize: 5,
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
    setBids(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const sortedItems = bids?.sort((a: any, b: any) => a.priority - b.priority);

  sortedItems?.forEach((item: any) => {
    timeline[item.priority - 1] = item;
  });
  return (
    <>
      {isLoading && (
        <View>
          <Loader />
        </View>
      )}
      {!isLoading &&
        bids &&
        timeline.map((item, i) => (
          <ActualBidItem
            key={i}
            bidNumber={i + 1}
            bid={item}
            refetchBids={fetchBids}
          />
        ))}
    </>
  );
};

export default ApplicationsList;

const styles = StyleSheet.create({});
