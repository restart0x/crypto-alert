import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import AlertConfigComponent from './AlertConfigComponent';
import { act } from 'react-dom/test-utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const { REACT_APP_BACKEND_URL } = process.env;

describe('AlertConfigComponent Tests', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
  });

  it('renders correctly', async () => {
    render(<AlertConfigComponent />);
    expect(screen.getByTestId('alert-config-form')).toBeInTheDocument();
  });

  it('submits form data correctly and displays success message', async () => {
    const testData = {
      email: 'test@example.com',
      threshold: 100,
    };

    mockedAxios.post.mockResolvedValue({ status: 200, data: { message: 'Success' } });

    render(<AlertConfigComponent />);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: testData.email } });
    fireEvent.change(screen.getByTestId('threshold-input'), { target: { value: testData.threshold.toString() } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(`${REACT_APP_BACKEND_URL}/alerts/config`, testData);
  });

  it('displays error message on submission failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Failed to submit configuration'));

    render(<AlertConfigComponent />);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('threshold-input'), { target: { value: '100' } });
    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('validates user inputs before submitting', async () => {
    render(<AlertConfigComponent />);

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByText(/Please fill in all required fields./)).toBeInTheDocument();
    });
  });

  it('handles environment variables correctly', () => {
    expect(REACT_APP_BACKEND_URL).toBeDefined();
  });
});