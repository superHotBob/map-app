import { 
  ImageBackground,
  StatusBar,
  StyleSheet,  
} from 'react-native';
import MyLink from '@/components/Link';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => { 
  const [back , setBack] = useState('forest');
  useEffect(() => {
    async function GetBack() {
      let back = await AsyncStorage.getItem('background');
      setBack(back);
    };
    GetBack();
  },);
  const image = { uri : `https://superbob.pythonanywhere.com/image?name=${back}`}
  
  return (
    <ImageBackground
      style={styles.main_block}
      source={image}         
    >
      <StatusBar barStyle="dark-content"  backgroundColor="#fff"/>      
      <MyLink path="paths" />
      <MyLink path="statistic" />
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
    marginTop: StatusBar.currentHeight,
    alignContent: 'center'
  } 
});
