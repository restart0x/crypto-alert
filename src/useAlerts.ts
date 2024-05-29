import { useEffect, useState } from 'react';
import axios from 'axios';

interface CryptoAlert {
  id: string;
  type: string;
  criteria: any;
}

const API_ENDPOINT = process.env.REACT_APP_API_URL;

const useCryptoAlerts = () => {
  const [alertsList, setAlertsList] = useState<CryptoAlert[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [fetchingError, setFetchingError] = useState<string | null>(null);

  const logError = (message: string, error: any) => {
    setFetchingError(message);
    console.error(error);
  };

  const performDataFetch = async (actionFunction: () => Promise<void>) => {
    try {
      setFetchingError(null);
      setIsFetching(true);
      await actionFunction();
    } catch (error) {
      logError('An unexpected error occurred. Please try again later.', error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchAlerts = async () => {
    const response = await axios.get(`${API_ENDPOINT}/alerts`);
    setAlertsList(response.data);
  };

  const upsertAlert = async (alertDetails: CryptoAlert) => {
    if (alertDetails.id) {
      await axios.put(`${API_ENDPOINT}/alerts/${alertDetails.id}`, alertDetails);
    } else {
      await axios.post(`${API_ENDPOINT}/alerts`, alertDetails);
    }
    await fetchAlerts();
  };

  const deleteAlert = async (alertId: string) => {
    await axios.delete(`${API_ENDPOINT}/alerts/${alertId}`);
    await fetchAlerts();
  };

  useEffect(() => {
    performDataFetch(fetchAlerts);
  }, []);

  return {
    alertsList,
    isFetching,
    fetchingError,
    updateAlert: (alertDetails: CryptoAlert) => performDataFetch(() => upsertAlert(alertDetails)),
    removeAlert: (alertId: string) => performDataFetch(() => deleteAlert(alertId)),
  };
};

export default useCryptoAlerts;