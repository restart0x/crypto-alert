import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import AlertConfigComponent from './AlertConfigComponent';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const { REACT_APP_BACKEND_URL } = process.env;

const backendUrl = REACT_APP_BACKEND_URL || 'http://localhost:5000';

describe('AlertConfigComponent Tests', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
  });

  it('renders correctly', async () => {
    render(<AlertConfigComponent />);
    expect(screen.getByTestId('alert-config-form')).toBeInTheDocument();
  });

  it('submits dynamic form data correctly and displays success message', async () => {
    const testData = {
      email: 'test@example.com',
      alerts: [
        { currency: "BTCUSD", direction: "above", threshold: 100 },
        { currency: "ETHUSD", direction: "below", threshold: 200 }
      ],
    };

    mockedAxios.post.mockResolvedValue({ status: 200, data: { message: 'Success' } });

    render(<AlertConfigComponent />);

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(`${backendUrl}/alerts/config`, testData);
  });

  it('displays detailed error message on submission failure', async () => {
    const errorMessage = 'Failed to submit configuration due to server error';
    mockedAxios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

    render(<AlertConfigComponent />);

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });

});