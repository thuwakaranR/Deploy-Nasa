import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../auth/login';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('renders LoginForm component', () => {
  test('renders email and password', () => {
    render(<LoginForm />);
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });

  test('should give error message for invalid data', async () => {
    render(<LoginForm />);
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(email, { target: { value: 'thuwa1234@gmail.com' } });
    fireEvent.change(password, { target: { value: 'thala1998' } });

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
    });
  });

  test('should login with valid data', async () => {
    render(<LoginForm />);
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(email, { target: { value: 'thuwa1234@gmail.com' } });
    fireEvent.change(password, { target: { value: 'thala1998' } });

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledTimes(1); 
      expect(screen.getByText('Welcome to NASA Space')).toBeInTheDocument();
    });
  });
});
