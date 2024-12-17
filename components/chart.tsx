import {  Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
const { width } = Dimensions.get("window")

export default function Chart({ new_data, new_labels , interval}) {

    console.log(new_labels)

    function labelSec(i) {
        console.log(new_labels)
        const s = (Math.trunc(i*interval/60000) === 0 ? '': Math.round(i*interval/60000)) 
        return s
    }
    
    return (
       <ScrollView horizontal>
            <LineChart
                data={{
                    labels: new_labels,
                    datasets: [
                        {
                            data: new_data
                        }
                    ]
                }}
                width={width*Math.ceil(new_labels.length/16)} // from react-native
                height={300}
                fromZero
                xLabelsOffset={5} 
                yLabelsOffset={15}
                formatXLabel={(i)=> i} 
                withShadow={false}                        
                chartConfig={{ 
                    
                                      
                    backgroundGradientFrom: "#ff77ff",
                    backgroundGradientTo: "#ff7770",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(10, 10, 10, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForHorizontalLabels: {fontSize: 16, fontWeight: 'bold'},
                    
                   
                    propsForDots: {
                        r: "7",
                        strokeWidth: "2",
                        stroke: "blue",
                        
                    }
                }}
                

                style={{
                    margin: 8,
                    borderRadius: 10,
                    
                }}
            />
        </ScrollView>
    )
}