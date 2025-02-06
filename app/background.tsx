import { useEffect, useState } from "react";
import { FlatList, View, Text , Pressable, Image, Dimensions, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const { width,height } = Dimensions.get('window');
import * as MediaLibrary from 'expo-media-library';


export default function Background() {
    const [images, setImages] = useState<boolean|null|Array<T>>(false);
    useEffect(() => {
        async function GetImages() {                  
            const id = await MediaLibrary.getAlbumAsync('DCIM');
            if ( id === null) {
                return setImages(null)
            }
            const {assets} = await MediaLibrary.getAssetsAsync({'album':id});
            const files = assets.map(i=>i.uri);
            setImages(files);            
        }
        GetImages();
    }, [])
    const SetBackground = async (i:string) => {
        await AsyncStorage.setItem('background',i);
        router.back();       
    };
    const Item = ({ item }: { item:  string }) => (
        <Pressable 
            style={styles.imageTextPress} 
            onPress={()=>SetBackground(item)}
        >
          <Image
            style={{resizeMode: 'cover', width: (width / 2) - 15, height: height/2}}
            source={{ uri: item}}
          />          
        </Pressable>
    );
    return (
        <View style={{padding: 10,backgroundColor: '#fff'}}>           
            <FlatList
                data={images}
                numColumns={2}
                ListEmptyComponent={<View >{
                    images ?'waiting' : images === null ? 
                    <Text style={styles.message}>Folder DCIM not exist</Text>
                    :
                    <Text style={styles.message}>Folder DCIM is empty</Text>
                }</View>}                
                keyExtractor={item => item}
                renderItem={({ item, index }) => <Item item={item} index={index} />}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    imageTextPress: {
        backgroundColor: '#ddd',
        marginBottom: 9,
        marginRight: 10
    },
    message: {
        fontSize: 35,
        textAlign: 'center',
        marginVertical: '95%'
    }
})