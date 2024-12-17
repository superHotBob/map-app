import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function ToDBwriteWalk(
    name: string, 
    timeRef, 
    photo_count: number, 
    path: number, 
    type: string,
    interval: number
    ) {
    const db = await SQLite.openDatabaseAsync('tracker', { useNewConnection: true });    
    await db.runAsync(`INSERT INTO paths (name, begintime, endtime, images, path, type, interval) 
            VALUES (?,?,?,?,?,?,?)`,
        [
            name,
            timeRef.current,
            Date.now(),
            photo_count,
            path,
            type,
            interval
        ]
    );

};
export async function CreateDB() {
    const db = await SQLite.openDatabaseAsync('tracker', { useNewConnection: true });
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS run (id INTEGER PRIMARY KEY NOT NULL, 
          name TEXT NOT NULL,            
          begintime INTEGER,
          time INTEGER,
          speed INTEGER,
          calories INTEGER,
          distance INTEGER,
          interval INTEGER 
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
          path INTEGER,
          interval INTEGER
        );
    `);    

};
export async function ToDBwriteRun( 
    name: string, 
    speed: number, 
    distance: number, 
    timeRef: Object,
    interval: number
    ) {
    const weight = await AsyncStorage.getItem('weight');   
    const calories =  6*Number(weight)*(Date.now() - timeRef.current)/36000000  
    const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
    });

    await db.runAsync(`INSERT INTO run (name, begintime, distance, time, calories, speed, interval) 
        VALUES (?,?,?,?,?,?,?)`,
        [
            name,
            timeRef.current,
            distance,
            Date.now(),
            calories,
            speed.toFixed(1),
            interval
        ]
    );
    
}
export function SecondsToTime(i:number) {
    const time = (Date.now() - i) / 1000;
    const hours = Math.trunc(time/3600);
    const mins = Math.trunc((time - hours*3600)/60);
    const sec = time - hours*3600 - mins * 60;
    return ((hours === 0 ? '' : hours + ' h :') +  (mins < 10 ? mins : mins) + ' : ' +
        (Math.round(sec) < 10 ? '0' + Math.round(sec) : Math.round(sec)));
}
export function Duration(a:number, b:number) {
    const time = (b - a) / 1000;
    const hours = +(time / 3600).toFixed(0);   
    const mins = Math.trunc((time - hours * 3600) / 60);
    const sec = time - hours * 3600 - mins * 60;
    return ((hours === 0 ? '0 : ' : hours + ' h ') + (mins < 10 ? mins : mins) + ' : ' +
        (Math.round(sec) < 10 ? '0' + Math.round(sec) : Math.round(sec)));
}