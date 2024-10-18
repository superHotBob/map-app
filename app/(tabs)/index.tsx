import {
  ImageBackground,
  StatusBar,
  StyleSheet,
 
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect} from 'react';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { Colors } from '@/constants/Colors';

const color = Colors.light.background;

const HomeScreen = () => {
  useEffect(() => {
    async function CreateStorage() {     
      const time = await AsyncStorage.getItem('time');     
      if (time) {
        return;
      } else {
        try {
          const db = await SQLite.openDatabaseAsync('tracker', {
            useNewConnection: true
          });
          console.log('create db');
          await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS run (id INTEGER PRIMARY KEY NOT NULL, 
              name TEXT NOT NULL,            
              begintime INTEGER,
              time INTEGER,
              speed INTEGER,
              calories INTEGER,
              distance INTEGER 
            );
         `);

          await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS paths (id INTEGER PRIMARY KEY NOT NULL, 
              name TEXT NOT NULL,            
              begintime INTEGER,
              endtime INTEGER,
              type TEXT,
              images INTEGER,          
              path INTEGER 
            );
         `);
          await AsyncStorage.setItem('time', '0.5')  
        } catch (error) { console.log(error) }
      };
      // const type = await db.execAsync('ALTER TABLE paths ADD COLUMN type TEXT')

     
     
      // const del = await db.runAsync(`DELETE FROM paths WHERE name = ?`,[name]); 
      // await db.runAsync(`UPDATE paths  SET begintime = 1725195168000, endtime = 1725197169000,images = 1  where name = 'super'`);
      // await db.execAsync('drop table paths');
      // await db.runAsync('INSERT INTO paths (name, idpath, begintime,endtime,path,images) VALUES (?, 10, 1725202074000,1725212474000,1500,3)',['ррррр']);
     


    }
    CreateStorage();
    console.log('Use effect main block')
  },[]);
  return (
    <ImageBackground
      style={styles.main_block}
      source={require('../../assets/images/mushroom.jpg')}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <LinearGradient
        style={styles.btn1}
        colors={color}
      >
        <Link href="/paths">
          <Text style={styles.textButton}>My paths</Text>
        </Link>
      </LinearGradient>
      <LinearGradient
        colors={color}
        style={styles.btn1}
      >
        <Link href="/statistic">
          <Text style={styles.textButton}>Statistic</Text>
        </Link>
      </LinearGradient>
      <LinearGradient
        colors={color}
        style={styles.btn1}
      >
        <Link href='/enter'>
          <Text style={styles.textButton}>Begin movie</Text>
        </Link>
      </LinearGradient>
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
  },
  textButton: {
    color: '#fff',
    fontSize: 30
  },
  btn1: {
    backgroundColor: '#ddd',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 140,
    height: 150,
    opacity: 0.7,
    borderWidth: 4,
    borderColor: 'silver'
  }
});
