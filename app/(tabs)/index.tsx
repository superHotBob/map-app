import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Link } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Setting from '@/components/Setting';
import Statistic from '@/components/Statistic';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';


const Path_date = (i: number) => new Date(i).toLocaleString('ru-RU',
  { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" });
const width_window = Dimensions.get('window').width;

const HomeScreen = () => {
  const router = useRouter()
  const [setting, settingView] = useState(false)
  const [statistic, viewStatistic] = useState(false)
  const [savepath, setSavePath] = useState<Array<{ id: number, uri: string, height: number, modificationTime: number }>>([])

  useEffect(() => {
    async function ViewStorage() {
      const time = await AsyncStorage.getItem('time');
      const db = await SQLite.openDatabaseAsync('tracker',{
        useNewConnection: true
      });
      const allRows = await db.getAllAsync('SELECT * FROM paths');
      console.log('allrows', allRows);
      if (time) {

        return;
      } else {
        settingView(true);
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
        } catch (error) { console.log(error) }

    
     
      };
      // await db.execAsync('ALTER TABLE paths ADD COLUMN idpath INTEGER')

      // CreateDB();
      // await db.runAsync('DELETE FROM paths WHERE id = 7'); 
      // await db.runAsync(`UPDATE paths  SET begintime = 1725195168000, endtime = 1725197169000,images = 1  where name = 'super'`);
      // await db.execAsync('drop table paths');
      // await db.runAsync('INSERT INTO paths (name, idpath, begintime,endtime,path,images) VALUES (?, 10, 1725202074000,1725212474000,1500,3)',['ррррр']);
      // const allRows = await db.getAllAsync('SELECT * FROM paths');
      // console.log('allrows', allRows);

    }
    ViewStorage();
    console.log('useeffect');
  },[]);


  const ViewSavePaths = async () => {
    const album = await AsyncStorage.getItem('album');
    const data = await MediaLibrary.getAssetsAsync({ album: album, first: 10, sortBy: 'modificationTime' });
    settingView(false);
    viewStatistic(false);
    setSavePath([...data.assets]);
    console.log(data.assets)
  };
  const GetStatistic = () => {
    setSavePath([]);
    settingView(false);
    viewStatistic(true);
  };
  type Image = {
    width: number,
    uri: string, height: number, modificationTime: number, id: number, filename: string
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
        date: i.modificationTime
      }
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        style={styles.main_block}
        source={require('../../assets/images/mushroom.jpg')}
      >
        <View style={styles.btnBlock}>
          <LinearGradient
            style={styles.btn1}
            colors={['#4c669f', '#3b5998', '#192f6a']}
          >
            <Ionicons onPress={ViewSavePaths} name="footsteps" size={35} color="#fff" />
          </LinearGradient>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.btn1}
          >
            <Ionicons onPress={GetStatistic} name="bar-chart" size={35} color="#fff" />
          </LinearGradient>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.btn1}
          >
            <Ionicons onPress={() => settingView(!setting)} name="settings" size={35} color="#fff" />
          </LinearGradient>
        </View>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={[styles.toMap, { marginTop: 10 }]}
        >
          <Link to='/map' style={[styles.toMap, { marginTop: 10 }]}>
            <Ionicons name="walk" size={40} color="#fff" />
          </Link>
        </LinearGradient>
        {savepath.length > 0 && !setting ? (
          <ScrollView style={{ marginTop: 8, borderRadius: 8 }}>
            <View style={[styles.view_image, { width: width_window - 16 }]}>
              {savepath.map(i =>
                <Pressable style={styles.imageTextPress} key={i.id} onPress={() => ViewImage(i)}>
                  <Image
                    style={[styles.image, { width: (width_window / 2) - 12, height: ((width_window / 2) - 12) * (i.height / i.width) }]}
                    source={{ uri: i.uri }}

                  />
                  <Text style={styles.imageText}>{Path_date(i.modificationTime)}</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>) : (null)}
        {setting && <Setting settingView={settingView} />}
        {(statistic && !setting) && <Statistic />}
      </ImageBackground>
    </SafeAreaView>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  main_block: {
    flex: 1,
    paddingHorizontal: 8,
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
    width: '100%',
    marginHorizontal: 'auto',
    height: 60,
    borderRadius: 8,
    textAlign: 'center'
  },
  view_image: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
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
  },
  btn1: {
    backgroundColor: '#ddd',
    width: '32%',
    alignItems: 'center',
    borderRadius: 8,
    padding: 7,

  },
  btnBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },

});
