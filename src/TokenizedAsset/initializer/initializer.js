
export default class Initializer {
    constructor(tokenName, initialSupply, scalingFactor) {
        this.tokenName = tokenName;
        this.initialSupply = initialSupply;
        this.scalingFactor = scalingFactor;
        this.totalSupply = initialSupply; // Explicitly set total supply
    }
    initializePrice() {
        // Ensure consistent calculation and return
        const initialPrice = Math.log(this.scalingFactor * this.initialSupply + 1);
        this._logInitialState(initialPrice.toFixed(2), this.initialSupply, this.scalingFactor);
        return initialPrice;
    }
    _logInitialState(initialPrice, initialSupply, scalingFacor) {
        const initialPriceMessage = `Initial Price for new token, ${this.tokenName}, is ${initialPrice} with a seed supply of ${initialSupply} and a scaling factor of ${scalingFacor}`;
        console.log(initialPriceMessage);
        console.log(`Initial Token State:
        Name: ${this.tokenName}
        Price: $${initialPrice}
        Total Supply: ${this.totalSupply}
        Scaling Factor: ${this.scalingFactor}`);
    }
}