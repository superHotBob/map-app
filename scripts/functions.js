import * as MediaLibrary from 'expo-media-library';

export const Path_date = (i) => (new Date(+i)).toLocaleString('ru-RU',
    { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" }
);

export const Add_photo = async (a,b) => {    
    const asset = await MediaLibrary.createAssetAsync(a);    
    if (b === null) {
        await MediaLibrary.createAlbumAsync('photo', asset, false);
        const album = await MediaLibrary.getAlbumAsync('photo');               
        await AsyncStorage.setItem('photo', album.id);   
    } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset.id], b, false);
    }

}