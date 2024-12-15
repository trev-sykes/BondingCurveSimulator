import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from './tokenStats.module.css';
import TokenizedAssetBondingCurve from '../../TokenizedAsset/Token.js';

import TradeActiviy from '../tradeActivity/TradeActivity.jsx';
import TradeVolume from "../tradeVolume/TradeVolume.jsx";
import TokenOverview from '../tokenOverview/TokenOverview.jsx';
import PriceChart from '../priceChart/PriceChart.jsx';
import TradeHistoryChart from "../tradeHistoryChart/TradeHistoryChart.jsx";

const TokenStatsDashboard = () => {
    const [priceHistory, setPriceHistory] = useState([]);
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [token, setToken] = useState(null);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [loading, setLoading] = useState(true);

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
            return updatedHistory; // Keep last 20 trades
        });

        setLoading(false);
    };

    const startTradeSimulation = () => {
        if (simulationRunning) return;

        setSimulationRunning(true);
        intervalIdRef.current = setInterval(() => {
            let tradeType = Math.random() > 0.41 ? 'buy' : 'sell';
            let amount = Math.floor(Math.random() * 100) + 1;

            handleTrade(tradeType, amount);
        }, 550); // 300ms interval
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


    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                INITIALIZING TOKEN ANALYSIS SYSTEM...
            </div>
        );
    }
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
                    token={token}
                />
                {/* Trade Activity Panel */}
                <TradeActiviy totalTradeStats={totalTradeStats} lastTradeType={lastTradeTypeRef} />
                {/* Trade Volume Panel */}
                <TradeVolume totalTradeStats={totalTradeStats} token={token} />
            </div>
            {/* Price Chart Section */}
            <PriceChart priceHistory={priceHistory} startTradeSimulation={startTradeSimulation} pauseSimulation={pauseSimulation} token={token} />


            {/* Trade History Chart */}
            <TradeHistoryChart tradeHistory={tradeHistory} />

            <div className={styles.footer}>
                SYSTEM STATUS: ONLINE
            </div>
        </div>
    );
};

export default TokenStatsDashboard;
