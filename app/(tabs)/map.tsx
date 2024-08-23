import { Button, Dimensions, Pressable, Text, TouchableHighlight } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import getDistance from 'geolib/es/getDistance';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';


const points = [
  { latitude: 37.4220936, longitude: -122.083922 },
  { latitude: 37.4296386, longitude: -122.081646 },
  { latitude: 37.4305248, longitude: -122.0861628 },
  { latitude: 37.4274153, longitude: -122.0877787 },
  { latitude: 37.4258605, longitude: -122.0896065 },
  { latitude: 37.4245259, longitude: -122.0851431 },
  { latitude: 37.4225259, longitude: -122.0890000 },
]


export default function TabTwoScreen() {
  const ref = useRef(null)
  const router = useRouter()
  const [status, requestPermission] = MediaLibrary.usePermissions();
  
  const [startStop, setStartStop] = useState(true)
  const [path, setPath] = useState(0)
  const [time, setTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [node, setNode] = useState<Array<Object>>([])
  const [zoom, setZoom] = useState(12)
  const [typeMap, settypeMap] = useState<string>('standard')
  let height_window = Dimensions.get('window').height;

  if (status === null) {
    requestPermission();
  }

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
  // useEffect(() => {
  //   // setNode([]);
  //   setTime(0);
  //   if (node.length > 0) return;
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       console.log('Permission to access location was denied');
  //       return;
  //     }
  //     const data = await Location.getCurrentPositionAsync({});
  //     const start = { 'latitude': data.coords.latitude, 'longitude': data.coords.longitude }
  //     setNode([...node, start])
  //     console.log([...node, start])
  //   })();
  // }, [])
  useFocusEffect(
    useCallback(() => {
    console.log('time:' , time, 'length', node.length)
    // if (node.length === 0) return;
    // const nextPoint = { 'latitude': points.rds.latitude, 'longitude': data.coords.longitude }

    if(node.length === 0 ) {
      setNode([...node, points[time]]);     
      const time_out = setTimeout(() => {          
        setTime(time => ++time + 1);              
      }, 6000);
      if (!startStop || time > 5 ) {
        clearTimeout(time_out)
      }; 
             
    } else {
      setNode([...node, points[time]]); 
      GetDistance();  
     
      const time_out = setTimeout(() => {          
        setTime(time => time + 1);
              
      }, 6000);
      if (!startStop || time > 5 ) {
        clearTimeout(time_out)
      };        
    };   
  }, [time,startStop]));

 

  function GetDistance() {
    console.log('lan',node.slice(-1)[0].latitude)
    const distance = getDistance(
      { latitude: node[0].latitude, longitude: node[0].longitude },
      { latitude: node.slice(-1)[0].latitude, longitude: node.slice(-1)[0].longitude },
      { Accuracy: 10 }
    )
    setDistance(distance)
    GetPath()
  };
  type loc = {latitude: number, longitude: number}
  function Distance(a: loc , b: loc): number {
    if (b === undefined) return 0;
    const distance = getDistance(
      { latitude: a.latitude, longitude: a.longitude },
      { latitude: b.latitude, longitude: b.longitude },
      { Accuracy: 10 }
    )
    return distance;
  }
  function GetPath() {
    const path = node.reduce((acu, curr, index) =>
      acu + Distance(node[index], node[index + 1]), 0)

    setPath(path)
  }


  const ZoomUp = async () => {
    let ss = await ref?.current?.getCamera();
    ss.zoom += 0.7;
    await ref.current.animateCamera(ss);
    setZoom(zoom + 0.7)
  }
  const ZoomDown = async () => {
    let ss = await ref?.current?.getCamera();

    ss.zoom -= 0.7;
    await ref.current?.animateCamera(ss);
    setZoom(zoom - 0.7)
  }
  const SavePath = async() => {
    const screenCapture = async () => {
      try {
        const localUri = await captureRef(ref, {
          fileName: 'mymap',
          format: 'jpg',
          height: height_window - 220,
          width: 400,
          quality: 1,
        });
  
        const myalbum = await MediaLibrary.getAssetsAsync();
        console.log(myalbum)
        const asset = await MediaLibrary.createAssetAsync(localUri);
        console.log('asset',asset)
        router.push({pathname:'/modal', params: {uri: asset.uri, height: asset.height}})
        if (localUri) {
          console.log(localUri)
        }
      } catch (e) {
        console.log(e);
      }
    };
    screenCapture();
    // setTime(0);
    // setNode([]);
    // setStartStop(true);
    // router.push('/')
  };
  const TypeMap = () => {
    settypeMap(typeMap === 'satellite' ? 'standard' : 'satellite')
  };
  return (
    <SafeAreaView>
      <View style={[styles.main_block, { height: height_window - 200 }]}>
        <View style={styles.distance}>
          <Text style={styles.distance_text}>to back:{'\n'}{distance} m</Text>
          <Text style={[styles.distance_text, styles.path]}>path:{'\n'}{path} m</Text>
          <Text style={styles.distance_text}>time:{'\n'} {time} min</Text>
        </View>

        {node.length > 0 ? <MapView
          ref={ref}
          zoomEnabled={false}
          mapType={typeMap}
          style={[styles.map, { height: height_window - 220 }]}
          region={{
            latitude: node[0]?.latitude,
            longitude: node[0]?.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
         
            <Polyline
              coordinates={node}
              strokeColor="#3d4eea"
              strokeWidth={4}
              tappable={true}

            />
         
          {node.map((i, index) => <Marker key={index}
            pinColor={index === 0 ? 'red' : node[index + 1] === undefined ? 'green' : 'blue'}
            coordinate={{
              latitude: i.latitude,
              longitude: i.longitude
            }}
          />)}
        </MapView> : <View  style={[styles.map, { height: height_window - 220 }]}></View>}

        <View style={styles.buttons}>
          <TouchableHighlight style={[styles.button, { marginLeft: -1 }]} onPress={ZoomDown}>
            <Text style={styles.button_text}>ZOOM -</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button_map} onPress={TypeMap}>
            <Text style={styles.button_map_text}>map</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={ZoomUp}>
            <Text style={styles.button_text}>ZOOM +</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.blockButtons}>
          {startStop ? 
        <TouchableHighlight
          style={styles.stopButton}
          onPress={() => setStartStop(false)}
        >
          <Text style={[styles.button_text, { backgroundColor: 'purple' }]}>
           stop
          </Text>
        </TouchableHighlight>: <>
        <TouchableHighlight
          style={[styles.stopButton, {width: '48%'}]}
          onPress={SavePath}
        >
          <Text style={[styles.button_text, { backgroundColor: 'purple' }]}>
           SAVE PATH
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.stopButton, {width: '48%'}]}
         
          onPress={() => setStartStop(!startStop)}
        >
          <Text style={[styles.button_text, { backgroundColor: 'purple' }]}>
            restart
          </Text>
        </TouchableHighlight>
       
        </>
}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  main_block: {
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff"
  },
  distance: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  distance_text: {
    fontSize: 18,
    width: '30%',
    textAlign: 'center',
    height: 50,
    paddingHorizontal: 5,
    fontWeight: 'bold'
  },
  path: {

    backgroundColor: "#ddd"
  },
  map: {
    width: '100%',
    marginBottom: 5
  },
  buttons: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    marginHorizontal: 'auto'
  },
  button: {
    width: '38%',
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  button_map: {
    width: '20%',
    height: 50,
    backgroundColor: 'green',
    borderRadius: 8
  },
  button_text: {
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
  stopButton: {
    height: 50,
    marginTop: 8,
    width: '98%',
    marginHorizontal: 'auto',
    borderRadius: 8,
    backgroundColor: 'silver'
  },
  blockButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
