import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import useApi from "./useApi";
import NetInfo from "@react-native-community/netinfo";

interface FetchResponse<T> {
  data: T;
  isLoading: boolean;
  error: unknown;
  refetch?: () => Promise<void>;
  header?: unknown;
}

const useFetch = <T,>(
  url: string,
  requestMethod?: string,
  bodyData?: {},
  headerContent?: {},
  shouldFetch: boolean = true
): FetchResponse<T> => {
  const [data, setData] = useState<T>(null as T);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [header, setHeader] = useState<unknown>();
  const context = useContext(AppContext);
  const { logout } = context;

  const { apiRequest } = useApi();

  const fetchData = async () => {
    const isConnected = await NetInfo.fetch().then(
      (state) => state.isConnected
    );

    if (isConnected) {
      console.log("Is not connected");
    }
    if (!shouldFetch || !url) {
      return null;
    }
    setIsLoading(true);
    try {
      const res = await apiRequest(url, requestMethod, bodyData, headerContent);
      if (res.status === 401) {
        logout();
      }
      if (!res.ok) {
        // logout();

        throw new Error(`Server responded with ${res.status}`);
      }

      const json = res.status === 204 ? [] : await res.json();

      headerContent && setHeader(res.headers);
      setData(json);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shouldFetch]);

  const refetch = async () => {
    fetchData();
  };

  return { data, error, refetch, isLoading, header };
};

export default useFetch;
