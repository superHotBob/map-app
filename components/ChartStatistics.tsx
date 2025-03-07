import { Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
const { width } = Dimensions.get("window");


export default function ChartStatistics({ data, labels }) {    
    const fromN =   Math.max(...data) === -Infinity ? 10 : Math.max(...data) < 5 ? 5 : Math.max(...data)
    labels = labels.map(i=> i.includes(':') ? i: Math.round(i) )
    
    return (
        <BarChart
            data={{
                labels: labels,                
                datasets: [{data: data}]                
            }}
            width={width - 20} // from react-native
            height={200}
            fromZero
            xLabelsOffset={10}
            withInnerLines={false}
            yLabelsOffset={15}
            fromNumber={+fromN}            
            yAxisInterval={1} 
            showValuesOnTopOfBars={true}
            showBarTops={true}
            chartConfig={{
                barPercentage: data.length > 10 ? 0.2 : 0.5,
                backgroundGradientFrom: "#ff77ff",
                backgroundGradientTo: "#2196F3",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: () => `#810511`,
                labelColor: (opacity = 1) => `rgba(243, 33, 54, ${opacity})`,
                propsForHorizontalLabels: { fill: 'red', fontSize: 14, fontWeight: 'bold' },
                propsForVerticalLabels: { translateY: -10, fill: 'red', fontSize: 14, fontWeight: 'bold' }            
            }}
            style={{borderRadius: 10, marginTop: 10}}
        />

    )
}