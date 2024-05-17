import React, { useState } from 'react';

type AlertType = 'Price Change' | 'Volume' | 'Market Cap';
type NotificationMethod = 'Email' | 'SMS';

interface AlertConfig {
  type: AlertType;
  threshold: number;
  notificationMethod: NotificationMethod;
}

const ALERT_TYPES: AlertType[] = ['Price Change', 'Volume', 'Market Cap'];
const NOTIFICATION_METHODS: NotificationMethod[] = ['Email', 'SMS'];

const SelectField: React.FC<{
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ id, label, value, options, onChange }) => (
  <div>
    <label htmlFor={id}>{label}:</label>
    <select id={id} value={value} onChange={onChange}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const AlertConfigComponent: React.FC = () => {
  const [alertType, setAlertType] = useState<AlertType>('Price Change');
  const [threshold, setThreshold] = useState<number>(0);
  const [notificationMethod, setNotificationMethod] = useState<NotificationMethod>('Email');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Configuring Alert: Type: ${alertType}, Threshold: ${threshold}, Notification Method: ${notificationMethod}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <SelectField
        id="alertType"
        label="Alert Type"
        value={alertType}
        options={ALERT_TYPES}
        onChange={(event) => setAlertType(event.target.value as AlertType)}
      />

      <div>
        <label htmlFor="threshold">Threshold:</label>
        <input type="number" id="threshold" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} />
      </div>

      <SelectField
        id="notificationMethod"
        label="Notification Method"
        value={notificationMethod}
        options={NOTIFICATION_METHODS}
        onChange={(event) => setNotificationMethod(event.target.value as NotificationMethod)}
      />

      <button type="submit">Configure Alert</button>
    </form>
  );
};

export default AlertConfigComponent;