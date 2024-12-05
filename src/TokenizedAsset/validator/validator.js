export default class Validator {
    constructor(initialPrice, maxHistory, scalingFactor) {
        this.isValidated = false;
        this.validateConstructorParams(initialPrice, maxHistory, scalingFactor);
    }
    validateConstructorParams(initialPrice, maxHistory, scalingFactor) {
        console.log(`Type of initialPrice ${typeof (initialPrice)}`);
        console.log(`Type of maxHistory ${typeof (maxHistory)}`);
        console.log(`Type of scalingFactor ${typeof (scalingFactor)}`);
        if (typeof initialPrice !== 'number' || initialPrice <= 0) {
            throw new Error("Initial price must be a positive number");
        }
        if (!Number.isInteger(maxHistory) || maxHistory <= 0) {
            throw new Error("Max history must be a positive integer");
        }
        if (typeof scalingFactor !== 'number' || scalingFactor <= 0) {
            throw new Error("Scaling factor must be a positive number");
        }
        this.isValidated = true;
    }
    validateTradeAmount(amount) {
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error("Trade amount must be a positive number");
        }
    }
    validateSellAmount(totalSupply, amount) {
        if (totalSupply - amount < 0) {
            throw new Error("Insufficient token supply for sell operation");
        }
    }
}