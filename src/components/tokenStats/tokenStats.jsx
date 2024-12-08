import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './tokenStats.module.css';
import TokenizedAssetBondingCurve from '../../TokenizedAsset/simpleToken.js';

import TokenOverview from '../tokenOverview/TokenOverview.jsx';

const TokenStatsDashboard = () => {
    const [priceHistory, setPriceHistory] = useState([]);
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [input, setInput] = useState('');
    const [sellInput, setSellInput] = useState('');
    const [token, setToken] = useState(null);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLineChart, setIsLineChart] = useState(false); // State to toggle chart type

    // Using useRef to hold intervalId
    const intervalIdRef = useRef(null);
    const lastTradeTypeRef = useRef(''); // useRef instead of useState
    useEffect(() => {
        const _token = new TokenizedAssetBondingCurve();
        setToken(_token);
        setLoading(false);
    }, []);

    useEffect(() => {
        console.log('Price History:', priceHistory);
    }, [priceHistory]);

    const priceChart = (
        <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00FF00" />
            <XAxis dataKey="timestamp" stroke="#00FF00" />
            <YAxis
                stroke="#00FF00"
                tickFormatter={(value) => value.toFixed(4)} // Show 4 decimal places
            />

            <Tooltip
                contentStyle={{
                    backgroundColor: 'black',
                    borderColor: '#00FF00',
                    color: '#00FF00'
                }}
            />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="white" activeDot={{ r: 8 }} />
        </LineChart>
    );

    const handleTrade = (tradeType, amount) => {
        if (!amount || isNaN(amount) || amount <= 0) return; // Avoid invalid inputs

        // Update the ref directly to track the trade type
        lastTradeTypeRef.current = tradeType;

        // Get the current price before the trade
        const currentPrice = token.priceManager.currentPrice;

        const newTrade = {
            name: `Trade ${tradeHistory.length + 1}`,
            type: tradeType,
            amount: amount,
            buyAmount: tradeType === 'buy' ? amount : 0,
            sellAmount: tradeType === 'sell' ? amount : 0,
            price: currentPrice,
            timestamp: new Date().toISOString() // Add timestamp for better tracking
        };

        // Directly call the buy or sell method on the token
        if (tradeType.toLowerCase() === 'buy') {
            token.buyTokens(amount);
        } else {
            token.sellTokens(amount);
        }

        // Update price history
        const updatedPriceHistory = token.getPriceHistory().map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp).toLocaleTimeString()
        }));
        setPriceHistory(updatedPriceHistory);

        // Update trade history (last 20 trades)
        setTradeHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newTrade];
            return updatedHistory.slice(-20); // Keep last 20 trades
        });

        setLoading(false);
    };

    const startTradeSimulation = () => {
        if (simulationRunning) return;

        setSimulationRunning(true);
        intervalIdRef.current = setInterval(() => {
            let tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
            let amount = Math.floor(Math.random() * 1000) + 50;
            handleTrade(tradeType, amount);
        }, 300); // 300ms interval
    };

    const pauseSimulation = () => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
            setSimulationRunning(false);
        }
    };

    const totalTradeStats = useMemo(() => {
        return tradeHistory.reduce((acc, trade) => {
            acc.totalTrades++;
            if (trade.type === 'buy') {
                acc.buyTrades++;
                acc.totalBuyAmount += trade.amount;
            } else {
                acc.sellTrades++;
                acc.totalSellAmount += trade.amount;
            }
            return acc;
        }, {
            totalTrades: 0,
            buyTrades: 0,
            sellTrades: 0,
            totalBuyAmount: 0,
            totalSellAmount: 0
        });
    }, [tradeHistory]);

    const latestTrade = tradeHistory[tradeHistory.length - 1];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                INITIALIZING TOKEN ANALYSIS SYSTEM...
            </div>
        );
    }

    const toggleChartType = () => {
        setIsLineChart(prevState => !prevState);
    };

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
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>TOKEN ANALYSIS DASHBOARD</h1>
                <div>{new Date().toLocaleString()}</div>
            </div>
            <div className={styles.gridContainer}>
                {/* Token Overview Panel */}
                <TokenOverview
                    name={token.name}
                    price={token?.getPrice()}
                    latestPrice={token.getPrice()}
                    lastTradeType={lastTradeTypeRef.current}
                />
                {/* Trade Activity Panel */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>Trade Activity</h2>
                    </div>
                    <div className={styles.panelContent}>
                        <div className={styles.statRow}>
                            <span>Total Trades:</span>
                            <span>{totalTradeStats.totalTrades}</span>
                        </div>
                        <div className={styles.statRow}>
                            <span>Buy Trades:</span>
                            <span className={styles.buyTrades}>{totalTradeStats.buyTrades}</span>
                        </div>
                        <div className={styles.statRow}>
                            <span>Sell Trades:</span>
                            <span className={styles.sellTrades}>{totalTradeStats.sellTrades}</span>
                        </div>
                    </div>
                </div>

                {/* Trade Volume Panel */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>Trade Volume</h2>
                    </div>
                    <div className={styles.panelContent}>
                        <div className={styles.statRow}>
                            <span>Total Buy Volume:</span>
                            <span className={styles.buyTrades}>{totalTradeStats.totalBuyAmount}</span>
                        </div>
                        <div className={styles.statRow}>
                            <span>Total Sell Volume:</span>
                            <span className={styles.sellTrades}>{totalTradeStats.totalSellAmount}</span>
                        </div>
                    </div>
                </div>

                {/* Trade Input Panel */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>Buy / Sell</h2>
                    </div>
                    <div className={styles.panelContent}>
                        <div className={styles.statRow}>
                            <input
                                type="number"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter amount to buy"
                            />
                            <span className={styles.buyTrades}>
                                <button onClick={() => {
                                    handleTrade('buy', parseFloat(input));

                                }}>BUY</button>
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <input
                                type="number"
                                value={sellInput}
                                onChange={(e) => setSellInput(e.target.value)}
                                placeholder="Enter amount to sell"
                            />
                            <span className={styles.sellTrades}>
                                <button onClick={() => {
                                    handleTrade('sell', parseFloat(sellInput));

                                }}>SELL</button>
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span className={styles.sellTrades}>
                                <button onClick={startTradeSimulation}>Start Simulation</button>
                            </span>
                            <span className={styles.sellTrades}>
                                <button onClick={pauseSimulation}>Pause Simulation</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Chart Section */}
            <div className={styles.priceChartPanel}>
                <div className={styles.panelHeader}>
                    <h2>Price History</h2>
                </div>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={300}>
                        {priceChart}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Trade History Chart */}
            <div className={styles.chartPanel}>
                <div className={styles.panelHeader}>
                    <h2>Trade History</h2>
                </div>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={100}>
                        {chart}
                    </ResponsiveContainer>
                    <div className={styles.chartTypeToggle}>
                        <button onClick={toggleChartType} className={styles.toggleButton}>
                            Switch to {isLineChart ? 'Bar Chart' : 'Line Chart'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                SYSTEM STATUS: ONLINE
            </div>
        </div>
    );
};

export default TokenStatsDashboard;
