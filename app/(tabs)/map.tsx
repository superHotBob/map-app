import { Button, Dimensions, Alert, Text, TouchableHighlight, FlatList, TextInput } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import getDistance from 'geolib/es/getDistance';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';


const points = [
  { latitude: 54.5400529, longitude: 27.8882262 },
  { latitude: 54.5417529, longitude: 27.8842262 },
  { latitude: 54.5427529, longitude: 27.8832262 },
  { latitude: 54.5435297, longitude: 27.8822262 },
  { latitude: 54.5457529, longitude: 27.8842262 },
  { latitude: 54.5487529, longitude: 27.8892262 },
  { latitude: 54.5427529, longitude: 27.8902262 },
  { latitude: 54.5437529, longitude: 27.8912262 },
  { latitude: 54.5400529, longitude: 27.8882262 }
]

const { height, width } = Dimensions.get('window');

const date = new Date().toLocaleDateString('ru-RU', { timeZone: 'europe/minsk' });
const PathTime = (i: number) => {
  console.log((Date.now() - i) / (1000 * 60))
  return (Date.now() - i) / (1000 * 60)
}
const Map = () => {
  const ref = useRef(null);  
  const intervalRef = useRef<string>(null);
  const router = useRouter()
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [pathData, onChangePathData] = useState({name: '', start: 0});
  const [startStop, setStartStop] = useState(true);
  const [path, setPath] = useState(0);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [nodes, setNode] = useState<Array<{ latitude: number, longitude: number }>>([])
  const [zoom, setZoom] = useState(12);
  const [typeMap, settypeMap] = useState<String>('standard');

  async function handleStart() {
    const step = await AsyncStorage.getItem('time');
    setStartStop(true);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTime(time => time + 1);
      GetLocation();

    }, Number(step) * 10000);
  };

  function handleStop() {
    clearInterval(intervalRef.current);
    setTime(0);
    setStartStop(false);
  };
  function handlePause() {
    clearInterval(intervalRef.current);
    setStartStop(false);
  };
  const GetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    const data = await Location.getCurrentPositionAsync({});
    const point = {
      longitude: data.coords.longitude + (0.01 - Math.random() / 50),
      latitude: data.coords.latitude + (0.01 + Math.random() / 50),
      type: 'path'
    };
    setNode(prev => ([...prev, point]));
    
  };


  //   async function GetMapCoords() {
  //     const coords = await ref?.current?.getMapBoundaries();
  //     const leftTop = Object.values(coords.northEast)
  //     const rightBottom = Object.values(coords.southWest)
  //     const mapCoords = [...rightBottom,...leftTop ].map(i => i.toFixed(4))

  //     GetMasters(mapCoords)       

  //     const distance = getDistance(
  //         { latitude: leftTop[0], longitude: leftTop[1] },
  //         { latitude: rightBottom[0], longitude: rightBottom[1] },
  //         {Accuracy: 10}
  //     );
  //     setRadius(Math.ceil(distance/2000))

  // };



  useEffect(() => GetDistance(), [nodes]);
  // useFocusEffect(
  //   useCallback(() => {

  //     if (intervalRef.current === null) {
  //       handleStart();
  //       setStartStop(true);
  //       GetLocation();
  //     } else { }
  //   }, [])
  // );
  const Save = () => {
    Alert.alert('Сохранить путь',
      pathData.name + ', \n' + 'time: ' + time + ' min , \n' + 'path: ' + path + ' m.',
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
  const DeletePath = () => {
    setTime(0);
    setNode([]);
    setDistance(0);
    setPath(0);
    intervalRef.current = null;
    setStartStop(true);
    handleStop();
    router.push('/');
  };

  function GetDistance() {
    if (nodes.length === 0) return;
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
  function StartPath() {
    onChangePathData(prev=>({...prev,...{start: Date.now()}}))
    console.log('start', pathData.name)

    handleStart();
    setStartStop(true);
    GetLocation();
  };
  function GetPath() {
    const path = nodes.reduce((acu, curr, index) =>
      acu + Distance(nodes[index], nodes[index + 1]), 0)
    setPath(path)
  };
  const ZoomUp = async () => {
    let ss = await ref?.current?.getCamera();
    ss.zoom += 0.7;
    await ref.current.animateCamera(ss);
    setZoom(zoom + 0.7)
  };
  const ZoomDown = async () => {
    let ss = await ref?.current?.getCamera();
    ss.zoom -= 0.7;
    await ref.current?.animateCamera(ss);
    setZoom(zoom - 0.7)
  };
  const SavePath = async () => {
    
    try {
      const localUri = await captureRef(ref, {
        fileName: pathData.name + '_',
        format: 'jpg',
        height: height - 225,
        width: width,
        quality: 1,
      });
      const { id } = await MediaLibrary.createAssetAsync(localUri);
      const album = await AsyncStorage.getItem('album');
      const db = await SQLite.openDatabaseAsync('tracker',{
        useNewConnection: true
      });
      if (!album) {
        const new_album = await MediaLibrary.createAlbumAsync("TRACKER", id);
        await AsyncStorage.setItem('album', new_album.id.toString());
        await MediaLibrary.addAssetsToAlbumAsync([id], new_album.id.toString());
        await db.runAsync(`INSERT INTO paths (name,idpath, begintime, endtime, images, path) VALUES (?,?,?,?,?,?)`,[pathData.name, id, pathData.start,Date.now(),0,path]);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([id], album);
        await db.runAsync(`INSERT INTO paths (name, idpath, begintime, endtime, images, path) VALUES (?,?,?,?,?,?)`,[pathData.name, id, pathData.start,Date.now(),0,path]);
      }
      DeletePath();
    } catch (e) {
      console.log(e);
    }
  };
  const TypeMap = () => {
    settypeMap(typeMap === 'satellite' ? 'standard' : 'satellite')
  };
  if (status === null) {
    requestPermission();
  }
  return (
    <SafeAreaView style={[styles.main_block,{ flex: 1, backgroundColor: '#fff' }]}>
      {/* <View style={styles.main_block}> */}
        <View style={styles.distance}>
          <Text style={styles.distance_text}>to back{'\n'}{distance} m</Text>
          <Text style={[styles.distance_text, styles.path]}>path{'\n'}{path} m</Text>
          <Text style={styles.distance_text}>time{'\n'} {PathTime(pathData.start).toFixed(1)} min</Text>
        </View>
        {nodes.length > 0 ? (
          <MapView
            ref={ref}           
            zoomEnabled={false}
            mapType={typeMap}
            style={[styles.map, { height: height - 248 }]}
            region={{
              latitude: nodes[0].latitude,
              longitude: nodes[0].longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Polyline
              coordinates={nodes}
              strokeColor="#3d4eea"
              strokeWidth={3}
            />
            {nodes.map((i, index) => index === 2 ?
              <Marker  key={index}
                coordinate={{
                  latitude: i.latitude,
                  longitude: i.longitude
                }}
                calloutOffset={{ x: 15, y: 15 }}
                image={require('../../assets/images/camera.png')}
              />
              :
              <Circle key={index}
                center={{
                  latitude: i.latitude,
                  longitude: i.longitude
                }}
                radius={index === 0 ? 45 : (index === nodes.length - 1) ? 45 : 40}
                fillColor={index === 0 ? 'red' : (index === nodes.length - 1) ? '#fff' : 'gold'}
                strokeColor='blue'
                strokeWidth={6}
              />
            )}
          </MapView>) : (
          <View style={[styles.inputBlock, { height: height }]}>
            <Text style={{fontSize: 19}}> Введите название маршрута</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text)=>onChangePathData(prev=>({...prev,...{name: text}}))}
              value={pathData.name}
              focusable
              autoCapitalize='sentences'
              placeholder="Введите название маршрута"              
            />
             <TouchableHighlight disabled={pathData.name.length < 5} style={[styles.btnZoom,{width: '70%'}]} onPress={StartPath}>
            <Text style={styles.btnText}>Start</Text>
          </TouchableHighlight>
          </View>
        )
        }
        <View style={styles.btnContainer}>
          <TouchableHighlight style={styles.btnZoom} onPress={ZoomDown}>
            <Text style={styles.btnText}>ZOOM -</Text>
          </TouchableHighlight>
          <LinearGradient style={styles.button_map_grad} colors={['#4c669f', '#3b5998', '#192f6a']}>
            <Ionicons
              onPress={TypeMap}
              name={typeMap === 'standard' ? "earth-outline" : "earth-sharp"}
              size={30}
              color='#fff'
            />
          </LinearGradient>
          <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.btnZoom} >
            <Text onPress={ZoomUp} style={styles.btnText}>ZOOM +</Text>
          </LinearGradient>
        </View>
        <View style={styles.btnContainer}>
          {startStop ? (
            <TouchableHighlight
              style={[styles.btnStop, { width: '100%' }]}
              onPress={handlePause}
            >
              <Text style={[styles.btnText, { backgroundColor: 'purple' }]}>
                stop
              </Text>
            </TouchableHighlight>) : (<>
              <TouchableHighlight
                style={styles.btnStop}
                onPress={Save}
              >
                <Text style={[styles.btnText, { backgroundColor: 'maroon' }]}>
                  save
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
                onPress={handleStart}
              >
                <Text style={[styles.btnText, { backgroundColor: 'green' }]}>
                  continue
                </Text>
              </TouchableHighlight>
            </>)
          }
        </View>
      {/* </View> */}

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  main_block: {
    paddingBottom: 10
  },
  distance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distance_text: {
    fontSize: 20,
    width: '30%',
    textAlign: 'center',
    height: 50,
    paddingHorizontal: 5,

  },
  input: {
    height: 50,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'blue',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 18
  },
  path: {
    backgroundColor: "#ddd"
  },
  map: {
    width: '100%',
    marginBottom: 8
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
  btnZoom: {
    width: '38%',
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  btnMap: {
    width: '20%',
    height: 50,
    borderRadius: 8,

  },
  button_map_grad: {
    width: '22%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    lineHeight: 50
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'blue',
    lineHeight: 50,
    color: '#fff',
    borderRadius: 8,
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
    borderRadius: 8,

  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  }
});
export default Map;