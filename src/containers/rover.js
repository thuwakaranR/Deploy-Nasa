import React, { useState } from 'react';
import axios from 'axios';
import { Col, Row, Typography, Select, DatePicker, Button, Spin, Card, Pagination, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import apodImage from '../images/apodimage.jpg'; // Importing the image
import moment from 'moment'; // Importing moment
import { ROVER_API } from '../api/nasa-api';

const { Text, Title } = Typography;
const { Option } = Select;

const RoverView = () => {
  // State variables
  const [roverPhotos, setRoverPhotos] = useState([]); // State to store rover photos
  const [loading, setLoading] = useState(false); // State to track loading status
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [selectedCamera, setSelectedCamera] = useState(null); // State for selected camera
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [searched, setSearched] = useState(false); // State to track if search button is clicked
  const [noResults, setNoResults] = useState(false); // State to track if no results are found
  const pageSize = 20; // Number of photos per page
  const itemsPerRow = 6; // Number of photos per row

  // Function to fetch rover photos from NASA API
  const fetchRoverPhotos = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`${ROVER_API}=${selectedDate}&camera=${selectedCamera}&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`);
      const photos = response.data.photos;
      setRoverPhotos(photos);
      if (photos.length === 0) {
        setNoResults(true); // Set noResults state to true if no photos are found
      } else {
        setNoResults(false); // Reset noResults state
      }
    } catch (error) {
      console.error('Error fetching rover photos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event handler for date change
  const handleDateChange = (date, dateString) => {
    if (date) {
      const today = moment();
      if (date.isAfter(today)) {
        alert("Please select a date before today.");
        return;
      }
      setSelectedDate(dateString);
    } else {
      setSelectedDate(null); // Reset selected date if date is cleared
    }
  };

  // Event handler for camera change
  const handleCameraChange = value => {
    setSelectedCamera(value);
  };

  // Event handler for pagination change
  const onPageChange = (page) => {
    setCurrentPage(page);
    fetchRoverPhotos(page);
  };

  // Event handler for search button click
  const handleSearch = async () => {
    if (selectedDate && selectedCamera) {
      setCurrentPage(1);
      setSearched(true);
      fetchRoverPhotos(1);
    } else {
      alert("Please select both a date and a camera.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${apodImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '24px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ padding: '24px', borderRadius: '8px', maxWidth: '1000px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        {/* Title */}
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: '#000000' }}>Mars Rover Curiosity Photos</Title>

        {/* Date picker, camera selection, and search button */}
        <Row gutter={[16, 16]} justify="center" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <DatePicker
              onChange={handleDateChange}
              style={{ width: '100%' }}
              placeholder="Select Date"
              disabledDate={current => current && current > moment().endOf('day')}
            />
          </Col>
          <Col>
            <Select placeholder="Select Camera" style={{ width: '100%' }} onChange={handleCameraChange}>
              <Option value="FHAZ">Front Hazard Avoidance Camera</Option>
              <Option value="RHAZ">Rear Hazard Avoidance Camera</Option>
              <Option value="MAST">Mast Camera</Option>
              <Option value="CHEMCAM">Chemistry and Camera Complex</Option>
              <Option value="NAVCAM">Navigation Camera</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={handleSearch} disabled={!selectedDate || !selectedCamera} style={{ width: '100%' }}>
              Search
            </Button>
          </Col>
        </Row>

        {/* Display rover photos */}
        {loading ? ( // Show spinner if loading
          <Row justify="center">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          </Row>
        ) : searched && noResults ? ( // Show notification if no results are found
          <Alert
            message="No photos available for the selected date and camera."
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        ) : searched && roverPhotos.length > 0 ? ( // Show photos if available after search
          <>
            {Array.from({ length: Math.ceil(roverPhotos.length / itemsPerRow) }).map((_, index) => (
              <Row key={index} gutter={[16, 16]} justify="center" style={{ width: '100%', margin: '0 auto' }}>
                {roverPhotos.slice(index * itemsPerRow, (index + 1) * itemsPerRow).map(photo => (
                  <Col key={photo.id} xs={24} sm={12} md={8} lg={4}>
                    <Card
                      hoverable
                      cover={<img src={photo.img_src} alt="Rover" style={{ maxHeight: '200px', objectFit: 'cover' }} />}
                      style={{ marginBottom: '16px' }}
                    >
                      <Text strong>Camera: {photo.camera.full_name}</Text>
                      <br />
                      <Text>Date: {photo.earth_date}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            ))}
            {/* Pagination */}
            <Row justify="center">
              <Pagination
                current={currentPage}
                total={roverPhotos.length}
                pageSize={pageSize}
                onChange={onPageChange}
              />
            </Row>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default RoverView;
