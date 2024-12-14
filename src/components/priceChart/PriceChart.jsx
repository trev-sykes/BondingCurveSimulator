import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Brush } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import styles from "./priceChart.module.css";
import PriceModelPopup from './priceActionInformation/PriceActionInformation';
import {
    Play,
    Pause,
    Settings,
    TrendingUp,
    CircleHelp
} from 'lucide-react';

const PriceChart = ({ priceHistory, startTradeSimulation, pauseSimulation, token }) => {
    const [isReadingMore, setIsReadingMore] = useState(true);  // Track whether the popup is visible or not
    const minPrice = Math.min(...priceHistory.map(item => item.price));
    const maxPrice = Math.max(...priceHistory.map(item => item.price));

    const handleReadMore = (state) => {
        setIsReadingMore(state);  // Toggle the state
    }

    // Calculate price change percentage function
    const calculatePriceChangePercentage = (index) => {
        // Check if priceHistory has enough data to avoid accessing undefined elements
        if (!priceHistory || priceHistory.length === 0 || !priceHistory[index] || !priceHistory[index - 1]) {
            return 0; // Return 0 if there's no previous data to compare to
        }

        const previousPrice = priceHistory[index - 1].price;
        const currentPrice = priceHistory[index].price;

        if (previousPrice === 0) return 0; // Avoid division by zero

        // Correct price change calculation
        return ((currentPrice - previousPrice) / previousPrice) * 100;
    };

    const priceChart = (
        <LineChart
            width={800}
            height={350}
            data={priceHistory}
            margin={{ top: 10, right: 30, left: 20, bottom: 50 }}
        >
            {/* Grid with more subtle coloring */}
            <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2C3E50"
                fill="#1C2833"
                fillOpacity={0.75}
            />
            <Brush
                dataKey="timestamp"
                height={10}
                stroke="#aaaaaa"
            />

            {/* X-Axis with rotated labels for better readability */}
            <XAxis
                dataKey="timestamp"
                stroke="#00FF00"
                angle={-45}
                textAnchor="end"
                interval="preserveStartEnd"
                padding={{ left: 20, right: 20 }}
            />

            {/* Y-Axis with more precise formatting */}
            <YAxis
                stroke="#00FF00"
                domain={[
                    Math.floor(minPrice - (maxPrice - minPrice) * 0.1),
                    Math.ceil(maxPrice + (maxPrice - minPrice) * 0.1)
                ]}
                tickFormatter={(value) => value.toFixed(2)}
            />

            {/* Reference Line for Average Price */}
            <ReferenceLine
                y={priceHistory.reduce((sum, item) => sum + item.price, 0) / priceHistory.length}
                label="Average Price"
                stroke="#FF4500"
                strokeDasharray="3 3"
            />

            {/* Enhanced Tooltip with more information */}
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    borderColor: '#00FF00',
                    color: '#00FF00'
                }}
                formatter={(value, name, props) => {
                    const index = props.index;
                    const priceChangePercentage = calculatePriceChangePercentage(index);

                    return [
                        `${value.toFixed(4)} ${name === 'price' ? 'Price' : name}`,
                        `Price Change: ${priceChangePercentage.toFixed(2)}%`
                    ];
                }}
            />

            {/* Legend showing the current price */}
            <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={(value, entry, index) => {
                    // Get the current price (last price in the array)
                    const currentPrice = priceHistory[priceHistory.length - 1]?.price;
                    return currentPrice ? `Current Price: $${currentPrice.toFixed(2)}` : 'No Data';
                }}
            />

            {/* Main Price Line with more dynamic styling */}
            <Line
                type="monotone"
                dataKey="price"
                stroke="white"
                strokeWidth={2}
                dot={{ stroke: '#00FF00', strokeWidth: 2, r: 4 }}
                activeDot={{
                    stroke: '#FF4500',
                    strokeWidth: 3,
                    r: 6
                }}
            />
        </LineChart>
    );

    // State to track the selected bonding curve
    const [selectedCurve, setSelectedCurve] = useState('lin');

    // Handle change of the selected bonding curve
    const handleCurveChange = (e) => {
        console.log("e=", e.target.value);
        setSelectedCurve(e.target.value);
        token.changePriceModel(e.target.value);
    };

    // Map curve keys to human-readable names for display
    const curveNames = {
        lin: 'Linear Curve',
        log: 'Logarithmic Curve',
    };

    return (
        <div className={styles.priceChartPanel}>
            <div className={styles.panelHeader}>
                <h2>Bonding Curve Price Simulator
                    <span className={styles.span}><TrendingUp /></span>

                    <span className={`${styles.readMore}`}>
                        <CircleHelp
                            onClick={() => handleReadMore(true)}
                            width={20}
                            color='white'
                        />
                    </span>
                </h2>
            </div>

            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                    {priceChart}
                </ResponsiveContainer>
            </div>

            <div className={styles.statRow}>
                <Play
                    className={styles.startSimBtn}
                    onClick={startTradeSimulation}
                    aria-label="Start the trade simulation"
                >
                    Start Simulation
                </Play>

                <div className={styles.selectContainer}>
                    {/* <select> or other controls can go here */}
                </div>

                <Pause
                    className={styles.pauseSimBtn}
                    onClick={pauseSimulation}
                    aria-label="Pause the simulation"
                >
                    Pause Simulation
                </Pause>
                <Settings />
            </div>

            {/* Conditionally render the PriceModelPopup based on isReadingMore */}
            {isReadingMore && <PriceModelPopup setVisibility={setIsReadingMore} />}
        </div>
    );
};

export default PriceChart;
