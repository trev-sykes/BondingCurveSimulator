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
    const [isReadingMore, setIsReadingMore] = useState(false);  // Track whether the popup is visible or not
    const minPrice = Math.min(...priceHistory.map(item => item.price));
    const maxPrice = Math.max(...priceHistory.map(item => item.price));

    const handleReadMore = (state) => {
        setIsReadingMore(state);  // Toggle the state
    }

    const priceChart = (
        <LineChart
            width={800}
            height={400}
            data={priceHistory}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
            {/* Grid with more subtle coloring */}
            <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2C3E50"
                fill="#1C2833"
                fillOpacity={0.1}
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
                formatter={(value, name, props) => [
                    value.toFixed(4),
                    name === 'price' ? 'Price' : name
                ]}
            />

            {/* Legend with better positioning */}
            <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
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

            {/* Optional Brush for zooming and panning */}
            <Brush
                dataKey="timestamp"
                height={30}
                stroke="#00FF00"
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
