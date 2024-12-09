import PriceManager from "./priceManager/simplePriceManager.js";



export default class TokenizedAssetBondingCurve {

    constructor(name = 'Bitcoin', totalSupply = 21000000, seedAmount = 10000, maxHistory = 2016, scalingFactor = 9, burnMultiplier = 0.03, volumeWindow = 2016, options = {}, tradeRun = 10000) {
        this.name = name;
        this.priceManager = options.priceManager || new PriceManager(maxHistory, scalingFactor, totalSupply, seedAmount);
    }
    _processTrade(action, amount) {
        console.log("Trade Start");
        this.priceManager.updatePrice(action, amount);
        let _action = action == 'buy' ? 'BUY' : 'SELL';
        console.log("Trade Complete");
    }

    buyTokens(amount) {
        this._processTrade('buy', amount);
    }

    sellTokens(amount) {
        this._processTrade('sell', amount);
    }
    changePriceModel(option) {
        this.priceManager.changePriceModel(option);
    }
    getPriceHistory() {
        return [...this.priceManager.priceHistory];
    }

    getPrice() {
        return this.priceManager.currentPrice;
    }
    getBondingTokens() {
        return this.priceManager.bondingCurves;
    }

    getTokenState() {

        return {
            initialPrice: this.priceManager.initialPrice,
            currentPrice: this.priceManager.currentPrice,
            currentSupply: this.priceManager.currentSupply,
            totalSupply: this.priceManager.totalSupply,
            highestPrice: this.priceManager.highestPrice,
            scalingFactor: this.priceManager.scalingFactor
        };
    }
}