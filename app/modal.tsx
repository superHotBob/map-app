import { View, Alert, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,

} from 'react-native-reanimated';
import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-toast-message';

const { width, height: myheight } = Dimensions.get('window');
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function Path_date(i:number) {    
    return (new Date(+i)).toLocaleString('ru-RU',
    { dateStyle: 'short', timeStyle: 'short', timeZone: "Europe/Minsk" }
    );
};    
const Modal = () => {
    const [result, setResult] = useState(false);
    const scale = useSharedValue(1);
    const startScale = useSharedValue(1);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);
    const { filename, id, date , height, uri, item } = useLocalSearchParams();
   
    const imagefilename = filename.split('_');    

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translationX.value },
            { translateY: translationY.value },
        ],
    }));   
    async function DeletePath() {
        const db = await SQLite.openDatabaseAsync('tracker', {
            useNewConnection: true
        });
        await db.runAsync(`delete from paths where name = ? `, [imagefilename[0]]);
        const result = await MediaLibrary.deleteAssetsAsync([id]);
        setResult(result);
        showToast();
    };
    const Delete = () =>
        Alert.alert('Удалить маршрут?',
            'Маршрут и все фото будут удалены.',
            [
                {
                    text: 'Нет',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Да', onPress: () => DeletePath() },
            ]);

    const dragGesture = Gesture.Pan()
        .minDistance(1)
        .onStart(() => {
            prevTranslationX.value = translationX.value;
            prevTranslationY.value = translationY.value;
        })
        .onUpdate((event) => {
            const maxTranslateX = width / 2 - 100;
            const maxTranslateY = +height / 2 - 160;
            if (scale.value != 1) {
                translationX.value = clamp(
                    prevTranslationX.value + event.translationX,
                    -maxTranslateX,
                    maxTranslateX
                );
            };
            if (scale.value != 1) {
                translationY.value = clamp(
                    prevTranslationY.value + event.translationY,
                    -maxTranslateY,
                    maxTranslateY
                );
            };
        })
        .runOnJS(true);
        
    const singleTap = Gesture.Tap()
        .maxDuration(250)
        .onStart(() => {
            scale.value = scale.value + 1;
        });

    const doubleTap = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onStart(() => {
            scale.value = 1;
            translationX.value = 0;
            translationY.value = 0;
        });
    const zoomGesture = Gesture.Pinch()
        .onStart(() => {
            startScale.value = scale.value;
        })
        .onUpdate((event) => {
            scale.value = startScale.value * event.scale < 1 ?
                1 : startScale.value * event.scale;

        });

    const composed = Gesture.Simultaneous(
        dragGesture, Gesture.Exclusive(doubleTap, singleTap),
        Gesture.Simultaneous(zoomGesture)
    );

    const showToast = () => {
        Toast.show({
            type: 'tomatoToast',
            position: 'top',
            topOffset: 200
        });
    };
    const toastConfig = {
        tomatoToast: () => (
            <View style={{ borderRadius: 10, alignItems: 'center', height: 100, padding: 10, margin: 'auto', width: '80%', backgroundColor: 'tomato' }}>
                <Text style={{ lineHeight: 80, fontSize: 27, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>
                    Path deleted
                </Text>
            </View>
        )
    };

    return (
        <View style={styles.mainBlock}>
            <Text style={styles.data}>
                {Path_date(date)} , {imagefilename[0]}
            </Text>
            <View style={{ overflow: 'hidden', height: +height, width: width }}>
                <GestureHandlerRootView >
                    <GestureDetector gesture={composed}>
                        <Animated.Image
                            style={[styles.image, animatedStyles, { height: +height, opacity: result ? 0.3 : 1 }]}
                            source={{ uri: uri }}
                            resizeMode='stretch'
                        />
                    </GestureDetector>
                </GestureHandlerRootView>
            </View>
            <LinearGradient
                style={styles.btnDelete}
                colors={['#4c669f', '#3b5998', '#192f6a']}
            >
                <TouchableOpacity disabled={result} onPress={Delete}>
                    <Text style={styles.delete_text}>
                        {result ? 'Deleted' : 'DELETE'}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
            <Toast
                position='bottom'
                bottomOffset={120}
                config={toastConfig}
                onHide={() => router.push('/')}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    mainBlock: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        flex: 1,
        paddingVertical: 5
    },
    image: {
        width: '100%'
    },
    data: {
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,
        fontFamily: 'SpaceMono'
    },
    btnDelete: {
        width: '98%',
        borderRadius: 28,
        height: 50
    },
    delete_text: {
        textAlign: 'center',
        fontSize: 25,
        color: '#fff',
        lineHeight: 50,
        
    }
})
export default Modal;