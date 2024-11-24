import * as SQLite from 'expo-sqlite';


type Props = {
    id: string,
    name: string,
    path: number,
    type: string,
    timeRef: Object,
    album: string,
    photo_count: number,
    speed: number,
    distance: number,
    album_id: number
    localUri: string
}
export async function ToDBwriteWalk(name: string, timeRef, photo_count: number, path: number, type: string) {

    const db = await SQLite.openDatabaseAsync('tracker', { useNewConnection: true });   
    
    await db.runAsync(`INSERT INTO paths (name, begintime, endtime, images, path, type) 
            VALUES (?,?,?,?,?,?)`,
        [
            name,
            timeRef.current,
            Date.now(),
            photo_count,
            path,
            type
        ]
    );

};
export async function CreateDB() {
    const db = await SQLite.openDatabaseAsync('tracker', { useNewConnection: true });
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE run IF NOT EXISTS (id INTEGER PRIMARY KEY NOT NULL, 
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
        CREATE TABLE paths IF NOT EXISTS (id INTEGER PRIMARY KEY NOT NULL, 
          name TEXT NOT NULL,            
          begintime INTEGER,
          endtime INTEGER,
          type TEXT,
          images INTEGER,          
          path INTEGER 
        );
    `);    

};
export async function ToDBwriteRun( 
    name: string, 
    speed: number, 
    distance: number, 
    timeRef: Object,
    calories: number ) {
    const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
    });

    await db.runAsync(`INSERT INTO run (name, begintime, distance, time, calories, speed) 
        VALUES (?,?,?,?,?,?)`,
        [
            name,
            timeRef.current,
            distance,
            Date.now(),
            100,
            speed.toFixed(1),
            calories
        ]
    );
    
}
export function SecondsToTime(i:number) {
    const time = (Date.now() - i) / 1000;
    const hours = (time / 3600).toFixed(0);
    const mins = Math.trunc((time - hours * 3600) / 60);
    const sec = time - hours * 3600 - mins * 60;
    return (hours + ' : ' + (mins < 10 ? mins : mins) + ' : ' +
        (+sec.toFixed(0) < 10 ? '0' + sec.toFixed(0) : sec.toFixed(0)));
}
export function Duration(a, b) {
    const time = (b - a) / 1000;
    const hours = (time / 3600).toFixed(0);
    const mins = Math.trunc((time - hours * 3600) / 60);
    const sec = time - hours * 3600 - mins * 60;
    return (hours + ' h ' + (mins < 10 ? mins : mins) + ' min ' +
        (+sec.toFixed(0) < 10 ? '0' + sec.toFixed(0) : sec.toFixed(0)));
}