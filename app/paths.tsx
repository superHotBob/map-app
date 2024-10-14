import {
    Pressable,
    Image,
    Text,
    TouchableOpacity,
  
    FlatList,
    StyleSheet,
    View,
    Dimensions
  } from "react-native";
  import { useRouter } from 'expo-router';
  import { useCallback, useState } from "react";
  import { useFocusEffect } from 'expo-router';
  import * as MediaLibrary from 'expo-media-library';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import ImageView from "react-native-image-viewing";
  import { LinearGradient } from 'expo-linear-gradient';
  
  const width_window = Dimensions.get('window').width;
  const Path_date = (i: number) => new Date(i).toLocaleString('ru-RU',
    { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" });
  
  
  function Patch() {
    const router = useRouter();
    const [savepath, setSavePath] = useState<Array<{ id: number, uri: string, height: number, modificationTime: number }>>([])
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [images , setImages ] = useState([]);
    const [visible, setIsVisible] = useState(false);
    const [ imageindex, setImageIndex ] = useState(0);
    async function GetPaths() {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      const id = await AsyncStorage.getItem('album');
      const { assets } = await MediaLibrary.getAssetsAsync();
      setImages(assets); 
      console.log(assets)   
      setSavePath(assets.map(i => Object.assign({},{uri:i.uri})));
     
    };
  
    useFocusEffect(useCallback(() => { 
        GetPaths();
        setIsVisible(false);
    }, []));

    function SavePath(i) {
        return images.map(i => Object.assign({},{uri:i.uri}))
    }
   
  
    type Image = {
      width: number,
      uri: string,
      height: number,
      modificationTime: number,
      id: number,
      filename: string,
      name: string
    }
    function SetIsVisible(index: number) {
      setImageIndex(index);
      setIsVisible(true);     
    }
    const Item = ({ item , index}) => (
      <Pressable style={styles.imageTextPress} onPress={() => SetIsVisible(index)}>
        <Image
          style={[styles.image, { width: (width_window / 2) - 15, height: ((width_window / 2) - 10) * (item.height / item.width) }]}
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
          renderItem={({ item , index}) => <Item item={item} index={index} />}
        /> : null}
      
        <ImageView
          images={SavePath(images)}
          backgroundColor='#ddd'
          imageIndex={imageindex}
          presentationStyle='formSheet'
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
         HeaderComponent={({ imageIndex }) => {
             return (
            <Text>{images[imageIndex].path}</Text>
              
  
             )
           }
          }
          FooterComponent={({ }) => (
            <LinearGradient
              style={styles.btnDelete}
              colors={['#4c669f', '#3b5998', '#192f6a']}
             
            >
              <TouchableOpacity >
                <Text  onPress={() => setIsVisible(false)} style={styles.deleteText}>
                  BACK
                </Text>
              </TouchableOpacity>
              
            </LinearGradient>
          )}
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
    // image: {
    //   borderTopLeftRadius: 8,
    //   borderTopRightRadius: 8
    // },
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
    deleteText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff',
        lineHeight: 50
    }
  });