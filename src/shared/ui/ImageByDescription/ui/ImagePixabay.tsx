import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import * as Animatable from 'react-native-animatable';

const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
const PEXELS_API_KEYS = [
  'efBk4SYa9CsSblgUAkIiNeZ2ElgYKkSh1EoiUufK4R5ad1Ce1z1Qj73Q',
];

interface ImagePexelsProps {
  description: string;
  width?: number;
  height?: number;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle; // Добавляем свойство style типа ViewStyle
  imageStyle?: ImageStyle; // Добавляем свойство imageStyle типа ImageStyle
}

const ImagePexels: React.FC<ImagePexelsProps> = ({
  description,
  width = 80,
  height = 80,
  size = 'medium',
  style,
  imageStyle,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (!description?.trim()) {
        setLoading(false);
        setImageUrl(null);
        return;
      }

      let success = false;
      let keyIndex = 0;

      while (!success && keyIndex < PEXELS_API_KEYS.length) {
        const apiKey = PEXELS_API_KEYS[keyIndex];

        try {
          const response = await axios.get(PEXELS_API_URL, {
            params: {query: description, per_page: 1},
            headers: {Authorization: apiKey},
          });

          const photos = response.data.photos;
          if (photos.length > 0) {
            let url = '';
            switch (size) {
              case 'small':
                url = photos[0].src.small;
                break;
              case 'large':
                url = photos[0].src.large;
                break;
              case 'medium':
              default:
                url = photos[0].src.medium;
                break;
            }
            setImageUrl(url);
            success = true;
          } else {
            setImageUrl(null);
            success = false;
          }
        } catch (error: any) {
          const axiosError = error as AxiosError;
          console.error(
            `Error fetching image with key ${keyIndex}:`,
            axiosError.response?.data || axiosError.message,
          );
          success = false;
        } finally {
          keyIndex++;
        }
      }

      setLoading(false);
    };

    fetchImage();
  }, [description, size]);

  return (
    <View style={[styles.container, {width, height}, style]}>
      {/* Применяем свойство style к корневому View */}
      {loading ? (
        <ActivityIndicator size="small" color="#505050" />
      ) : imageUrl ? (
        <Animatable.View animation="bounceIn">
          <Image
            source={{uri: imageUrl}}
            style={[{width, height}, imageStyle]} // Применяем свойство imageStyle к изображению
            resizeMode="cover"
          />
        </Animatable.View>
      ) : (
        <View style={[styles.noImage, {width, height}, imageStyle]}>
          {/* Placeholder image or any other UI you want to show when no image is found */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
});

export default ImagePexels;
