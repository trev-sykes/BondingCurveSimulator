export const bondingCurves = {
    lin: (initialPrice, scalingFactor, currentSupply) => {
        return initialPrice + (scalingFactor * currentSupply);
    },
    log: (initialPrice, scalingFactor, currentSupply) => {
        return initialPrice + Math.log(scalingFactor * currentSupply + 1);
    },
};


export default class PriceManager {
    constructor(maxHistoryLength, scalingFactor, totalSupply, seedAmount) {

        this.MAX_HISTORY_LENGTH = maxHistoryLength;
        this.priceHistory = [];
        this.bondingCurves = bondingCurves;
        this.currentPriceModel = this.bondingCurves.log;
        this.scalingFactor = scalingFactor;
        this.initialPrice = Math.log(scalingFactor * seedAmount + 1);
        this.currentPrice = this.initialPrice;
        this.currentSupply = seedAmount;
        this.totalSupply = totalSupply;
        this.totalDebted = 0;
        this.highestPrice = this.initialPrice;
        this.numberOfTokensAtHighestPrice = 0;
    }

    _calculatePrice(action) {
        if (action.toLowerCase() == 'buy')
            return this.currentPriceModel(this.initialPrice, this.scalingFactor, this.currentSupply);
        else
            return this.currentPriceModel(this.initialPrice, this.scalingFactor, this.currentSupply);
    }
    changePriceModel(option) {
        let l = this.bondingCurves[option];
        this.currentPriceModel = l;
    }

    updatePrice(action, amount) {
        if (this.totalDebted > 0 && action == 'buy') {
            this.totalDebted -= amount;
            return this.price;
        }
        if (action.toLowerCase() == 'buy' && this.currentSupply + amount > this.totalSupply) {
            return this.currentPrice;
        }
        if (this.currentSupply - amount <= 0) {
            this.totalDebted += amount;
            return this.currentPrice + 1;
        }
        console.log(`Action: ${action}, Amount: ${amount}`);
        const oldPrice = this.currentPrice;
        const oldSupply = this.currentSupply;
        const netAmount = action === 'buy' ? amount : -amount;
        this.currentSupply += netAmount;
        this.currentPrice = this._calculatePrice(action);
        const priceChange = this.currentPrice - oldPrice;
        const percentChange = (priceChange / oldPrice) * 100;

        this._adjustScalingFactor(amount, action);
        this._updateHighestPrice(this.currentPrice);
        this._updatePriceHistory(this.currentPrice);
        this._logPriceChange(oldPrice, oldSupply, this.currentPrice, this.currentSupply, priceChange, percentChange);
        return this.currentPrice;
    }

    _updatePriceHistory(currentPrice) {
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

