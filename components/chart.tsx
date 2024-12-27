import {  Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
const { width } = Dimensions.get("window")

export default function Chart({ new_data, new_labels }) { 

    
    return (
       <ScrollView horizontal>
            <LineChart
                data={{
                    labels: new_labels.flat(),
                    datasets: [
                        {
                            data: new_data
                        }
                    ]
                }}
                width={width*Math.ceil(new_labels.flat().length/10)} // from react-native
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