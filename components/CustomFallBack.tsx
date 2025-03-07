import { View, Text, Button } from 'react-native';

const CustomFallback = (props: { error: Error, resetError: Function }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>Error</Text>
        <Text style={{ width: '80%', marginVertical: 20, fontSize: 20 }}>{props.error.toString()}</Text>
        <Button title='back' onPress={() => props.resetError()} />
    </View>
)
export default CustomFallback