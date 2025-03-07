import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { useDispatch } from 'react-redux';
import { addpoint } from '@/reduser';

export const Path_date = (i,b) => (new Date(+i)).toLocaleString(b,
    { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" }
);

export async function GetCoordinate(a) {
    const dispatch = useDispatch();
    const x =  0.001 - Math.random()/500;   
    const {coords} = await Location.getCurrentPositionAsync({timeInterval: 30000 , accuracy: 5});    
    const point = {
        longitude: coords.longitude + 0.001 - Math.random()/500,
        latitude: coords.latitude + 0.001 - Math.random()/500,
        type: a
    };   
    dispatch(addpoint(point));
};
export async function DeletePath(name) {    
    const db = await SQLite.openDatabaseAsync('tracker', {
        useNewConnection: true
    });
    await fetch(`https://superbob.pythonanywhere.com/path/delete/${name}`);
    await db.runAsync('DELETE FROM paths WHERE name = ?', [name] );
    const directoryUri = `${FileSystem.documentDirectory}${'images'}${'/'}${name}`;
    let { exists } = await FileSystem.getInfoAsync(directoryUri);    
    if ( exists ) {
        await FileSystem.deleteAsync(directoryUri);
    };    
    const fileUri = `${FileSystem.documentDirectory}${'images'}${'/'}${name}${'.jpg'}`;
    await FileSystem.deleteAsync(fileUri);
};
export function SecToMin(a) {
    let mins = Math.trunc(a / 60);
    let sec = a - mins * 60;
    return mins + ':' + (sec >= 10 ? sec : '0' + sec)
}
export function ConverterToDay(a) {
    const d = new Date(a);
    return d.getDate();
};
export  function Converter(a, b, c) {
    const d = new Date(a);
    if (c === 1 && b !== 1) {
        return (d.getHours() + ':' + (d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes()))
    } else if (b === 1) {
        return (d.getDate() + '.' + 0 + (1 + d.getMonth()))
    }
    return d.getDate() + '.0' + (1 + d.getMonth())
}