import { StyleSheet, View, Dimensions, Alert, Text, TouchableHighlight, StatusBar } from 'react-native';
import { useEffect, useState, useRef, useCallback, Key } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import getDistance from 'geolib/es/getDistance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';

import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from 'react-redux';
import { addpoint, deletepoint, setname } from '@/reduser';
import Enter from '../../components/enter';


import { captureRef } from 'react-native-view-shot';

import RunBlock from '@/components/runblock';
import { ToDBwriteWalk, SecondsToTime, ToDBwriteRun } from '@/hooks/useDB';
const { height, width } = Dimensions.get('window');




const Map = () => {
  const refzoom = useRef();
  const timeRef = useRef<number>(0);
  const router = useRouter();
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const [startStop, setStartStop] = useState(true);

  const [path, setPath] = useState(0);

  const [distance, setDistance] = useState(0);
  const [typeMap, settypeMap] = useState<string>('standard');
  const [zoom, setZoom] = useState(12);

  const [heightBlock, setHeightBlock] = useState(height);
  const [speed, setSpeed] = useState(0);

  const { nodes, name, movie, time } = useSelector((state) => state.track);
  const dispatch = useDispatch();
  console.log('map block');
  

  useEffect(() => {
    if (nodes.length === 1) {
      timeRef.current = Date.now();
      setStartStop(true);
    }
  }, [name]);

  const GetLocations = async (i: { coordinate: { timestamp: number, latitude: number, longitude: number, speed: number } }) => {
    // let { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //   console.log('Permission to access location was denied');
    //   return;
    // };
    console.log('get location', time, (i.coordinate.timestamp - timeRef.current) / 1000);

    if (i.coordinate.timestamp - timeRef.current < (time * 60000 - 10000)) {
      return;
    }

    const new_longitude = (i.coordinate.longitude + (0.01 - Math.random() / 50)).toFixed(7);
    const new_latitude = (i.coordinate.latitude + (0.01 - Math.random() / 50)).toFixed(7)
    if (movie === 'running') {
      const point = {
        longitude: nodes.length === 0 ? i.coordinate.longitude :
          nodes.at(-1).longitude + Math.random() / 50,
        latitude: i.coordinate.latitude,
        type: movie
      };     
      dispatch(addpoint(point))
      setSpeed(i.coordinate.speed + Math.random() * 10);
      GetDistance(point);
    } else {
      const point = {
        longitude: Number(new_longitude),
        latitude: Number(new_latitude),
        type: movie
      };         
      dispatch(addpoint(point))
      GetDistance(point);
    }
  };
  const Save = () => {
    Alert.alert('Сохранить путь',
      name + ', \n' + 'time: ' + SecondsToTime(timeRef.current) + ',' + ' \n' + 'path: ' + path + ' m.',
      [
        {
          text: 'НЕТ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'ДА', onPress: () => SavePath() },
      ]
    );
  };
  const SavePath = async () => {
    try {
      const localUri = await captureRef(refzoom, {
        fileName: name + '_',
        format: 'jpg',
        height: height - 225,
        width: width,
        quality: 1,
      });
      const { id } = await MediaLibrary.createAssetAsync(localUri);
      const album = await AsyncStorage.getItem('album');

      const photo_count = nodes.filter((i: { type: string; }) => i.type === 'photo').length;
      if (!album) {
        const new_album = await MediaLibrary.createAlbumAsync("TRACKER", id);
        await AsyncStorage.setItem('album', new_album.id.toString());
        await MediaLibrary.addAssetsToAlbumAsync([id], new_album.id.toString(), false);
        ToDBwriteWalk({ name, id, timeRef, photo_count, path, movie });
      } else {
        ToDBwriteWalk({ name, id, timeRef, photo_count, path, movie, album });
      }
      if (movie === 'running') {
        ToDBwriteRun({ name, speed, distance, timeRef })
      }
      DeletePath();
    } catch (e) {
      console.log(e);
    }
  };

  const DeletePath = () => {
    dispatch(deletepoint([]));
    setDistance(0);
    setPath(0);
    router.push('/');
  };

  function GetDistance(item) {
    const distance = getDistance(
      { latitude: nodes[0].latitude, longitude: nodes[0].longitude },
      { latitude: item.latitude, longitude: item.longitude },
      { Accuracy: 10 }
    )
    setDistance(distance);
    if( nodes.length === 1 ) {
      setPath(distance)
    } else {
      GetPath();
    }
    
  };
  type loc = { latitude: number, longitude: number }
  function Distance(a: loc, b: loc): number {
    if (b === undefined) return 0;
    const distance = getDistance(
      { latitude: a.latitude, longitude: a.longitude },
      { latitude: b.latitude, longitude: b.longitude },
      { Accuracy: 10 }
    )
    return distance;
  };
  function GetPath() {
    const path = nodes.reduce((acu: number, curr: { latitude: number; longitude: number; }, index: number) =>
      acu + Distance(curr, nodes[index + 1]), 0)
    setPath(path)
  };




  const ZoomUp = async () => {
    let ss = await refzoom.current?.getCamera();
    ss.zoom += 0.7;
    await refzoom.current?.animateCamera(ss);
    setZoom(zoom + 0.7)
  };
  const ZoomDown = async () => {
    let ss = await refzoom.current?.getCamera();
    ss.zoom -= 0.7;
    await refzoom.current?.animateCamera(ss);
    setZoom(zoom - 0.7)
  };
  const setTypeMap = () => {
    settypeMap(typeMap === 'satellite' ? 'standard' : 'satellite')
  };

  if (status === null) {
    requestPermission();
  }
  const int = timeRef.current;
  return (
    <SafeAreaView style={styles.main_block}>
      <StatusBar barStyle='light-content' />
      {nodes.length > 0 ?
        <>
          {movie === 'running' ? null : <View style={styles.distance}>
            <Text style={styles.distance_text}>To back{'\n'}{distance} m</Text>
            <Text style={[styles.distance_text, styles.path]}>Path{'\n'}{path} m</Text>
            <Text style={styles.distance_text}>Time{'\n'} {SecondsToTime(int)} </Text>
          </View>}
          <MapView
            ref={refzoom}

            mapType={typeMap}
            showsUserLocation={startStop}
            userLocationPriority='low'
            followsUserLocation={true}
            onUserLocationChange={(e) => GetLocations(e.nativeEvent)}
            userLocationFastestInterval={time * 60000}
            style={[styles.map, { height: height - 225 }]}
            onPress={() => setHeightBlock(height - 45)}
            region={{
              latitude: nodes[0]?.latitude,
              longitude: nodes[0]?.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Polyline
              coordinates={nodes}
              strokeColor="#3d4eea"
              strokeWidth={3}
            />
            {nodes.map((i: { type: string; latitude: any; longitude: any; }, index: Key | null | undefined) => i.type === 'photo' ?
              <Marker key={index}
                coordinate={{
                  latitude: i.latitude,
                  longitude: i.longitude
                }}
                calloutOffset={{ x: -15, y: -15 }}
                image={require('../../assets/images/camera.png')}
              />
              :
              <Circle key={index}
                center={{
                  latitude: i.latitude,
                  longitude: i.longitude
                }}
                radius={index === 0 ? (50 * 2.5) / zoom : (index === nodes.length - 1) ? (50 * 2.5) / zoom : 0}
                fillColor={index === 0 ? 'red' : (index === nodes.length - 1) ? '#fff' : 'gold'}
                strokeColor='yellow'
                strokeWidth={2}
              />
            )}

          </MapView>
          <View style={styles.btnContainer}>
            <FontAwesome name="search-minus" onPress={ZoomDown} size={40} color="#000" />
            <Ionicons
              onPress={setTypeMap}
              name={typeMap === 'standard' ? "earth-outline" : "earth-sharp"}
              size={50}
              color='#000'
            />
            <FontAwesome name="search-plus" onPress={ZoomUp} size={40} color="#000" />
          </View>

          {movie === 'running' && height !==0 ?
            <RunBlock
              height={heightBlock}
              setheight={setHeightBlock}
              distance={distance}
              time={timeRef.current}
              speed={speed}
            /> : null}
          <View style={[styles.btnContainer, styles.startstop, { gap: 10 }]}>
            {startStop ? (
              <TouchableHighlight
                style={[styles.btnStop, { width: '100%' }]}
                onPress={() => setStartStop(false)}
              >
                <Text style={[styles.btnText, { backgroundColor: 'purple' }]}>
                  Stop write path
                </Text>
              </TouchableHighlight>) : (<>
                <TouchableHighlight
                  style={styles.btnStop}
                  onPress={Save}
                >
                  <Text style={[styles.btnText, { backgroundColor: 'maroon' }]}>
                    Save
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[styles.btnStop, { backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }]}
                  onPress={DeletePath}
                >
                  <Ionicons
                    name="trash"
                    size={30}
                    color='#fff'
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.btnStop}
                  onPress={() => setStartStop(true)}
                >
                  <Text style={[styles.btnText, { backgroundColor: 'green' }]}>
                    Continue
                  </Text>
                </TouchableHighlight>
              </>)
            }
          </View>
        </>
        :
        <Enter typemove={movie} />
      }
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  main_block: {
    backgroundColor: '#fff',
    flex: 1,
  },
  runningBlock: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
    height: height - 25,
    width: '100%'
  },
  distance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distance_text: {
    fontSize: 20,
    width: '33%',
    textAlign: 'center',
    height: 50,
    paddingHorizontal: 5,

  },
  btnZoom: {
    width: '38%',
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 28,
  },
  btnMap: {
    width: '20%',
    height: 50,
    borderRadius: 28,
  },
  button_map_grad: {
    width: '22%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    lineHeight: 50
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'blue',
    lineHeight: 50,
    color: '#fff',
    borderRadius: 28,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 30,
    alignItems: 'center'
  },
  startstop: {
    position: 'absolute',
    bottom: 10
  },
  map: {
    width: '100%',
    marginBottom: 8
  },
  path: {
    backgroundColor: "#ddd"
  },

  inputBlock: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 16,
    marginTop: -50
  },
  buttons: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    marginHorizontal: 'auto'
  },

  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'blue',
    lineHeight: 50,
    color: '#fff',
    borderRadius: 28,
  },
  button_map_text: {
    fontSize: 20,
    textAlign: 'center',

    lineHeight: 50,
    color: '#fff'
  },
  btnStop: {
    height: 50,
    marginTop: 8,
    width: '32%',
    marginHorizontal: 'auto',
    borderRadius: 28,

  },

});
export default Map;