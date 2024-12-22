import PriceManager from "./priceManager/priceManager.js";



export default class TokenizedAssetBondingCurve {

    constructor(name = 'Default Token', totalSupply = 21000000, seedAmount = 10000, maxHistory = 2016, scalingFactor = 9, options = {}) {
        this.name = name;
        this.priceManager = options.priceManager || new PriceManager(maxHistory, scalingFactor, totalSupply, seedAmount);
    }
    _processTrade(action, amount) {
        console.log("Trade Start");
        this.priceManager.updatePrice(action, amount);
        console.log("Trade Complete")
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

    getTokenState() {

        return {
            initialPrice: this.priceManager.initialPrice,
            initialSupply: this.priceManager.initialSupply,
            currentPriceModel: this.priceManager.currentPriceModel,
            currentPrice: this.priceManager.currentPrice,
            currentSupply: this.priceManager.currentSupply,
            totalSupply: this.priceManager.totalSupply,
            highestPrice: this.priceManager.highestPrice,
            scalingFactor: this.priceManager.scalingFactor
        };
    }
}