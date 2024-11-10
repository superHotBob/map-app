import { useEffect, useState } from "react";
import { FlatList, View, Text , Pressable, Image, Dimensions, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get('window');

export default function Background() {
    const [images, setImages] = useState([]);
    useEffect(() => {
        async function GetImages() {
            let response = await fetch('https://superbob.pythonanywhere.com/images');
            let images = await response.json();
            let all_images = images.map(i=>i.replace('.jpg',''))
            setImages(all_images);            
        }
        GetImages();
    }, [])
    const SetBackground = async (i:string) => {
        await AsyncStorage.setItem('background',i);       
    }
    const Item = ({ item, index }: { index: number, item:  string }) => (
        <Pressable style={styles.imageTextPress} onPress={()=>SetBackground(item)}>
          <Image
            style={{ width: (width / 2) - 15, height: width / 2 }}
            source={{ uri: 'https://superbob.pythonanywhere.com/image?name=' + item}}
          />          
        </Pressable>
      );
    return (
        <View style={{padding: 10,backgroundColor: '#fff'}}>
            <FlatList
                data={images}
                numColumns={2}                
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
})