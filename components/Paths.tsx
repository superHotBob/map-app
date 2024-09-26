import {
    Pressable,
    Image,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    Dimensions
} from "react-native";
import { useRouter } from 'expo-router';
import {useCallback, useState } from "react";
import { useFocusEffect } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width_window = Dimensions.get('window').width;
const Path_date = (i: number) => new Date(i).toLocaleString('ru-RU',
    { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" });


function Patch() {
    const router = useRouter();
    const [savepath, setSavePath] = useState<Array<{ id: number, uri: string, height: number, modificationTime: number }>>([])
    async function GetPaths() {
      const album = await AsyncStorage.getItem('album');      
      const { assets } = await MediaLibrary.getAssetsAsync({ album: album + '', first: 15, sortBy: 'modificationTime' });
      
      setSavePath([...assets]);
    };  
    
    useFocusEffect(   
      useCallback(() => {StatusBar.setBarStyle('light-content'); GetPaths() },[])    
    );
    type Image = {
        width: number,
        uri: string,
        height: number,
        modificationTime: number,
        id: number,
        filename: string,
        name: string
      }
      function ViewImage(i: Image) {
        router.push({
          pathname: '/modal',
          params: {
            width: i.width,
            filename: i.filename,
            id: i.id,
            uri: i.uri,
            height: i.height,
            date: i.modificationTime,
            name: i.name
          }
        })
      } 
    const Item = ({ item }) => (
        <Pressable style={styles.imageTextPress} onPress={() => ViewImage(item)}>
            <Image
                style={[styles.image, { width: (width_window / 2) - 10, height: ((width_window / 2) - 10) * (item.height / item.width) }]}
                source={{ uri: item.uri }}
            />
            <Text style={styles.imageText}>{Path_date(item.modificationTime)}</Text>
        </Pressable>
    );
    return (
        <FlatList
            data={savepath}
            numColumns={2}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Item item={item} />}
        />

    );
};
export default Patch;
const styles = StyleSheet.create({
    image: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
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
        borderRadius: 8,
        marginBottom: 9,
        marginRight: 10
      }
});