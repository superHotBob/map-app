import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Setting from '@/components/Setting';
import Statistic from '@/components/Statistic';
import * as SQLite from 'expo-sqlite';
import { Colors } from '@/constants/Colors';
import Patch from '@/components/Paths';
import { useDispatch } from 'react-redux';
import { setmovie } from '@/reduser';
import * as MediaLibrary from 'expo-media-library';
const color = Colors.light.background;



const HomeScreen = () => {
  const [setting, settingView] = useState(false);
  const [statistic, viewStatistic] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();  

  useFocusEffect(useCallback(()=>{StatusBar.setBarStyle('light-content')},[]))
  useEffect(() => {    
    async function ViewStorage() {
      const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
      });
      // const type = await db.execAsync('ALTER TABLE paths ADD COLUMN type TEXT')
     
    
      // const allRows = await db.getAllAsync('SELECT * FROM paths');
      // console.log(allRows);
      const time = await AsyncStorage.getItem('time');
      const albums = await MediaLibrary.getAlbumsAsync();     
     
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
          CREATE TABLE IF NOT EXISTS  paths (id INTEGER PRIMARY KEY NOT NULL, 
            name TEXT NOT NULL,
            idpath INTEGER, 
            begintime INTEGER,
            endtime INTEGER,
            images INTEGER,
            path INTEGER );
          `);
          settingView(true);
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
    ViewStorage();
  }, []);


  const ViewSavePaths = async () => {
    settingView(false);
    viewStatistic(false);
  };
  const GetStatistic = () => {
    settingView(false);
    viewStatistic(true);
  };
  const LinkToMap = (i) => {
    router.push({ pathname: '/map', params: {typemove: i} });
    dispatch(setmovie(i));
  }
  const BtnLink = ({ i }: { i: string }) => {
    return <LinearGradient
      colors={color}
      style={styles.toMap}      
    >      
      <FontAwesome5
        onPress={() =>LinkToMap(i) }
        name={i}
        size={35}
        color="#fff"
      />     
    </LinearGradient>
  }

  return (
    
      <ImageBackground
        style={styles.main_block}
        source={require('../../assets/images/mushroom.jpg')}
      >
        <View style={styles.btnBlock}>
          <LinearGradient
            style={styles.btn1}
            colors={color}
          >
            <Ionicons onPress={ViewSavePaths} name="footsteps" size={35} color="#fff" />
          </LinearGradient>
          <LinearGradient
            colors={color}
            style={styles.btn1}
          >
            <Ionicons onPress={GetStatistic} name="bar-chart" size={35} color="#fff" />
          </LinearGradient>
          <LinearGradient
            colors={color}
            style={styles.btn1}
          >
            <Ionicons onPress={() => settingView(!setting)} name="settings" size={35} color="#fff" />
          </LinearGradient>
        </View>
        <View style={styles.btnBlock}>
          <BtnLink i="walking" />
          <BtnLink i="running" />
        </View>
        {(!setting && !statistic) ? <Patch /> : null}
        {setting ? <Setting settingView={settingView} /> : null}
        {(statistic && !setting) ? <Statistic /> : null}
      </ImageBackground>
   
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  main_block: {
    flex: 1,
    paddingTop: StatusBar.currentHeight, 
    paddingHorizontal: 4,
    alignItems: 'flex-start',
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
    width: '49%',
    height: 60,
    alignItems: 'center',
    borderRadius: 28,
    textAlign: 'center',
    marginBottom: 10,
    justifyContent: 'center'
  },
  btn1: {
    backgroundColor: '#ddd',
    width: '32%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    height: 50,

  },
  btnBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  }
});
