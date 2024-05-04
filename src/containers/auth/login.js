import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { TOKEN } from '../../util';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../images/loginimage.jpg'; // Importing the image

const LoginForm = () => {
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State to store error message
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle form submission
  const onFinish = async (values) => {
    setLoading(true); // Set loading to true
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(TOKEN, data.token); // Store token in local storage
        navigate('/dashboard'); // Navigate to dashboard on successful login
      } else {
        setError('Invalid email or password. Please try again.'); // Set error message for invalid credentials
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again later.'); // Set error message for other errors
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Function to handle form submission failure
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${loginImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          zIndex: 1,
          maxWidth: '300px',
          width: '100%',
          padding: '24px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', // Box shadow
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome to NASASpace</h2>
        {error && <p style={{ textAlign: 'center', color: 'red', marginBottom: '12px' }}>{error}</p>}
        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/* Email field */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          {/* Password field */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {/* Login button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
