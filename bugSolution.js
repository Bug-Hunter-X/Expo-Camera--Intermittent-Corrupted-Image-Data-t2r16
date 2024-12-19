```javascript
import * as React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Alert } from 'react-native';

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const data = await cameraRef.current.takePictureAsync();
        // Validate image data before setting state
        if(data && data.uri){
          setImage(data.uri);
          setError(null);
        } else {
          setError('Image data is corrupted or invalid');
        }
      }
    } catch (error) {
      setError('Failed to take picture:' + error.message);
    }
  };

  if (hasPermission === null) {
    return <View />;  // Or Loading indicator
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>{error || ''}</Text>              
              <Text style={{ color: '#fff', fontSize: 18 }} onPress={takePicture}>Take Picture</Text>
              {image && <Image style={{width:300,height:300}} source={{ uri: image }} />}
            </View>
          </View>
        </View>
      </Camera>
    </View>
  );
};
export default App;
```