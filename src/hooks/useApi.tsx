import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useContext(AppContext);
  const REACT_APP_API_URL = Constants?.expoConfig?.extra?.REACT_APP_API_URL;
  // const navigate = useNavigate();

  const apiRequest = async (
    url: string,
    requestMethod = "GET",
    bodyData?: {},
    headerOptions?: {}
  ) => {
    setIsLoading(true);

    const rawUserData = await SecureStore.getItemAsync("userData");
    const userData = rawUserData ? JSON.parse(rawUserData) : null;

    const requestOptions = {
      method: requestMethod,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userData?.token,
        ...headerOptions,
      },
      body: bodyData ? JSON.stringify(bodyData) : null,
    };

    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/${url}`,
        requestOptions
      );

      if (response.status === 401) {
        logout();
      }

      // Check after testing delete or refactor
      // if (!response.ok) {
      //   throw new Error(
      //     `Server responded with ${response.status}: ${response.statusText}`
      //   );
      // }

      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return { apiRequest, isLoading };
};

export default useApi;

// const useApi = () => {
//   const { logout } = useContext(AppContext);
//   //   const navigate = useNavigate();

//   const apiRequest = async (
//     url: string,
//     requestMethod = "GET",
//     bodyData?: {},
//     headerOptions?: {}
//   ) => {
//     const requestOptions = {
//       method: requestMethod,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorage.getItem("SKYtoken"),
//         ...headerOptions,
//       },
//       body: bodyData ? JSON.stringify(bodyData) : null,
//     };

//     const response = await fetch(
//       `${process.env.REACT_APP_API_URL}/${url}`,
//       requestOptions
//     );

//     if (response.status === 401) {
//       //   navigate("/");
//       logout();
//     }

//     if (!response.ok) {
//       throw new Error(
//         `Server responded with ${response.status}: ${response.statusText}`
//       );
//     }

//     return response;
//   };

//   return apiRequest;
// };

// export default useApi;
