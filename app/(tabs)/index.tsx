import { Image, 
  ImageBackground, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View,
  Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Link } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';


export default function HomeScreen() {
  const [savepath, setSavePath] = useState<Array<Object>>([])
  const width_window = Dimensions.get('window').width; 
  const ViewSavePath = async() => {
    const myalbum = await MediaLibrary.getAssetsAsync();
    console.log(myalbum.assets)
    setSavePath([...savepath,...myalbum.assets])
  }

  return (
    <ImageBackground
      style={styles.main_block}
      source={require('../../assets/images/mushroom.jpg')}
    >
      <Text>Приложение </Text>
      <Pressable 
        style={[styles.toMap,{marginTop: 10}]}
        onPress={ViewSavePath}
      >
        <Text style={styles.button_text}>сохранённые маршруты</Text>
      </Pressable> 
      <Pressable 
        onPress={()=>setSavePath([])}
        style={[styles.toMap,{marginTop: 10}]}>
        <Text style={styles.button_text}>статистика</Text>
      </Pressable> 
     
      <Link to='/map' style={styles.toMap}>
        НАЧАТЬ ЗАПИСЬ МАРШРУТА
      </Link>
      <ScrollView style={{marginTop: 10}}>       
      {savepath.length > 0 ? <View style={[styles.view_image,{width: width_window - 16}]}>
        {savepath.map(i => 
          <Image 
            style={[styles.image,{width: (width_window/2) - 12}]} 
            key={i.modificationTime} 
            source={{uri: i.uri}} 
          
          />
          
        )}
      </View> : null}
      </ScrollView>  
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  main_block: {
    flex: 1,
   
    marginTop: 45,
    paddingHorizontal: 8,

  },
  button_text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
    backgroundColor: '#ddd'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  }, 
  toMap: {
    backgroundColor: '#ddd',
    width: '100%',
    marginHorizontal: 'auto',
    marginTop: 20,
    
    color: 'blue',
    fontWeight: 'bold',
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',

    fontSize: 20,

  },
  view_image: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    justifyContent: 'space-between',
   
  },
  image: {
    height: 200,
    borderRadius: 8,
    
  }
});
