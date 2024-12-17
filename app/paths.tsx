import {
  Pressable,
  Image,
  Text,
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  StatusBar
} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from "react";
import { router, useFocusEffect } from 'expo-router';
import ImageView from "react-native-image-viewing";
import { Ionicons } from "@expo/vector-icons";
import * as SQLite from 'expo-sqlite';
import { DeletePath } from "@/scripts/functions";
const width_window = Dimensions.get('window').width;
const { height } = Dimensions.get('window');


export default function Patch() { 
  const [images, setImages] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [imageindex, setImageIndex] = useState(0);
  const directoryUri = `${FileSystem.documentDirectory}${'images'}`;

  useFocusEffect(useCallback(() => {
    GetPaths();
    setIsVisible(false);    
  }, []));

  async function GetPaths() {    
    let images = await FileSystem.readDirectoryAsync(directoryUri);
    let filtr = images.filter(i=>i.includes('.jpg'));
        
    setImages(filtr);
  };

  async function DeleteMyPath(i: string) { 
    const path =  i.replace('.jpg','');
    DeletePath(path);
    setIsVisible(false);
    GetPaths();
  };

  async function SharePath(i:  string) {   
   await Sharing.shareAsync(directoryUri + '/' + i, {})
  };

  function GetName(i:string) {
    return i.split('.')[0]
  }

  function SavePath(i: { uri: string }) {    
    return images.map(i => Object.assign({}, { uri: directoryUri +'/' + i, name: i }))
  }
  async function GoToStatistic(i: string) {
    const name = i.split('.')[0]
    const db = await SQLite.openDatabaseAsync('tracker', {
      useNewConnection: true
    });
    const path = await db.getAllAsync(`SELECT * FROM paths where name = ?`, [name]);
    router.push({
      pathname: path[0].type === 'walking' ? '/pathwalk' : '/pathrunning',
      params: {
        start: path[0].begintime,
        end: path[0].endtime,
        type: path[0].type,
        name: path[0].name,
        id: path[0].id,
        path: path[0].path
      }
    })
  };
  function ViewPath(i:string) {   
    router.push({
      pathname: '/pathmap',
      params: {name: i.slice(0,-4)}
    })
  }




  function SetIsVisible(index: number) {
    setImageIndex(index);
    setIsVisible(true);
  }
  const Item = ({ item, index }: { index: number, item:  string }) => (
    <Pressable style={styles.imageTextPress} onPress={() => SetIsVisible(index)}>
      <Image
        style={{ width: (width_window / 2) - 15, height: ((width_window / 2) - 10)*((height - 225)/width_window )  }}
        source={{ uri: directoryUri +'/' + item}}
      />     
    </Pressable>
  );
  return (
    <View style={styles.mainBlock}>
      <StatusBar barStyle="dark-content"   />
      <FlatList
        data={images}
        numColumns={2}
        ListEmptyComponent={() => <Text style={styles.empty}>NO PATHS</Text>}
        keyExtractor={item => item}
        renderItem={({ item, index }) => <Item item={item} index={index} />}
      />
      <ImageView
        images={SavePath(images)}
        backgroundColor='#fff'
        imageIndex={imageindex}
        presentationStyle='pageSheet'
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        HeaderComponent={({ imageIndex }) => {
          return (
            <View style={styles.headerBlock}>
              <Ionicons onPress={() => setIsVisible(false)} name="arrow-back-sharp"  color="#ff7fff" size={35} />
              <Text style={styles.headerText}>{GetName(images[imageIndex])}</Text>
              <Ionicons onPress={() => GoToStatistic(images[imageIndex])} name="stats-chart" size={45}  color="#ff7fff" />
            </View>
          )}
        }
        FooterComponent={({ imageIndex }) =>
          <View style={styles.icons}>
             <Ionicons
              onPress={() => DeleteMyPath(images[imageIndex])}
              style={styles.trash}
              name="trash"
              size={50}
              color="green"
            />
            <Ionicons
              onPress={() => ViewPath(images[imageIndex])}
              style={styles.trash}
              name="map"
              size={50}
              color="#ff7fff"
            />
            <Ionicons
              onPress={() => SharePath(images[imageIndex])}
              style={styles.trash}
              name="share"
              size={50}
              color="#ff7fff"
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainBlock: {
    paddingTop: 10,
    flexDirection: 'row',
    paddingLeft: 8,
    backgroundColor: "#fff",
    flex: 1
  },
  headerBlock: {
    width: '100%',
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 28,
    color: '#ff7fff'
  },
  imageText: {
    fontSize: 17,
    paddingVertical: 5,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  imageTextPress: {
    backgroundColor: '#ddd',
    marginBottom: 9,
    marginRight: 10
  },
  empty: {
    flex: 1,
    fontSize: 30,
    marginTop: 100,
    alignSelf: 'center',
    justifyContent: 'space-between'
  },
  btnDelete: {
    width: '100%',
    marginHorizontal: 'auto',
    marginBottom: 25,
    height: 50,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  trash: {
    margin: 'auto',
    marginBottom: 40
  }
});