import React, { useState } from 'react';
import axios from 'axios';
import { Col, Row, Typography, Spin, Card, DatePicker, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import apodImage from '../images/apodimage.jpg'; // Importing the image
import moment from 'moment';
import { isEmpty } from 'lodash';
import { EPIC_API } from '../api/nasa-api';

const { Text, Title } = Typography;

const EpicView = () => {
  // State variables
  const [epicData, setEpicData] = useState(null); // State to store EPIC data
  const [loading, setLoading] = useState(false); // State to track loading status
  const [selectedDate, setSelectedDate] = useState(null); // State to store selected date
  const [dataNotFound, setDataNotFound] = useState(false); // State to track if data not found

  // Function to fetch EPIC data from NASA API
  const getEpicData = async (date) => {
    try {
      setLoading(true); // Set loading to true
      const response = await axios.get(`${EPIC_API}${date}?api_key=${process.env.REACT_APP_API_KEY}`);
      const data = response.data;
      if (isEmpty(data)) {
        setDataNotFound(true); // Set data not found
        setEpicData(null); // Reset EPIC data
      } else {
        setDataNotFound(false); // Reset data not found
        setEpicData(data); // Set EPIC data
      }
    } catch (error) {
      console.error('Error fetching EPIC data:', error);
      setDataNotFound(true); // Set data not found on error
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Event handler for date change
  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString); // Set selected date
    if (dateString) {
      getEpicData(dateString); // Fetch EPIC data
    }
  };

  // Render the EPIC item
  const renderItem = () => {
    return (
      <Row justify="center" style={{ marginBottom: '24px' }}>
        <Col span={20}>
          <Card>
            <img
              src={`https://api.nasa.gov/EPIC/archive/natural/${selectedDate.replace(/-/g, '/')}/png/${epicData[0].image}.png?api_key=sUHIkfkLlgJYt2rmWcKM94HgWkumn9z4aW1e2iRs`}
              alt="EPIC"
              style={{ width: '100%', maxHeight: 'calc(100vh - 200px)' }}
            />
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <Title level={3} style={{ marginBottom: '12px' }}>{epicData[0].caption}</Title>
              <Text>{selectedDate} {epicData[0].date.split(' ')[1]}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url(${apodImage})`, // Set background image
      backgroundSize: 'cover', // Cover the entire area
      backgroundPosition: 'center', // Center the image
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Add a semi-transparent white background
        padding: '24px',
        borderRadius: '8px',
        maxWidth: '600px', // Limit the width of the content
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Earth Polychromatic Imaging Camera</Title>
        {selectedDate ? null : <Text>Please select a date to view EPIC data</Text>} {/* Instruction */}
        <DatePicker
          onChange={handleDateChange}
          style={{ marginBottom: '24px', width: '100%' }} // Adjust style
          disabled={loading} // Disable date picker while loading
          picker="date" // Show only date picker
          placeholder="Select the Date Here" // Set placeholder
          disabledDate={current => current && current > moment().endOf('day')}
        />
        {loading ? ( // Show spinner if data is loading
          <div style={{ textAlign: 'center' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        ) : (dataNotFound && selectedDate !== null) ? ( // Show "No data available" if data not found and date selected
          <Alert message="No data available for the selected date" type="warning" />
        ) : (!isEmpty(epicData) && selectedDate !== null) ? ( // Show EPIC data if available
          renderItem()
        ) : null}
      </div>
    </div>
  );
}

export default EpicView;
