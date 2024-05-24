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

  const retrieveAlerts = async () => {
    try {
      setFetchError(null);
      setIsLoading(true);
      const response = await axios.get(`${API_BASE}/alerts`);
      setCryptoAlerts(response.data);
    } catch (error) {
      setFetchError('Failed to fetch alerts. Please try again later.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrUpdateAlert = async (alertData: Alert) => {
    try {
      setFetchError(null);
      setIsLoading(true);
      if (alertData.id) {
        await axios.put(`${API_BASE}/alerts/${alertData.id}`, alertData);
      } else {
        await axios.post(`${API_BASE}/alerts`, alertData);
      }
      await retrieveAlerts();
    } catch (error) {
      setFetchError('Failed to save alert. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAlert = async (alertId: string) => {
    try {
      setFetchError(null);
      setIsLoading(true);
      await axios.delete(`${API_BASE}/alerts/${alertId}`);
      await retrieveAlerts();
    } catch (error) {
      setFetchError('Failed to delete alert. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    retrieveAlerts();
  }, []);

  return { alerts: cryptoAlerts, loading: isLoading, error: fetchError, saveAlert: createOrUpdateAlert, deleteAlert: removeAlert };
};

export default useCryptoAlerts;