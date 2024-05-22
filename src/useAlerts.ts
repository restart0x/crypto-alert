import { useEffect, useState } from 'react';
import axios from 'axios';

interface AlertConfig {
  id: string;
  type: string;
  criteria: any;
}

const API_BASE_URL = process.env.REACT_APP_API_URL;

const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/alerts`);
      setAlerts(response.data);
    } catch (err) {
      setError('Failed to fetch alerts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAlert = async (alertConfig: AlertConfig) => {
    try {
      setError(null);
      setLoading(true);
      if (alertConfig.id) {
        await axios.put(`${API_BASE_URL}/alerts/${alertConfig.id}`, alertConfig);
      } else {
        await axios.post(`${API_BASE_URL}/alerts`, alertConfig);
      }
      await fetchAlerts();
    } catch (err) {
      setError('Failed to save alert. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      setError(null);
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/alerts/${alertId}`);
      await fetchAlerts();
    } catch (err) {
      setError('Failed to delete alert. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return { alerts, loading, error, saveAlert, deleteAlert };
};

export default useAlerts;