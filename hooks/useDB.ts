import * as SQLite from 'expo-sqlite';
import * as MediaLibrary from 'expo-media-library';

export async function ToDBwriteWalk(props) {
    const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
    });
    await MediaLibrary.addAssetsToAlbumAsync([props.id], props.album, false);
    
        
        await db.runAsync(`INSERT INTO paths (name, idpath, begintime, endtime, images, path, type) 
            VALUES (?,?,?,?,?,?,?)`,
            [
                props.name, props.id,
                props.timeRef.current,
                Date.now(), props.photo_count,
                props.path, props.movie
            ]
        );
   
};
export async function ToDBwriteRun(props) {
    const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
    });
    await MediaLibrary.addAssetsToAlbumAsync([props.id], props.album, false);
    await db.runAsync(`INSERT INTO run (name, begintime, distance, time, calories, speed) 
        VALUES (?,?,?,?,?,?,?)`,
        [props.name, props.timeRef.current,
            props.distance,
            props.time, props.calories, props.speed
        ]
    );
}
export function SecondsToTime(i) {  
    const time = (Date.now() - i)/1000;
    const hours = (time/3600).toFixed(0);       
    const mins = Math.trunc((time - hours*3600)/60);
    const sec = time - hours*3600 - mins*60;       
    return ( hours + ' : ' + (mins < 10 ? '0' + mins : mins) + ' : ' + 
    (+sec.toFixed(0) < 10 ? '0' + sec.toFixed(0) : sec.toFixed(0) )); 
}
export function Duration(a,b) {  
    const time = (b - a)/1000;
    const hours = (time/3600).toFixed(0);       
    const mins = Math.trunc((time - hours*3600)/60);
    const sec = time - hours*3600 - mins*60;       
    return ( hours + ' h ' + (mins < 10 ? '0' + mins : mins) + ' min ' + 
    (+sec.toFixed(0) < 10 ? '0' + sec.toFixed(0) : sec.toFixed(0) )); 
}