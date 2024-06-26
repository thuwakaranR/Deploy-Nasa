import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Typography, Spin, Card } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import apodImage from '../images/apodimage.jpg';
import { APOD_API } from '../api/nasa-api';

const { Text, Title } = Typography;

const ApodView = () => {
  // State to store APOD data and loading status
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Function to fetch APOD data from NASA API
    const fetchApodData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(APOD_API);
        setApodData(response.data); // Set fetched data
      } catch (error) {
        console.error('Error fetching APOD data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch APOD data when component mounts
    fetchApodData();
  }, []);

  return (
    <div style={{ 
      padding: '24px', 
      minHeight: '100vh', 
      backgroundImage: `url(${apodImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#f0f2f5',
    }}>
      {/* Title */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'white' }}>Astronomy Picture of the Day</Title>
      
      {/* Content */}
      <Row justify="center">
        {loading ? ( // Show spinner if data is loading
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        ) : apodData ? ( // Show APOD data if available
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card
              title={apodData.title}
            >
              {apodData.media_type === 'image' ? ( // Display image
                <img alt={apodData.title} src={apodData.url} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
              ) : apodData.media_type === 'video' ? ( // Display video
                <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '56.25%' }}>
                  <iframe 
                    title={apodData.title}
                    src={apodData.url} 
                    frameBorder="0" 
                    allow="autoplay; encrypted-media" 
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                  />
                </div>
              ) : ( // Unsupported media type
                <Text>Unsupported media type</Text>
              )}
              <Text>{apodData.explanation}</Text>
            </Card>
          </Col>
        ) : ( // Show message if no data available
          <Col span={24} style={{ textAlign: 'center' }}>
            <Text>No data available</Text>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default ApodView;
