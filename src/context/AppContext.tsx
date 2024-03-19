import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
import { CrewType } from "../../app/(tabs)/_layout";
import { useNetInfo } from "@react-native-community/netinfo";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "../../app/others/verificationForm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useApi from "../hooks/useApi";

type UserDataType = {
  token: string;
  code: string;
  crewId: number;
};

type ContextType = {
  isLoggedIn: boolean;
  logout: () => void;
  login: (userData: UserDataType) => void;
  setUser: (userData: UserDataType) => void;
  isLoading: boolean;
  db: SQLite.SQLiteDatabase;
  userState?: UserDataType;
  userDataState: CrewType;
  setUserData: (data: any) => void;
  notifications: any;
};
type Props = {
  children: React.ReactNode;
};

export const AppContext = createContext({} as ContextType);

const AppContextProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userState, setUserState] = useState({} as UserDataType);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [userDataState, setUserDataState] = useState({} as CrewType);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const { apiRequest } = useApi();

  const db = SQLite.openDatabase("local.db");

  console.log(userDataState, userState, "userDate");

  // Maybe later make utilitaize fucntiuon for list getting

  useEffect(() => {
    setIsLoading(true);
    const readToken = async () => {
      const rawUserData = await SecureStore.getItemAsync("userData");
      const userData = rawUserData ? JSON.parse(rawUserData) : null;

      if (userData) {
        setUserState(userData);
        setIsLoggedIn(true);
      } else {
        logout();
      }
      setIsLoading(false);
    };

    readToken();
  }, []);

  // Read notifications

  useEffect(() => {
    // if (isLoggedIn) {
    //   const fetchNotifications = async () => {
    //     // const res = await apiRequest(
    //     //   `api/Notifications/GetByCodeList`,
    //     //   undefined,
    //     //   undefined,
    //     //   {
    //     //     "Content-Type": "application/json",
    //     //     Authorization: "Bearer " + userData?.token,
    //     //     code: userDataState.id,
    //     //   }
    //     // );
    //     try {
    //       const response = await fetch(
    //         "https://apiskyconnecttest.smartlynx.aero/api/Notifications/GetByCodeList",
    //         {
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: "Bearer " + userState?.token,
    //             code: userState?.code,
    //           },
    //         }
    //       );
    //       const data = await response.json();
    //       setNotifications(data[0] && data[0].value ? data[0].value : []);
    //       console.log(data, "response");
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };
    //   fetchNotifications();
    // }
  }, [userDataState.code, isLoggedIn]);

  const setUserData = (data: CrewType) => {
    setUserDataState(data);
  };

  const setUser = async (userData: {
    token: string;
    code: string;
    crewId: number;
  }) => {
    setIsLoading(true);
    setUserState(userData);
    await login(userData);
    setIsLoading(false);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userData");
    setIsLoggedIn(false);
    navigation.navigate("others/login");
  };

  const login = async (userData: {
    token: string;
    code: string;
    crewId: number;
  }) => {
    await SecureStore.setItemAsync("userData", JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  const value = {
    isLoggedIn,
    logout,
    login,
    setUser,
    userState,
    isLoading,
    db,
    setUserData,
    userDataState,
    notifications,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
