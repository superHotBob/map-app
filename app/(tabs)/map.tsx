import { StyleSheet, View, Dimensions, Alert, Text, TouchableHighlight, StatusBar } from 'react-native';
import { useEffect, useState, useRef, Key } from 'react';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import getDistance from 'geolib/es/getDistance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import {addpoint, deletepoint, setname } from '@/reduser';
import { captureRef } from 'react-native-view-shot';
import RunBlock from '@/components/runblock';
import { ToDBwriteWalk, SecondsToTime, ToDBwriteRun, CreateDB } from '@/hooks/useDB';

const { height, width } = Dimensions.get('window');

const Map = () => {
  const refzoom = useRef();
  const timeRef = useRef<number>(0);
  const dispatch = useDispatch();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [startStop, setStartStop] = useState(true);
  const [path, setPath] = useState(0);
  const [distance, setDistance] = useState(0);
  const [typeMap, settypeMap] = useState<string>('standard');
  const [zoom, setZoom] = useState(12);
  const [heightBlock, setHeightBlock] = useState(height);
  const [speed, setSpeed] = useState(1);
  const [calories, setCalories] = useState(0);


  const { nodes, type, name, time } = useSelector((state) => state.track);

  useEffect(() => {
    if (nodes.length === 1) {
      timeRef.current = Date.now();
      setStartStop(true);
      setDistance(0);
      setPath(0);
    }
  }, []);

  const GetLocations = async (i: { coordinate: { timestamp: number, latitude: number, longitude: number, speed: number } }) => {
    
    if(!startStop) return;
    
    if (i.coordinate.timestamp - timeRef.current < 30000*nodes.length-10000) return;
    
    const {coords} = await Location.getCurrentPositionAsync({timeInterval: 30000 , accuracy: 5});    
    const x =  0.001 - Math.random()/500; 
    const point = {
        longitude: coords.longitude ,
        latitude: coords.latitude ,
        type: type
    };   
    dispatch(addpoint(point));
    
    if (type === 'running') {
      setSpeed(coords.speed + Math.random() * 10);
    }
    GetDistance(point);
  };

  const Save = () => {
    Alert.alert('Сохранить путь',
      name + ', \n' + 'time: ' + SecondsToTime(timeRef.current) + ',' + ' \n' + 'path: ' + path + ' m.',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => SavePath() },
      ]
    );
  };
  const SavePath = async () => {
    const localUri = await captureRef(refzoom, {
      fileName: name.trimEnd() + '_',
      format: 'jpg',
      height: height - 225,
      width: width,
      quality: 1,
    });    
    const directoryUri = `${FileSystem.documentDirectory}${'images'}`;
    let { exists } = await FileSystem.getInfoAsync(directoryUri);
    if( exists ) {
      await FileSystem.moveAsync({from: localUri, to: directoryUri +'/' + name + '.jpg'})
    } else {
      CreateDB();
      await FileSystem.makeDirectoryAsync(directoryUri,{intermediates: true});
      await FileSystem.moveAsync({from: localUri, to: directoryUri +'/' + name + '.jpg'})
    };   
    const photo_count = nodes.filter((i: { type: string }) => i.type === 'photo').length;   
   
    if (type === 'walking') {
      await ToDBwriteWalk(name, timeRef, photo_count, path, type);
      DeletePath();
    } else {
      let path = distance;
      await ToDBwriteWalk(name, timeRef, photo_count, path, type);
      ToDBwriteRun(name, speed, distance, timeRef, calories);
      DeletePath();
    }   
  };

  function DeletePath() {
    router.dismissAll();
    dispatch(deletepoint());
    dispatch(setname(''));    
  };

  type loc = { latitude: number, longitude: number }

  function GetDistance(item: loc) {
    const distance = getDistance(
      { latitude: nodes[0].latitude, longitude: nodes[0].longitude },
      { latitude: item.latitude, longitude: item.longitude }
    )
    setDistance(distance);
    if (nodes.length === 1) {
      setPath(distance)
    } else {
      GetPath();
    };
  };

  function Distance(a: loc, b: loc): number {
    if (b === undefined) return 0;
    const distance = getDistance(
      { latitude: a.latitude, longitude: a.longitude },
      { latitude: b.latitude, longitude: b.longitude }
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
      <StatusBar barStyle='light-content' backgroundColor="#000" />
      {type === 'running' ? null : <View style={styles.distance}>
        <Text style={styles.distance_text}>To back{'\n'}{distance} m</Text>
        <Text style={[styles.distance_text, styles.path]}>Path{'\n'}{path} m</Text>
        <Text style={styles.distance_text}>Time{'\n'} {SecondsToTime(int)} </Text>
      </View>
      }
      <MapView
        ref={refzoom}
        mapType={typeMap}
        showsUserLocation={startStop}
        userLocationPriority='high'
        
        followsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        onUserLocationChange={(e) => GetLocations(e.nativeEvent)}
        userLocationFastestInterval={30000}
        style={[styles.map, { height: height - 225 }]}
        onPress={() => setHeightBlock(height - 45)}
        region={{
          latitude: nodes[0].latitude,
          longitude: nodes[0].longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
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
            icon={require('../../assets/images/camera.png')}
          />
          :
          <Circle key={index}
            center={{
              latitude: i.latitude,
              longitude: i.longitude
            }}
            radius={index === 0 ? 20 / zoom : (index === nodes.length - 1) ? 20 / zoom : 0}
            fillColor={index === 0 ? 'red' : (index === nodes.length - 1) ? '#fff' : 'gold'}
            strokeColor='yellow'
            strokeWidth={3}
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

      {type === 'running' && height != 0 ?
        <RunBlock
          height={heightBlock}
          setheight={setHeightBlock}
          distance={distance}
          time={timeRef.current}
          speed={speed}
        /> : null}
      <View style={[styles.btnContainer, styles.btnStartStop, { gap: 10 }]}>
        {startStop ? (
          <TouchableHighlight
            activeOpacity={0.8}
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
  btnStartStop: {
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