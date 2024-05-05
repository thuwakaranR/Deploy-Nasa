import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Epic from '../epic';

jest.mock('axios');

describe('test Epic component', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renders the component with elements', () => {
    render(<Epic />);
    const datePicker = screen.getByPlaceholderText('Select the Date Here');
    expect(datePicker).toBeInTheDocument();
  });

  test('get the epic data when date is changed', async () => {
    const mockData = [{
      image: 'sample-image',
      caption: 'Sample caption',
      date: '2024-05-01',
    }];

    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<Epic />);
    const datePicker = screen.getByPlaceholderText('Select the Date Here');

    fireEvent.change(datePicker, { target: { value: '2024-04-28' } });
    expect(axios.get).toHaveBeenCalledWith('https://api.nasa.gov/EPIC/archive/2024-05-01?api_key=YOUR_API_KEY');
    await waitFor(() => {
      expect(screen.getByText('Sample caption')).toBeInTheDocument();
    });
  });

  test('displays error message if EPIC data not found', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Epic />);
    
    const datePicker = screen.getByPlaceholderText('Select the Date Here');

    fireEvent.change(datePicker, { target: { value: '2024-04-28' } });
    expect(axios.get).toHaveBeenCalledWith('https://api.nasa.gov/EPIC/archive/2024-05-01?api_key=YOUR_API_KEY');
    await waitFor(() => {
      expect(screen.getByText('No data available for the selected date')).toBeInTheDocument();
    });
  });
});
