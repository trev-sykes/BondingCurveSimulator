export default class Helpers {
    simulateMarketTrend() {
        const trends = [-1, 0, 1];
        return trends[Math.floor(Math.random() * trends.length)];
    }

    calculateTradeProbability(marketTrend) {
        const baseProbability = 0.5;
        const trendMultipliers = { '-1': 0.3, '0': 0.5, '1': 0.7 };
        return baseProbability * trendMultipliers[marketTrend];
    }


    determineTrade(marketTrend) {
        const buyBias = {
            '-1': 0.3,  // bearish
            '0': 0.5,   // neutral
            '1': 0.7    // bullish
        };
        return Math.random() < buyBias[marketTrend] ? 'buy' : 'sell';
    }
    calculateTradeAmount(tradeType, currentPrice) {
        // Ensure the tradeType is either 'buy' or 'sell'
        if (!['buy', 'sell'].includes(tradeType)) {
            throw new Error(`Invalid tradeType: ${tradeType}. Expected 'buy' or 'sell'.`);
        }

        // Get a valid market trend (either -1, 0, or 1)
        const marketTrend = this.simulateMarketTrend();
        if (![-1, 0, 1].includes(marketTrend)) {
            throw new Error(`Invalid marketTrend: ${marketTrend}. Expected -1, 0, or 1.`);
        }

        const baseVolume = 10;
        const volumeVariance = currentPrice / 100;
        const trendMultipliers = {
            'buy': { '-1': 0.5, '0': 1, '1': 1.5 },
            'sell': { '-1': 1.5, '0': 1, '1': 0.5 }
        };

        // Calculate trade amount with trend multiplier based on the market trend
        return Math.floor(
            baseVolume *
            trendMultipliers[tradeType][marketTrend] *
            (1 + Math.random() * volumeVariance)
        );
    }

}