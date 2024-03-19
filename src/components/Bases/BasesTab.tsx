import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

import { Color } from "../../styles/GlobalStyles";
import { FlatList, TextInput } from "react-native-gesture-handler";
import BaseItem from "./BaseItem";
import ShadowWrapper from "../ShadowWrapper";
import SearchBar from "./SearchBar";
import useFetch from "../../hooks/useFetch";
import { FormDataType } from "./AdditionalBaseView";

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

const dummy_bases: ProjectTypeShort[] = [
  {
    id: 1,
    iataCode: "RIX",
    name: "TestProject19",
    countryName: "Latvia",
    status: "Draft",
    destination: "TestDestination1",
    startDate: "2023-10-05T14:49:30.9099575",
    endDate: "2023-07-04T16:26:52.8586612",
    fullPeriod: false,
    fromDate: "2023-06-20T16:26:52.8586528",
    tillDate: "2023-07-04T16:26:52.8586587",
  },
  {
    id: 2,
    iataCode: "TLL",
    name: "TestFly Project",
    countryName: "Estonia",
    status: "Draft",
    destination: "TestDestination1",
    startDate: "2023-10-05T15:23:41.4359041",
    endDate: "2023-10-19T14:54:59.7092208",
    fullPeriod: true,
    fromDate: "2023-10-05T14:54:59.709217",
    tillDate: "2023-10-19T14:54:59.7092189",
  },
  {
    id: 3,
    iataCode: "TLL",
    name: "Sky Crew Project",
    countryName: "Estonia",
    status: "Draft",
    destination: "TestDestination2",
    startDate: "2023-10-05T17:31:47.1155076",
    endDate: "2023-08-19T14:54:59.7092208",
    fullPeriod: true,
    fromDate: "2023-10-05T14:54:59.709217",
    tillDate: "2023-10-19T14:54:59.7092189",
  },
  {
    id: 4,
    iataCode: "RIX",
    name: "Flying Project",
    countryName: "Latvia",
    status: "Draft",
    destination: "TestDestination3",
    startDate: "2023-10-06T10:23:04.594694",
    endDate: "2023-08-19T14:54:59.7092208",
    fullPeriod: false,
    fromDate: "2023-10-05T14:54:59.709217",
    tillDate: "2023-10-19T14:54:59.7092189",
  },
  {
    id: 5,
    iataCode: "OCA",
    name: "Flight Crew Project",
    countryName: "United States",
    status: "Draft",
    destination: "TestDestination4",
    startDate: "2023-10-06T10:34:20.3035723",
    endDate: "2023-12-30T13:54:59.7092208",
    fullPeriod: false,
    fromDate: "2023-10-05T14:54:59.709217",
    tillDate: "2023-10-19T14:54:59.7092189",
  },
  {
    id: 6,
    iataCode: "OCA",
    name: "Let's Fly Project",
    countryName: "United States",
    status: "Draft",
    destination: "TestDestination4",
    startDate: "2023-10-06T10:46:11.81015",
    endDate: "2024-03-30T13:54:59.7092208",
    fullPeriod: false,
    fromDate: "2023-10-06T14:54:59.709217",
    tillDate: "2024-10-19T14:54:59.7092189",
  },
  {
    id: 8,
    iataCode: "RIX",
    name: "New for Export",
    countryName: "Latvia",
    status: "Archive",
    destination: "Colombia",
    startDate: "2023-10-09T16:11:28.3198641",
    endDate: "2023-10-21T00:00:00",
    fullPeriod: true,
    fromDate: "2023-10-09T00:00:00",
    tillDate: "2023-10-15T00:00:00",
  },
  {
    id: 9,
    iataCode: "TLL",
    name: "Testing",
    countryName: "Estonia",
    status: "Archive",
    destination: "Spain",
    startDate: "2023-10-09T16:36:20.1934265",
    endDate: "2023-10-31T00:00:00",
    fullPeriod: false,
    fromDate: "2023-10-14T00:00:00",
    tillDate: "2023-10-31T00:00:00",
  },
  {
    id: 10,
    iataCode: "TLL",
    name: "The New Aircraft ",
    countryName: "Estonia",
    status: "Draft",
    destination: "TestDestination6",
    startDate: "2023-10-10T10:57:19.9332308",
    endDate: "2024-07-30T14:54:59.7092208",
    fullPeriod: false,
    fromDate: "2023-10-10T14:54:59.709217",
    tillDate: "2025-10-19T14:54:59.7092189",
  },
  {
    id: 11,
    iataCode: "TLL",
    name: "gg",
    countryName: "Estonia",
    status: "Draft",
    destination: "gg",
    startDate: "2023-10-10T11:14:22.9200422",
    endDate: "2023-10-10T00:00:00",
    fullPeriod: false,
    fromDate: "2023-10-10T00:00:00",
    tillDate: "2023-10-10T00:00:00",
  },
  {
    id: 12,
    iataCode: "TLL",
    name: "Flying Bee ",
    countryName: "Estonia",
    status: "Draft",
    destination: "TestDestination7",
    startDate: "2023-10-10T12:30:47.2101571",
    endDate: "2026-07-30T14:54:59.7092208",
    fullPeriod: false,
    fromDate: "2023-10-10T14:54:59.709217",
    tillDate: "2025-07-30T14:54:59.7092189",
  },
  {
    id: 13,
    iataCode: "TLL",
    name: "Test",
    countryName: "Estonia",
    status: "Archive",
    destination: "",
    startDate: "2023-10-10T14:24:12.5338458",
    endDate: "2023-10-12T00:00:00",
    fullPeriod: false,
    fromDate: "2023-10-10T00:00:00",
    tillDate: "2023-10-25T00:00:00",
  },
  {
    id: 14,
    iataCode: "RIX",
    name: "TestProject19222",
    countryName: "Latvia",
    status: "Draft",
    destination: "TestDestination1",
    startDate: "2023-10-10T16:41:43.90632",
    endDate: "2023-07-04T16:26:52.8586612",
    fullPeriod: false,
    fromDate: "2023-06-20T16:26:52.8586528",
    tillDate: "2023-07-04T16:26:52.8586587",
  },
  {
    id: 15,
    iataCode: "TLL",
    name: "Flying Wing",
    countryName: "Estonia",
    status: "Draft",
    destination: "TestDestination11",
    startDate: "2023-10-12T15:42:04.6591923",
    endDate: "2023-10-12T14:54:59.7092208",
    fullPeriod: true,
    fromDate: "2023-10-12T14:54:59.709217",
    tillDate: "2023-10-12T14:54:59.7092189",
  },
  {
    id: 16,
    iataCode: "TLL",
    name: "TestForMobile",
    countryName: "Estonia",
    status: "Draft",
    destination: "",
    startDate: "2023-10-12T16:11:51.6766504",
    endDate: "2023-10-13T00:00:00",
    fullPeriod: true,
    fromDate: "2023-10-12T00:00:00",
    tillDate: "2023-10-26T00:00:00",
  },
  {
    id: 17,
    iataCode: "TLL",
    name: "TestForMobile2",
    countryName: "Estonia",
    status: "Active",
    destination: "",
    startDate: "2023-10-12T16:20:55.0889729",
    endDate: "2023-10-12T00:00:00",
    fullPeriod: true,
    fromDate: "2023-10-18T00:00:00",
    tillDate: "2023-10-25T00:00:00",
  },
  {
    id: 18,
    iataCode: "OCA",
    name: "TestForMobile3",
    countryName: "United States",
    status: "Active",
    destination: "",
    startDate: "2023-10-12T16:36:12.4972631",
    endDate: "2023-10-19T00:00:00",
    fullPeriod: false,
    fromDate: "2023-10-18T00:00:00",
    tillDate: "2023-10-19T00:00:00",
  },
];

const filteredBases = dummy_bases.filter((item) => item.status === "Active");

const Separator = () => {
  return <View style={styles.separator}></View>;
};

const BasesTab = (props: Props) => {
  // const {
  //   data: List,
  //   isLoading,
  //   error,
  // } = useFetch<FormDataType[]>(`api/Project?projectId=${id}`);
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {/* <SearchBar />
      <FlatList
        data={filteredBases}
        renderItem={({ item }) => <BaseItem base={item} />}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={Separator}
      /> */}
    </View>
  );
};

export default BasesTab;

const styles = StyleSheet.create({
  separator: { backgroundColor: Color.color_blue10, height: 16 },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
