import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View,  Dimensions } from "react-native";
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
const { height } = Dimensions.get('screen');

export default function PathMap() {
  const { name } = useLocalSearchParams();
  const [coords, setCoords] = useState([]);
  useEffect(() => {
    async function ReadPath() {
      const responce = await fetch(`https://superbob.pythonanywhere.com/path?name=${name}`);
      const path = await responce.json();     
      setCoords(path);          
    }
    ReadPath();
  }, []);

  const toObject = (a: any) => {
    const s = a.map(i => Object.assign({},{latitude: i[1],longitude: i[0] }))
   
    return s
  }
  return (
    <View>
      {coords.length > 0 ? <MapView       
        provider={PROVIDER_GOOGLE}
        style={{width: '100%',height: height}}
        region={{
          latitude: coords[0][1],
          longitude: coords[0][0],
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
      >
        <Polyline
          coordinates={toObject(coords)}
          strokeColor="#3d4eea"
          strokeWidth={3}
        />
        {coords.map((i, index) => i[2] === 'photo' ?
          <Marker key={index}
            coordinate={{
              latitude: i[1],
              longitude: i[0]
            }}
            calloutOffset={{ x: -15, y: -15 }}
            icon={require('../assets/images/camera.png')}
          />
          :
          <Circle key={index}
            center={{
              latitude: i[1],
              longitude: i[0]
            }}
            radius={index === 0 ? 4 : (index === coords.length - 1) ? 4 : 0}
            fillColor={index === 0 ? 'red' : (index === coords.length - 1) ? '#fff' : 'gold'}
            strokeColor='yellow'
            strokeWidth={3}
          />
        )}
      </MapView> : null}
    </View>
  )
};