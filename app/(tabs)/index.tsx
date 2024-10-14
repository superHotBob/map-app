import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Setting from '@/components/Setting';
import Statistic from '@/components/Statistic';
import * as SQLite from 'expo-sqlite';
import { Colors } from '@/constants/Colors';
import Patch from '@/components/Paths';
import { useDispatch } from 'react-redux';
import { settype } from '@/reduser';
import * as MediaLibrary from 'expo-media-library';

const color = Colors.light.background;



const HomeScreen = () => {

  const [setting, settingView] = useState(false);
  const [statistic, viewStatistic] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();


  useEffect(() => {
    async function CreateStorage() {
      const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
      });

      // await db.execAsync(`alter table paths add column images integer default 0`); 


      const time = await AsyncStorage.getItem('time');


      // const albums = await MediaLibrary.getAlbumsAsync();     

      // await db.execAsync(`alter table paths add column images integer default 0`);    
      //await db.execAsync(`update paths set images = 1  where id = 13`);
      // const allRows = await db.getAllAsync('SELECT * FROM paths'); 
      // console.log(allRows); 
      // const name = 'gfgdfgd'
      // const del = await db.runAsync(`DELETE FROM paths WHERE name = ?`,[name]);    
      // console.log('allrows', del);
      if (time) {
        return;
      } else {
        try {
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

        } catch (error) { console.log(error) }
      };
      // const type = await db.execAsync('ALTER TABLE paths ADD COLUMN type TEXT')

      // CreateDB();
      // const name = 'gfgdfgd'
      // const del = await db.runAsync(`DELETE FROM paths WHERE name = ?`,[name]); 
      // await db.runAsync(`UPDATE paths  SET begintime = 1725195168000, endtime = 1725197169000,images = 1  where name = 'super'`);
      // await db.execAsync('drop table paths');
      // await db.runAsync('INSERT INTO paths (name, idpath, begintime,endtime,path,images) VALUES (?, 10, 1725202074000,1725212474000,1500,3)',['ррррр']);
      // const allRows = await db.getAllAsync('SELECT * FROM paths');
      // console.log(allRows);


    }
    CreateStorage();
    console.log('Use effect main block')
  }, [statistic]);


  

  
  

  return (
    <ImageBackground
      style={styles.main_block}
      source={require('../../assets/images/mushroom.jpg')}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
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
        <Link href='/map'>
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
    paddingTop: 10,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
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
    height: 200,
    borderWidth: 4,
    borderColor: 'silver'

  },

});
