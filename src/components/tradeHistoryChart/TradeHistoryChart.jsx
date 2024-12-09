import { useState } from "react";
import styles from "./tradeHistoryChart.module.css";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TradeHistoryChart = ({ tradeHistory, toggleChartType }) => {
    const [isLineChart, setIsLineChart] = useState(false); // State to toggle chart type

    const chart = isLineChart ? (
        <LineChart data={tradeHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00FF00" />
            <XAxis dataKey="name" stroke="#00FF00" />
            <YAxis stroke="#00FF00" />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'black',
                    borderColor: '#00FF00',
                    color: '#00FF00'
                }}
            />
            <Legend />
            <Line type="monotone" dataKey="buyAmount" stroke="green" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="sellAmount" stroke="red" activeDot={{ r: 8 }} />
        </LineChart>
    ) : (
        <BarChart data={tradeHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00FF00" />
            <XAxis dataKey="name" stroke="#00FF00" />
            <YAxis stroke="#00FF00" />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'black',
                    borderColor: '#00FF00',
                    color: '#00FF00'
                }}
            />
            <Legend />
            <Bar dataKey="buyAmount" fill="green" stackId="a" />
            <Bar dataKey="sellAmount" fill="red" stackId="a" />
        </BarChart>
    );
    return (
        <div className={styles.chartPanel}>
            <div className={styles.panelHeader}>
                <h2>Volume</h2>
            </div>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={100}>
                    {chart}
                </ResponsiveContainer>
                {/* <div className={styles.chartTypeToggle}>
                    <button onClick={toggleChartType} className={styles.toggleButton}>
                        Switch to {isLineChart ? 'Bar Chart' : 'Line Chart'}
                    </button>
                </div> */}

            </div>
        </div>
    )
}

export default TradeHistoryChart;
