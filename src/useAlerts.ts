import { useEffect, useState } from 'react';
import axios from 'axios';

interface Alert {
  id: string;
  type: string;
  criteria: any;
}

const API_BASE = process.env.REACT_APP_API_URL;

const useCryptoAlerts = () => {
  const [cryptoAlerts, setCryptoAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleError = (message: string, error: any) => {
    setFetchError(message);
    console.error(error);
  };

  const fetchData = async (fetchFunction: () => Promise<void>) => {
    try {
      setFetchError(null);
      setIsLoading(true);
      await fetchFunction();
    } catch (error) {
      handleError('An unexpected error occurred. Please try again later.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveAlerts = async () => {
    const response = await axios.get(`${API_BASE}/alerts`);
    setCryptoAlerts(response.data);
  };

  const createOrUpdateAlert = async (alertData: Alert) => {
    if (alertData.id) {
      await axios.put(`${API_BASE}/alerts/${alertData.id}`, alertData);
    } else {
      await axios.post(`${API_BASE}/alerts`, alertData);
    }
    await retrieveAlerts();
  };

  const removeAlert = async (alertId: string) => {
    await axios.delete(`${API_BASE}/alerts/${alertId}`);
    await retrieveAlerts();
  };

  useEffect(() => {
    fetchData(retrieveAlerts);
  }, []);

  return {
    alerts: cryptoAlerts,
    loading: isLoading,
    error: fetchError,
    saveAlert: (alertData: Alert) => fetchData(() => createOrUpdateAlert(alertData)),
    deleteAlert: (alertId: string) => fetchData(() => removeAlert(alertId)),
  };
};

export default useCryptoAlerts;