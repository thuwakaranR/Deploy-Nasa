import React from 'react';
import { render, screen } from '@testing-library/react';
import DonkiView from './DonkiView';

describe('test Donki Component', () => {
  test('renders elements that are required', () => {
    render(<DonkiView />);
    const headerElement = screen.getByText(/Space Weather Notifications/i);
    const startDatePicker = screen.getByPlaceholderText(/Start Date/i);
    const endDatePicker = screen.getByPlaceholderText(/End Date/i);
    const eventTypeSelect = screen.getByRole('combobox', { name: /Event Type/i });
    expect(headerElement).toBeInTheDocument();
    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();
    expect(eventTypeSelect).toBeInTheDocument();
  });

  test('renders error message state of the error is true', () => {
    const errorMessage = 'Test error message';
    render(<DonkiView />);
    screen.getByText(/Space Weather Notifications/i); 
    screen.getByRole('button', { name: /Search/i });
    screen.getByRole('combobox', { name: /Event Type/i }); 
    screen.getByPlaceholderText(/Start Date/i); 
    screen.getByPlaceholderText(/End Date/i); 
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    render(<DonkiView />);
    screen.getByRole('button', { name: /Search/i }).click(); 
    screen.getByRole('combobox', { name: /Event Type/i }).click();
    screen.getByRole('option', { name: /All/i }).click();
    screen.getByRole('button', { name: /Search/i }).click();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

});
