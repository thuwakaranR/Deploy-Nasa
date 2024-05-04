import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { TOKEN } from '../util';

const { Header } = Layout;

const DashboardView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [signoutClicked, setSignoutClicked] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['/dashboard']); // Initialize selectedKeys

  // Function to handle sign out
  const handleSignOut = () => {
    // Remove token from local storage
    localStorage.removeItem(TOKEN);
    // Navigate to the home page
    navigate('/');
    // Set signoutClicked to true
    setSignoutClicked(true);
  };

  // Update selectedKeys based on location
  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location]);

  return (
    <Layout>
      {/* Header component */}
      <Header style={{ backgroundColor: '#001529', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div className="logo" style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
          NASASpace
        </div>
        {/* Menu */}
        <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} style={{ border: 'none', backgroundColor: 'transparent', flexGrow: 1 }}>
          {/* Dashboard links */}
          <Menu.Item key="/dashboard"><a href="/dashboard" style={{ color: 'white' }}>APOD API</a></Menu.Item>
          <Menu.Item key="/epic"><a href="/epic" style={{ color: 'white' }}>EPIC API</a></Menu.Item>
          <Menu.Item key="/rover"><a href="/rover" style={{ color: 'white' }}>ROVER API</a></Menu.Item>
          <Menu.Item key="/donki"><a href="/donki" style={{ color: 'white' }}>DONKI API</a></Menu.Item>
        </Menu>
        {/* Sign out button */}
        <div>
          <button onClick={handleSignOut} style={{ color: signoutClicked ? 'red' : 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <LogoutOutlined style={{ marginRight: '5px' }} /> Sign Out
          </button>
        </div>
      </Header>
    </Layout>
  );
}

export default DashboardView;
