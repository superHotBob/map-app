import { StyleSheet, View, Dimensions, Alert, Text, TouchableHighlight, StatusBar } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
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
import * as SQLite from 'expo-sqlite';
import RunBlock from '@/components/runblock';

const { height, width } = Dimensions.get('window');



function SecundsToTime(i) {  
  const hours = (i/3600).toFixed(0);       
  const mins = Math.trunc((i - hours*3600)/60);
  const sec = i - hours*3600 - mins*60;       
  return ( hours + ' : ' + mins + ' : ' + sec.toFixed(0)); 
}
const Map = () => {
  const refzoom = useRef();
  const timeRef = useRef<number>(null);
  const router = useRouter();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [pathData, setPathDate] = useState(0);
  const [startStop, setStartStop] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [path, setPath] = useState(0);
  const [distance, setDistance] = useState(0);
  const [typeMap, settypeMap] = useState<string>('standard');
  const [zoom, setZoom] = useState(12);
  
  const [heightBlock, setHeightBlock] = useState(height - 45);
  const [speed, setSpeed ] = useState(0);

  const { nodes, name, movie, time } = useSelector((state) => state.track);
  const dispatch = useDispatch();
 
  useFocusEffect(useCallback(()=>{StatusBar.setBarStyle('dark-content');},[]))

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    setStartStop(true);
    timeRef.current = Date.now();
  },[name]);
 
  const GetLocations = async (i:{coordinate: {speed: number}}) => {
    // let { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //   console.log('Permission to access location was denied');
    //   return;
    // };
    setCurrentTime(i.coordinate.timestamp);
    console.log(nodes, time,movie, i.coordinate)
    
    if (movie === 'running') {      
      const point = {
        longitude: nodes.length === 0 ? i.coordinate.longitude  : 
        nodes[nodes.length - 1].longitude + Math.random()/50,
        latitude:   i.coordinate.latitude, 
        type: movie
      };
      dispatch(addpoint(point));
      if( nodes.length > 1) {
        setSpeed(i.coordinate.speed + Math.random()*10);
        GetDistance();
      }
    } else {
      const point = {
        longitude: nodes.length === 0 ? i.coordinate.longitude : i.coordinate.longitude + (0.01 - Math.random() / 50),
        latitude: nodes.length === 0 ? i.coordinate.latitude : i.coordinate.latitude + (0.01 + Math.random() / 50),
        type: movie
      };
      dispatch(addpoint(point));
      if( nodes.length > 0) {
        GetDistance();
      }
    }
  };
  const Save = () => {
    Alert.alert('Сохранить путь',
      name + ', \n' + 'time: ' + SecundsToTime((Date.now() - timeRef.current)/1000) + ',' +' \n' + 'path: ' + path + ' m.',
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
      const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
      });
      const photo_count = nodes.filter(i => i.type === 'photo').length;
      if (!album) {
        const new_album = await MediaLibrary.createAlbumAsync("TRACKER", id);
        await AsyncStorage.setItem('album', new_album.id.toString());
        await MediaLibrary.addAssetsToAlbumAsync([id], new_album.id.toString(), false);
        await db.runAsync(`INSERT INTO paths (name, idpath, begintime, endtime, images, path, type) VALUES (?,?,?,?,?,?,?)`, [name, id, timeRef.current, Date.now(), photo_count, path, movie]);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([id], album, false);
        await db.runAsync(`INSERT INTO paths (name, idpath, begintime, endtime, images, path, type) VALUES (?,?,?,?,?,?,?)`, [name, id, timeRef.current , Date.now(), photo_count, path, movie]);
      }
      dispatch(deletepoint([]));
      dispatch(setname(''));
      setDistance(0);
      setPath(0);
      router.push('/');
    } catch (e) {
      console.log(e);
    }
  };

  const DeletePath = () => {
    dispatch(deletepoint([]));
    dispatch(setname(''));
    setDistance(0);
    setPath(0);
    router.push('/');
  };

  function GetDistance() {
    const distance = getDistance(
      { latitude: nodes[0].latitude, longitude: nodes[0].longitude },
      { latitude: nodes.slice(-1)[0].latitude, longitude: nodes.slice(-1)[0].longitude },
      { Accuracy: 10 }
    )
    setDistance(distance);
    GetPath();
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
    const path = nodes.reduce((acu, curr, index) =>
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
  return (
    <SafeAreaView style={styles.main_block}>      
        {name.length > 0 ?
          <>
            {movie === 'running' ? null: <View style={styles.distance}>
              <Text style={styles.distance_text}>To back{'\n'}{distance} m</Text>
              <Text style={[styles.distance_text, styles.path]}>Path{'\n'}{path} m</Text>
              <Text style={styles.distance_text}>Time{'\n'} {SecundsToTime((Date.now() - timeRef.current)/1000)} </Text>
            </View>}
            <MapView
              ref={refzoom}
              zoomEnabled={false}
              mapType={typeMap}
              showsUserLocation={startStop}
             
              onUserLocationChange={(e) => GetLocations(e.nativeEvent)}
            
              userLocationFastestInterval={time*60000}
              style={[styles.map, { height: height - 248 }]}
              onPress={()=>setHeightBlock(height - 45)}
              region={{
                latitude: 53.957598, 
                longitude: 27.625336,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <Polyline
                coordinates={nodes}
                strokeColor="#3d4eea"
                strokeWidth={3}
                
              />
              {nodes.map((i, index) => i.type === 'photo' ?
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
                  radius={index === 0 ? (30 * 2.5) / zoom : (index === nodes.length - 1) ? (30 * 2.5) / zoom : (30 * 2.5) / zoom}
                  fillColor={index === 0 ? 'red' : (index === nodes.length - 1) ? '#fff' : 'gold'}
                  strokeColor='yellow'
                  strokeWidth={4}
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
      
            {movie === 'running' ? 
            <RunBlock 
              height = {heightBlock}
              setheight = {setHeightBlock}
              distance={distance}
              time={(Date.now() - timeRef.current)/1000}
              speed={speed}
            /> 
            : 
            null}
        

        <View style={[styles.btnContainer, styles.startstop, { gap: 10 }]}>
          {startStop ? (
            <TouchableHighlight
              style={[styles.btnStop, { width: '100%' }]}
              onPress={()=>setStartStop(false)}
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
                onPress={()=>setStartStop(true)}
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