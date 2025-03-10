import { StyleSheet,  
  View, Dimensions, Alert, 
  Text, TouchableHighlight, StatusBar
} from 'react-native';
import { useState, useRef, Key, useCallback, useMemo } from 'react';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import getDistance from 'geolib/es/getDistance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addpoint, deletepoint, setname } from '@/reduser';
import { captureRef } from 'react-native-view-shot';
import { ToDBwriteWalk, SecondsToTime, ToDBwriteRun, CreateDB } from '@/hooks/useDB';
import { useKeepAwake } from 'expo-keep-awake';
const { height, width } = Dimensions.get('window');
import * as Brightness from 'expo-brightness';
import * as Speech from 'expo-speech';
import MapHeader from '@/components/MapHeader';



export default function Map() {
  useKeepAwake();
  const refzoom = useRef();
  const timeRef = useRef<number>(Date.now());
  const dispatch = useDispatch();
  const [startStop, setStartStop] = useState(true);
  const [path, setPath] = useState(0);
  const [distance, setDistance] = useState<number>(1);
  const [typeMap, settypeMap] = useState<string>('standard');
  const [zoom, setZoom] = useState(12); 
  const [speed, setSpeed] = useState<number|0>(0);

  const {sound, nodes, type, name , time} = useSelector((state) => state.track);

  
  useFocusEffect( useCallback(() => {   
    return () => {
      Speech.speak('Focus lost');
    };
  }, []));

  const toObject = useMemo(() => {
    const s = nodes.map(i => Object.assign({}, { latitude: i[0], longitude: i[1] }))

    return s
  },[nodes])


  async function ChangeBrigthness() {
    const { status } = await Brightness.requestPermissionsAsync();
    if (status === 'granted') {
      Brightness.setBrightnessAsync(0.1);
    }
  };

  async function GetCoord() {  
    const { coords : {   latitude, longitude}} = await Location.getCurrentPositionAsync({ timeInterval: +time, accuracy: 5 });
    // const x = 0.001 - Math.random()/500; 
    const speed = Math.random()*10
    const point = [
      +(latitude + 0.001 - Math.random()/500 ).toFixed(7),
      +(longitude  + 0.001 - Math.random()/500).toFixed(7),
      type,
      +(speed * 3.6).toFixed(1)
    ];
    dispatch(addpoint(point));    
    getPath(latitude, longitude);
    if ( sound ) {
      const thingToSay = (speed * 3.6).toFixed(1);
      Speech.speak(thingToSay);
    }    
    if (type === 'running') {
      setSpeed(+(speed * 3.6).toFixed(1));  
     
    } else {
      getDistanceToBegin(latitude, longitude);
    }  
  };

  function getDistanceToBegin(a:number,b:number) {
    const distance = getDistance(
      { latitude: nodes[0][0], longitude: nodes[0][1] },
      { latitude: a, longitude: b }
    )      
    setDistance(distance);   
  };

  function getPath(a:number,b:number) {    
    const last_path =[...nodes].splice(-1);    
    const distance = getDistance(
      { latitude: last_path[0][0], longitude: last_path[0][1] },
      { latitude: a, longitude: b }
    )  
    setPath(path + distance)
  };

  interface coord { 
    timestamp: number, 
    latitude: number, 
    longitude: number, 
    speed: number 
  }
  const getLocations = async (i: { coordinate: coord }) => {
    if (!startStop) return;
    if (i.coordinate.timestamp - timeRef.current < +time * nodes.length - 10000) return;
    GetCoord();    
  };  

  const SaveMessage = () => {
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
    await GetCoord();    
    const gifDir = FileSystem.documentDirectory;
    const dirInfo = await FileSystem.getInfoAsync(gifDir);
    const file =  dirInfo.uri + '/' + name + '.txt' ; 
    await FileSystem.writeAsStringAsync(file, JSON.stringify(nodes));
    const localUri = await captureRef(refzoom, {
      fileName: name,
      format: 'jpg',
      height: height - 225,
      width: width,
      quality: 1,
    });
    
    const directoryUri = `${FileSystem.documentDirectory}${'images'}`;
    let { exists } = await FileSystem.getInfoAsync(directoryUri);
    if (exists) {
      await FileSystem.moveAsync({ from: localUri, to: directoryUri + '/' + name + '.jpg' })
    } else {
      CreateDB();
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
      await FileSystem.moveAsync({ from: localUri, to: directoryUri + '/' + name + '.jpg' })
    };
    const photo_count = nodes.filter((i: { type: string }) => i.type === 'photo').length;

    if (type === 'walking') {
      await ToDBwriteWalk(name, timeRef, photo_count, path, type,time);
      deletePath();
    } else {
      await ToDBwriteWalk(name, timeRef, photo_count, path, type,time);
      await ToDBwriteRun(name, speed, path, timeRef,time);
      deletePath();
    };
  };

  function deletePath() {
    router.dismissAll();
    dispatch(deletepoint());
    dispatch(setname(''));
  }; 

  const Zoom = async (a: number) => {
    let ss = await refzoom.current?.getCamera();
    ss.zoom += a;
    await refzoom.current?.animateCamera(ss);
    setZoom(zoom + a)
  };
  const setTypeMap = () => {
    settypeMap(typeMap === 'satellite' ? 'standard' : 'satellite')
  };
 
  return (
    <SafeAreaView style={styles.main_block}>      
      <StatusBar barStyle='dark-content' backgroundColor="#ddd"  />      
      <MapHeader distance={100} speed={speed} path={path} type={type} />    
      <MapView
        ref={refzoom}
        mapType={typeMap}
        showsUserLocation={startStop}
        userLocationPriority='high'       
        followsUserLocation={true}
        liteMode={true}
        provider={PROVIDER_GOOGLE}
        onUserLocationChange={(e) => getLocations(e.nativeEvent)}
        userLocationFastestInterval={+time}
        onLongPress={ChangeBrigthness}
        style={[styles.map, { height: height - 325 }]}        
        region={{
          latitude: nodes.slice(-1)[0][0],
          longitude: nodes.slice(-1)[0][1],
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
      >
        <Polyline
          coordinates={toObject}
          strokeColor="#3d4eea"
          strokeWidth={3}
        />
        {nodes.map((i, index: Key | null | undefined) => i[2] === 'photo' ?
          <Marker
            key={index}
            coordinate={{
              latitude: i[1],
              longitude: i[0]
            }}
            calloutOffset={{ x: -15, y: -15 }}
            icon={require('../../assets/images/camera.png')}
          />
          :
          <Circle key={index}
            center={{
              latitude: i[1],
              longitude: i[0]
            }}
            radius={index === 0 ? 20 / zoom : (index === nodes.length - 1) ? 20 / zoom : 0}
            fillColor={index === 0 ? 'red' : (index === nodes.length - 1) ? '#fff' : 'gold'}
            strokeColor='yellow'
            strokeWidth={3}
          />
        )}

      </MapView>
      <View style={styles.btnContainer}>
        <FontAwesome name="search-minus" onPress={() => Zoom(-0.7)} size={45} color="#000" />
        <Ionicons
          onPress={setTypeMap}
          name={typeMap === 'standard' ? "earth-outline" : "earth-sharp"}
          size={50}
          color='#000'
        />
        <FontAwesome name="search-plus" onPress={() => Zoom(0.7)} size={45} color="#000" />
      </View>     
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
              onPress={SaveMessage}

            >
              <Text style={[styles.btnText, { backgroundColor: 'maroon' }]}>
                Save
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.btnStop, { backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }]}
              onPress={deletePath}

            >
              <Ionicons
                name="trash"
                size={35}
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
    backgroundColor: '#ddd',
    flex: 1,
  },
  runningBlock: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
    height: height - 55,
    width: '100%'
  }, 
  messages: {
    padding: 20,
    height: 'auto',
    justifyContent: 'space-between',
    gap: 20,
    borderRadius: 12
  },
  messageText: {
    textAlign: 'center',
    fontSize: 25
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
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'blue',
    lineHeight: 60,
    color: '#fff',
    borderRadius: 28,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 30,
    alignItems: 'center',
    marginBottom: 55
  },
  btnStartStop: {
    position: 'absolute',
    bottom: 10
  },
  map: {
    width: '100%',
    marginBottom: 8
  },
  buttons: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    marginHorizontal: 'auto'
  },


  button_map_text: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 50,
    color: '#fff'
  },
  btnStop: {
    height: 60,
    marginTop: 18,
    width: '32%',
    marginHorizontal: 'auto',
    borderRadius: 28,

  },

});