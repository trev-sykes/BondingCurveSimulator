export default class PriceManager {
    constructor(maxHistoryLength, initialPrice, scalingFactor, totalSupply, seedAmount,) {

        this.MAX_HISTORY_LENGTH = maxHistoryLength;
        this.priceHistory = [];

        this.scalingFactor = scalingFactor;
        this.initialPrice = initialPrice;
        this.currentPrice = this.initialPrice;
        this.currentSupply = seedAmount;
        this.totalSupply = totalSupply;
        this.highestPrice = initialPrice;
        this.numberOfTokensAtHighestPrice = 0;
    }
    _calculatePrice() {
        return this.initialPrice + Math.log(this.scalingFactor * this.currentSupply + 1);
    }

    updatePrice(action, amount) {
        console.log(`Action: ${action}, Amount: ${amount}`);

        const oldPrice = this.currentPrice;
        const oldSupply = this.currentSupply;
        const netAmount = action === 'buy' ? amount : -amount;
        console.log(`Old Supply: ${oldSupply}`);
        this.currentSupply += netAmount;
        console.log(`New Supply: ${this.currentSupply}`);
        this.currentPrice = this._calculatePrice();
        const priceChange = this.currentPrice - oldPrice;
        const percentChange = (priceChange / oldPrice) * 100;
        console.log("Price change", priceChange);
        console.log("Precent change", percentChange)

        this._adjustScalingFactor(amount, action);
        this._updateHighestPrice(this.currentPrice);
        this._logPriceChange(oldPrice, oldSupply, this.currentPrice, this.currentSupply, priceChange, percentChange);
        console.log(`Old Price: ${oldPrice}, New Price: ${this.currentPrice}`);

        return this.currentPrice;
    }

    updatePriceHistory(currentPrice) {
        this.priceHistory.push({
            timestamp: new Date(),
            price: currentPrice
        });

        // Correct length check
        if (this.priceHistory.length > this.MAX_HISTORY_LENGTH) {
            this.priceHistory.shift();
        }

        return this.priceHistory;
    }
    _logPriceChange(oldPrice, oldSupply, newPrice, newSupply, priceChange, percentChange) {
        console.log(`Price Dynamics:
                        Old Price : ${oldPrice.toFixed(2)}
                        Old Supply: ${oldSupply.toFixed(0)}
                        Current Price:$${newPrice.toFixed(2)}
                        Current Supply: ${newSupply.toFixed(0)}
                        Change: $${priceChange.toFixed(2)}
                        Percent Change: ${percentChange.toFixed(2)}%`);
    }
    _updateHighestPrice(newPrice) {
        if (newPrice > this.highestPrice) {
            this.highestPrice = newPrice;
            this.numberOfTokensAtHighestPrice = this.currentSupply;
        }
    }
    _adjustScalingFactor(amount, action) {
        // More controlled scaling factor adjustment
        const baseAdjustment = 0.1;
        const adjustment = action === 'buy' ? baseAdjustment * amount : -baseAdjustment * amount;

        // Prevent scaling factor from becoming negative
        this.scalingFactor = Math.max(1, this.scalingFactor + adjustment);
    }


}