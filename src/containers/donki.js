import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, DatePicker, Select, Button, Typography, Card, Spin, Alert, Image } from 'antd';
import { LoadingOutlined, DownOutlined } from '@ant-design/icons';
import apodImage from '../images/apodimage.jpg';
import { DONKI_API } from '../api/nasa-api';

const { Option } = Select;
const { Text } = Typography;

function DonkiView() {
  // State variables
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(false); // State to track loading status
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [eventType, setEventType] = useState('all'); // State for event type
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [error, setError] = useState(null); // State for error message
  const pageSize = 5; // Number of notifications per page

  // Function to fetch notifications from NASA API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${DONKI_API}?startDate=${startDate}&endDate=${endDate}&type=${eventType}&page=${currentPage}&api_key=${process.env.REACT_APP_API_KEY}`);
      setNotifications(prevNotifications => [...prevNotifications, ...response.data]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event handler for start date change
  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
    if (date && endDate && date.isAfter(endDate)) {
      setError('End date cannot be before start date');
    } else if (date && date.isAfter()) {
      setError('Start date cannot be in the future');
    } else {
      setError(null);
    }
  };

  // Event handler for end date change
  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
    if (date && startDate && date.isBefore(startDate)) {
      setError('End date cannot be before start date');
    } else if (date && date.isAfter()) {
      setError('End date cannot be in the future');
    } else {
      setError(null);
    }
  };

  // Event handler for event type change
  const handleEventTypeChange = value => {
    setEventType(value);
    setCurrentPage(1); // Reset page when event type changes
    setNotifications([]); // Clear notifications
  };

  // Event handler for search button click
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    } else if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be before start date');
      return;
    }

    setCurrentPage(1); // Reset page
    setNotifications([]); // Clear notifications
    await fetchNotifications();
  };

  // Event handler for load more button click
  const handleLoadMore = async () => {
    setCurrentPage(prevPage => prevPage + 1); // Increment current page
    await fetchNotifications();
  };

  return (
    <div
      style={{
        backgroundImage: `url(${apodImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '24px',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <h1 style={{ textAlign: 'center', marginBottom: '24px', color: '#fff' }}>Space Weather Notifications</h1>
        </Col>
      </Row>
      
      {/* Date range, event type, and search button */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <DatePicker onChange={handleStartDateChange} placeholder="Start Date" style={{ width: '100%' }} disabledDate={current => current && current > moment().endOf('day')} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <DatePicker onChange={handleEndDateChange} placeholder="End Date" style={{ width: '100%' }} disabledDate={current => current && current > moment().endOf('day')} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select defaultValue="all" style={{ width: '100%' }} onChange={handleEventTypeChange}>
            <Option value="all">All</Option>
            <Option value="FLR">Solar Flare</Option>
            <Option value="SEP">Solar Energetic Particle</Option>
            <Option value="CME">Coronal Mass Ejection</Option>
            <Option value="IPS">Interplanetary Shock</Option>
            <Option value="MPC">Magnetopause Crossing</Option>
            <Option value="GST">Geomagnetic Storm</Option>
            <Option value="RBE">Radiation Belt Enhancement</Option>
            <Option value="report">Report</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Button type="primary" onClick={handleSearch} style={{ width: '100%' }}>
            Search
          </Button>
        </Col>
      </Row>

      {/* Error notification */}
      {error && (
        <Row justify="center" style={{ marginTop: '24px' }}>
          <Col span={12}>
            <Alert message={error} type="error" showIcon />
          </Col>
        </Row>
      )}
      
      {/* Display notifications */}
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: '24px' }}>
        {loading ? ( // Show spinner if loading
          <div style={{ textAlign: 'center', width: '100%' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />} />
          </div>
        ) : notifications.length > 0 ? ( // Show notifications if available
          <Col span={24}>
            {/* Display notifications up to current page * page size */}
            {notifications.slice(0, currentPage * pageSize).map(notification => (
              <Card key={notification.messageID} title={notification.messageType} style={{ marginBottom: '16px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <Text>{notification.messageBody}</Text>
              </Card>
            ))}
            {/* Show load more button if there are more notifications */}
            {notifications.length > currentPage * pageSize && (
              <Row gutter={[16, 16]} justify="center" style={{ marginTop: '24px' }}>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={handleLoadMore}>
                    Load More <DownOutlined />
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        ) : (
          <Col span={24} style={{ textAlign: 'center', marginTop: '24px' }}>
            <div style={{ color: '#fff' }}>
              <Image src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" alt="empty" style={{ height: 60, marginBottom: 16 }} />
              <Text>No notifications found</Text>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default DonkiView;
