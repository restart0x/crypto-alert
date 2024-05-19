import React, { useState } from "react";

type AlertType = "Price Change" | "Volume" | "Market Cap";
type NotificationMethod = "Email" | "SMS";

interface AlertConfig {
  type: AlertType;
  threshold: number;
  notificationMethod: NotificationMethod;
}

const ALERT_TYPES: AlertType[] = ["Price Change", "Volume", "Market Cap"];
const NOTIFICATION_METHODS: NotificationMethod[] = ["Email", "SMS"];

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
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const AlertConfigComponent: React.FC = () => {
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([]);
  const [newAlertConfig, setNewAlertConfig] = useState<AlertConfig>({
    type: "Price Change",
    threshold: 0,
    notificationMethod: "Email",
  });
  const [error, setError] = useState<string>("");

  const validateConfig = (config: AlertConfig): boolean => {
    if (config.threshold <= 0) {
      setError("Threshold must be greater than zero.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddConfig = () => {
    if (!validateConfig(newAlertConfig)) {
      console.error("Validation failed.");
      return;
    }
    // Add the new configuration to the list
    setAlertConfigs([...alertConfigs, newAlertConfig]);
    // Reset the form to default values
    setNewAlertConfig({ type: "Price Change", threshold: 0, notificationMethod: "Email" });
  };

  const renderAlertConfigs = () => (
    <ul>
      {alertConfigs.map((config, index) => (
        <li key={index}>
          Type: {config.type}, Threshold: {config.threshold}, Notification Method: {config.notificationMethod}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <SelectField
        id="alertType"
        label="Alert Type"
        value={newAlertConfig.type}
        options={ALERT_TYPES}
        onChange={(event) =>
          setNewAlertConfig({ ...newAlertConfig, type: event.target.value as AlertType })
        }
      />

      <div>
        <label htmlFor="threshold">Threshold:</label>
        <input
          type="number"
          id="threshold"
          value={newAlertConfig.threshold}
          onChange={(event) =>
            setNewAlertConfig({ ...newAlertConfig, threshold: Number(event.target.value) })
          }
        />
      </div>

      <SelectField
        id="notificationMethod"
        label="Notification Method"
        value={newAlertConfig.notificationMethod}
        options={NOTIFICATION_METHODS}
        onChange={(event) =>
          setNewAlertConfig({
            ...newAlertConfig,
            notificationMethod: event.target.value as NotificationMethod,
          })
        }
      />

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button type="button" onClick={handleAddConfig}>
        Add Alert Configuration
      </button>

      {alertConfigs.length > 0 && (
        <>
          <h2>Configured Alerts</h2>
          {renderAlertConfigs()}
        </>
      )}
    </>
  );
};

export default AlertConfigComponent;