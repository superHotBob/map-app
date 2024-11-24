import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
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

  }, [])

  return (
    <View>
      {coords.length > 0 ? <MapView
        userLocationPriority='high'
        followsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        style={[styles.map, { height: height }]}
        region={{
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
      >
        <Polyline
          coordinates={coords}
          strokeColor="#3d4eea"
          strokeWidth={3}
        />
        {coords.map((i: { type: string; latitude: any; longitude: any; }, index: Key | null | undefined) => i.type === 'photo' ?
          <Marker key={index}
            coordinate={{
              latitude: i.latitude,
              longitude: i.longitude
            }}
            calloutOffset={{ x: -15, y: -15 }}
            icon={require('../assets/images/camera.png')}
          />
          :
          <Circle key={index}
            center={{
              latitude: i.latitude,
              longitude: i.longitude
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
}
const styles = StyleSheet.create({
  map: {
    width: '100%',
    marginBottom: 8
  },
})