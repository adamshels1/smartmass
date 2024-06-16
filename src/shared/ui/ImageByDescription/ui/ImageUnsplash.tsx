import React, {useState, useEffect} from 'react';
import {Text, Image, ActivityIndicator} from 'react-native';
import axios from 'axios';

interface ImageUnsplashProps {
  description: string;
  size?: 'raw' | 'full' | 'regular' | 'small' | 'thumb';
  width?: number;
  height?: number;
  style?: any;
}

export const ImageUnsplash: React.FC<ImageUnsplashProps> = ({
  description,
  size = 'thumb',
  width = 100,
  height = 100,
  style,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const clientIds = [
    'TCgDA3amrcnpELcpitun0rDjvKnNTOhKhpsCukwzfz4',
    'Rxc7i0Zjm3XXCb1_BhGeeqBPJScO-Z95TKnuyiKJ4Vo',
    '_fFclllXq0-fgYttoAARTLY9-D-uzWkC2cL9EeNciEI',
    // Add more client IDs as needed
  ];

  useEffect(() => {
    const fetchImage = async (clientIds: string[]) => {
      for (const clientId of clientIds) {
        try {
          const response = await axios.get(
            `https://api.unsplash.com/search/photos?query=${description}&per_page=1&client_id=${clientId}`,
          );
          console.log('Rate Limit:', response.headers['x-ratelimit-limit']);
          console.log(
            'Rate Limit Remaining:',
            response.headers['x-ratelimit-remaining'],
          );
          if (response.data.results.length > 0) {
            setImageUrl(response.data.results[0].urls[size]);
            return;
          }
        } catch (error: any) {
          if (error.response && error.response.status === 403) {
            console.error(
              `Client ID ${clientId} is not authorized or rate limit exceeded.`,
            );
          } else {
            console.error('Error fetching the image:', error);
            break;
          }
        }
      }
      setImageUrl(null);
    };

    fetchImage(clientIds).finally(() => setLoading(false));
  }, [description, size]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!imageUrl) {
    return <Text>No image found for "{description}"</Text>;
  }

  return (
    <Image
      source={{uri: imageUrl}}
      style={{width, height, ...style}}
      resizeMode="cover"
    />
  );
};

export default ImageUnsplash;
