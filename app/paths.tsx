import {
  Pressable,
  Image,
  Text,
  FlatList,
  StyleSheet,
  View,
  Dimensions
} from "react-native";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageView from "react-native-image-viewing";
import { Ionicons } from "@expo/vector-icons";

const width_window = Dimensions.get('window').width;
const Path_date = (i: number) => new Date(i).toLocaleString('ru-RU',
  { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" });
const GetNamePath = (a: string) => a.split('_')[0];

function Patch() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [images, setImages] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [imageindex, setImageIndex] = useState(0);
  useFocusEffect(useCallback(() => {
    GetPaths();
    setIsVisible(false);
  }, []));
  async function GetPaths() {
    if (permissionResponse?.status !== 'granted') {
      await requestPermission();
    }
    const id = await AsyncStorage.getItem('album');
    const { assets } = await MediaLibrary.getAssetsAsync({ album: id });
    setImages(assets);
  };


  function SavePath(i: { uri: string }) {
    return images.map(i => Object.assign({}, { uri: i.uri }))
  }
  function GoToStatistic(i) {
    router.push({
      pathname: '/photo',
      params: { name: i.split('_')[0] }
    })
  };


  function SetIsVisible(index: number) {
    setImageIndex(index);
    setIsVisible(true);
  }
  const Item = ({ item, index }: { index: number, item: Object }) => (
    <Pressable style={styles.imageTextPress} onPress={() => SetIsVisible(index)}>
      <Image
        style={{ width: (width_window / 2) - 15, height: ((width_window / 2) - 10) * (item.height / item.width) }}
        source={{ uri: item.uri }}
      />
      <Text style={styles.imageText}>{Path_date(item.modificationTime)}</Text>
    </Pressable>
  );
  return (
    <View style={styles.mainBlock}>
      {images.length > 0 ?
        <FlatList
          data={images}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => <Item item={item} index={index} />}
        /> : null}

      <ImageView
        images={SavePath(images)}
        backgroundColor='#fff'
        imageIndex={imageindex}
        presentationStyle='formSheet'
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        HeaderComponent={({ imageIndex }) => {
          return (
            <View style={styles.headerBlock}>
              <Ionicons onPress={() => setIsVisible(false)} name="arrow-back-sharp" color="blue" size={25} />
              <Text style={styles.headerText}>{GetNamePath(images[imageIndex].filename)}</Text>
              <Ionicons onPress={() => GoToStatistic(images[imageIndex].filename)} name="stats-chart" size={35} color="blue" />
            </View>
          )
        }
        }
        FooterComponent={({ imageindex }) =>
          <Ionicons style={styles.trash} name="trash" size={50} color="green" />

        }
      />
    </View>
  );
};
export default Patch;
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
    fontSize: 22
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
    //   borderRadius: 8,
    marginBottom: 9,
    marginRight: 10
  },
  btnDelete: {
    width: '100%',

    marginHorizontal: 'auto',
    marginBottom: 25,
    height: 50,
  },
  trash: {
    margin: 'auto',
    marginBottom: 40
  }
});