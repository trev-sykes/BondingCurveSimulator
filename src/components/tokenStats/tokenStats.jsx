import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './tokenStats.module.css';
import TokenizedAssetBondingCurve from '../../TokenizedAsset/tokenizedAsset.js';

const TokenStatsDashboard = () => {
    const [input, setInput] = useState('');
    const [sellInput, setSellInput] = useState('');
    const [tokenState, setTokenState] = useState(null);
    const [token, setToken] = useState(null);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLineChart, setIsLineChart] = useState(false); // State to toggle chart type

    useEffect(() => {
        const _token = new TokenizedAssetBondingCurve();
        setToken(_token);
        setLoading(false);
    }, []);

    const handleTrade = (tradeType, amount) => {
        if (!amount || isNaN(amount) || amount <= 0) return; // Avoid invalid inputs

        const newTrade = {
            name: `Trade ${tradeHistory.length + 1}`,
            type: tradeType,
            amount: amount,
            buyAmount: tradeType === 'buy' ? amount : 0,
            sellAmount: tradeType === 'sell' ? amount : 0
        };

        // Directly call the buy or sell method on the token
        if (tradeType.toLowerCase() === 'buy') {
            token.buyTokens(amount);
        } else {
            token.sellTokens(amount);
        }

        setTradeHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newTrade];
            return updatedHistory.slice(-20); // Keep last 20 trades
        });
        setLoading(false);
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

    // Toggle chart type between BarChart and LineChart
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
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>Token Overview</h2>
                    </div>
                    <div className={styles.panelContent}>
                        <div className={styles.statRow}>
                            <span>Name:</span>
                            <span>{token?.name || 'Unknown'}</span>
                        </div>
                        <div className={styles.statRow}>
                            <span>Latest Trade Price:</span>
                            <span>
                                {latestTrade
                                    ? `$${latestTrade.price}`
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span>Latest Trade Type:</span>
                            <span className={
                                latestTrade?.type === 'buy'
                                    ? styles.buyTrades
                                    : styles.sellTrades
                            }>
                                {latestTrade?.type || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

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
                            <span className={styles.buyTrades}>
                                {totalTradeStats.buyTrades}
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span>Sell Trades:</span>
                            <span className={styles.sellTrades}>
                                {totalTradeStats.sellTrades}
                            </span>
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
                            <span className={styles.buyTrades}>
                                {totalTradeStats.totalBuyAmount}
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span>Total Sell Volume:</span>
                            <span className={styles.sellTrades}>
                                {totalTradeStats.totalSellAmount}
                            </span>
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
                                <button onClick={() => handleTrade('buy', parseFloat(input))}>BUY</button>
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
                                <button onClick={() => handleTrade('sell', parseFloat(sellInput))}>SELL</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toggle Button to switch between chart types */}
            <div className={styles.chartTypeToggle}>
                <button onClick={toggleChartType} className={styles.toggleButton}>
                    Switch to {isLineChart ? 'Bar Chart' : 'Line Chart'}
                </button>
            </div>

            {/* Trade History Chart */}
            <div className={styles.chartPanel}>
                <div className={styles.panelHeader}>
                    <h2>Trade History</h2>
                </div>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={300}>
                        {chart}
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.footer}>
                SYSTEM STATUS: ONLINE
            </div>
        </div>
    );
};

export default TokenStatsDashboard;
