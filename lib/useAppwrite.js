import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fn();
      setData(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [fn]);

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch };
};

export default useAppwrite;
