import Helpers from "./Helpers.js";
export default class ActivityManager {
    constructor(token, priceManager, tradeRun, logger) {
        this.token = token;
        this.helpers = new Helpers();
        this.logger = logger;
        this.priceManager = priceManager;
        this.TRADE_RUN = tradeRun;
    }
    startTradingActivity() {
        let tradeCount = 0;
        this.tradingInterval = setInterval(() => {
            if (tradeCount >= this.TRADE_RUN) {
                clearInterval(this.tradingInterval);
                this.logger.logTradeRunEnd();
                return;
            }
            const marketTrend = this.helpers.simulateMarketTrend();
            const tradeProbability = this.helpers.calculateTradeProbability(marketTrend);
            if (Math.random() < tradeProbability) {
                const tradeType = this.helpers.determineTrade(marketTrend);
                console.log("THIS TRADE TYPE: ", tradeType);
                const tradeAmount = this.helpers.calculateTradeAmount(tradeType, this.priceManager.currentPrice);
                console.log("Trade amount: ", tradeAmount);
                if (tradeCount > 5) {
                    tradeType === 'buy'
                        ? this.token.buyTokens(tradeAmount)
                        : this.token.sellTokens(tradeAmount);
                } else {
                    this.token.buyTokens(tradeAmount);
                }
            }
            tradeCount++;
        }, 100);
    }

}