import * as SQLite from 'expo-sqlite';
import * as MediaLibrary from 'expo-media-library';

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
    album_id: string
}

export async function ToDBwriteWalk(props:Props) {
    const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
    });
    await MediaLibrary.addAssetsToAlbumAsync([props.id], props.album_id, false);
    
        
        await db.runAsync(`INSERT INTO paths (name, begintime, endtime, images, path, type) 
            VALUES (?,?,?,?,?,?)`,
            [
                props.name,                
                props.timeRef.current,
                Date.now(), 
                props.photo_count,
                props.path, 
                props.type
            ]
        );
        
};
export async function ToDBwriteRun(props:Props) {
    const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
    });
   
    await db.runAsync(`INSERT INTO run (name, begintime, distance, time, calories, speed) 
        VALUES (?,?,?,?,?,?)`,
        [
            props.name, 
            props.timeRef.current,
            props.distance,
            Date.now(), 
            100, 
            props.speed.toFixed(1)
        ]
    );
    console.log('Write to run table');
}
export function SecondsToTime(i) {  
    const time = (Date.now() - i)/1000;
    const hours = (time/3600).toFixed(0);       
    const mins = Math.trunc((time - hours*3600)/60);
    const sec = time - hours*3600 - mins*60;       
    return ( hours + ' : ' + (mins < 10 ? mins : mins) + ' : ' + 
    (+sec.toFixed(0) < 10 ? '0' + sec.toFixed(0) : sec.toFixed(0) )); 
}
export function Duration(a,b) {  
    const time = (b - a)/1000;
    const hours = (time/3600).toFixed(0);       
    const mins = Math.trunc((time - hours*3600)/60);
    const sec = time - hours*3600 - mins*60;       
    return ( hours + ' h ' + (mins < 10 ?  mins : mins) + ' min ' + 
    (+sec.toFixed(0) < 10 ? '0' + sec.toFixed(0) : sec.toFixed(0) )); 
}