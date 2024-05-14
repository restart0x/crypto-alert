import React, { useState } from 'react';

type AlertType = 'Price Change' | 'Volume' | 'Market Cap';
type NotificationMethod = 'Email' | 'SMS';

interface AlertConfig {
  type: AlertType;
  threshold: number;
  notificationMethod: NotificationMethod;
}

const AlertConfigComponent: React.FC = () => {
  const [alertType, setAlertType] = useState<AlertType>('Price Change');
  const [threshold, setThreshold] = useState<number>(0);
  const [notificationMethod, setNotificationMethod] = useState<NotificationMethod>('Email');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Configuring Alert: Type: ${alertType}, Threshold: ${threshold}, Notification Method: ${notificationMethod}`);
  };

  const handleAlertTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAlertType(event.target.value as AlertType);
  };

  const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThreshold(Number(event.target.value));
  };

  const handleNotificationMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNotificationMethod(event.target.value as NotificationMethod);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="alertType">Alert Type:</label>
        <select id="alertType" value={alertType} onChange={handleAlertTypeChange}>
          <option value="Price Change">Price Change</option>
          <option value="Volume">Volume</option>
          <option value="Market Cap">Market Cap</option>
        </select>
      </div>

      <div>
        <label htmlFor="threshold">Threshold:</label>
        <input type="number" id="threshold" value={threshold} onChange={handleThresholdChange} />
      </div>

      <div>
        <label htmlFor="notificationMethod">Notification Method:</label>
        <select id="notificationMethod" value={notificationMethod} onChange={handleNotificationMethodChange}>
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
        </select>
      </div>

      <button type="submit">Configure Alert</button>
    </form>
  );
};

export default AlertConfigComponent;