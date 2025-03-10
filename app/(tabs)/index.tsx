import { 
  ImageBackground,
  StatusBar,
  StyleSheet,
  Button, 
  View
} from 'react-native';
import MyLink from '@/components/Link';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';


const HomeScreen = () => { 
  const [back , setBack] = useState<string|null>('forest');
  
  useFocusEffect(
    useCallback(() => {     
      async function ReadStorage() {                    
        const background = await AsyncStorage.getItem('background');            
        setBack(background); 
       
      };
      ReadStorage();
    }, [])   
  );
  const image = { uri : back }  
  return (
    <ImageBackground
      style={styles.main_block}
      source={image}         
    >      
      <StatusBar  barStyle="dark-content"  />      
      <MyLink path="paths" />
      <MyLink path="path data" />
      <MyLink path="start" />     
    </ImageBackground>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  main_block: {
    flex: 1,
    backgroundColor: '#ae3bec',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30, 
    paddingBottom: 20,   
    alignContent: 'center'
  } 
});
