import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Svg, {Rect} from 'react-native-svg';
import {sleep} from 'shared/lib/utils/sleep';
import {useNavigation} from '@react-navigation/core';

const ScanBarCode = props => {
  const {initialCameraVisible = false, onClose} = props;

  const [cameraVisible, setCameraVisible] = useState(initialCameraVisible);
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back');
  const navigation = useNavigation();

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to scan barcodes',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          console.log('Camera permission denied');
        }
      } else {
        setHasPermission(true);
      }
    };

    requestCameraPermission();
  }, []);

  const handleCodeScanned = useCallback(
    codes => {
      if (codes.length > 0) {
        const {value} = codes[0];
        setCameraVisible(false);
        // @ts-ignore
        navigation.navigate('ProductByBarCodeScreen', {barcode: value});
      }
    },
    [navigation],
  );

  const codeScanner = useCodeScanner({
    codeTypes: [
      'code-128',
      'code-39',
      'code-93',
      'codabar',
      'ean-13',
      'ean-8',
      'itf',
      'upc-e',
      'upc-a',
      'qr',
      'pdf-417',
    ],
    onCodeScanned: (codes, frame) => {
      handleCodeScanned(codes);
    },
  });

  const handleClose = async () => {
    setCameraVisible(false);
    await sleep(300);
    onClose && onClose();
  };

  const onLayout = evt => {
    const {width, height} = evt.nativeEvent.layout;
    // setLayout({width, height});
  };

  const renderOverlay = () => {
    return (
      <Svg height="100%" width="100%">
        <Rect x="0" y="0" width="100%" height="40%" fill="rgba(0, 0, 0, 0.5)" />
        <Rect
          x="0"
          y="60%"
          width="100%"
          height="40%"
          fill="rgba(0, 0, 0, 0.5)"
        />
        <Rect
          x="0"
          y="40%"
          width="10%"
          height="20%"
          fill="rgba(0, 0, 0, 0.5)"
        />
        <Rect
          x="90%"
          y="40%"
          width="15%"
          height="20%"
          fill="rgba(0, 0, 0, 0.5)"
        />
        <Rect
          x="10%"
          y="40%"
          width="80%"
          height="20%"
          stroke="white"
          strokeWidth="2"
          fill="transparent"
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setCameraVisible(true)}
        style={styles.iconButton}>
        <Image
          source={require('./fluent_scan.png')}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
      <Modal visible={cameraVisible} animationType="slide">
        <View style={{flex: 1}}>
          {device && hasPermission && (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              onLayout={onLayout}
              codeScanner={codeScanner}
            />
          )}
          {renderOverlay()}
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButtonWrap}>
            <Text style={styles.close}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
  },
  closeButtonWrap: {
    zIndex: 3,
    position: 'absolute',
    bottom: '33%',
    width: '100%',
  },
  close: {color: 'white', textAlign: 'center', fontSize: 18},
  iconButton: {alignItems: 'center'},
});

export default ScanBarCode;
