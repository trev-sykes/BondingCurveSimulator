import ActivityManager from "./activityManager/activityManager.js";
import Initializer from "./initializer/initializer.js";
import Logger from "./logger/logger.js";
import PriceManager from "./priceManager/priceManager.js";
import VolumeManager from "./volumeManager/volumeManager.js"
import Validator from "./validator/validator.js";


/**
 * @title TokenizedAssetBondingCurve
 * @notice A comprehensive token management system implementing a dynamic bonding curve mechanism
 * @dev Manages token issuance, burning, pricing, and trading activities with multiple specialized managers
 * 
 * @notice The bonding curve allows for dynamic token pricing based on supply and market interactions
 * @notice Implements advanced features like volume tracking, token burning, and activity simulation
 * 
 * @param {Object} options - Comprehensive configuration options for the token
 * @param {string} [options.name='Bitcoin'] - Unique identifier for the tokenized asset
 * @param {number} [options.initialSupply=9000000] - Starting number of tokens in circulation

 * @param {number} [options.maxSupply=21000000] - Absolute maximum Supply limit for the token
 * @param {number} [options.seedAmount=10000] - Initial Supply seeded for token liquidity
 * @param {number} [options.maxHistory=2016] - Maximum number of price history entries to maintain
 * @param {number} [options.scalingFactor=9000] - Coefficient used in dynamic price calculations
 * @param {number} [options.burnMultiplier=0.0003] - Percentage of tokens burned during transactions
 * @param {number} [options.volumeWindow=2016] - Sliding window size for tracking trading volume
 * 
 * @dev Managers responsible for different aspects of token lifecycle:
 * - ActivityManager: Simulates and tracks trading activities
 * - VolumeManager: Tracks and analyzes trading volume
 * - PriceManager: Manages price history and dynamic pricing strategy
 * - Initializer: Handles system and component initialization
 * - Validator: Performs input validation for trades and parameters
 * - Logger: Provides comprehensive logging of system events
 * - Controller: Executes trading and token management operations
 * 
 * @example
 * // Create a new token with custom parameters
 * const tokenBondingCurve = new TokenizedAssetBondingCurve({
 *   name: 'MyToken',
 *   initialSupply: 1000000,
 *   maxPrice: 1000000,
 *   scalingFactor: 900
 * });
 * 
 * // Basic token interactions
 * tokenBondingCurve.buyTokens(100);  // Purchase 100 tokens
 * tokenBondingCurve.sellTokens(50);  // Sell 50 tokens
 * 
 * // Retrieve system state
 * const currentState = tokenBondingCurve.getCurrentState();
 * 
 * @dev Key Design Principles:
 * 1. Dynamic pricing based on supply and demand
 * 2. Controlled token burning mechanism
 * 3. Comprehensive trading activity tracking
 * 4. Robust input validation
 * 
 * @notice Potential errors are handled through the Validator class
 * @throws {ValidationError} When constructor parameters or trade amounts are invalid
 */


export default class TokenizedAssetBondingCurve {

    constructor(name = 'Bitcoin', initialSupply = 9000000, totalSupply = 21000000, seedAmount = 10000, maxHistory = 2016, scalingFactor = 9000, burnMultiplier = 0.03, volumeWindow = 2016, options = {}, tradeRun = 10000) {
        // Initialize dependencies first
        this.isInitialized = false;
        this.logger = options.logger || new Logger();
        this.initializer = options.initializer || new Initializer(name, initialSupply, scalingFactor);
        const initialPrice = this.initializer.initializePrice();
        this.validator = options.validator || new Validator(initialPrice, maxHistory, scalingFactor);
        this.volumeManager = options.volumeManager || new VolumeManager(volumeWindow);
        this.priceManager = options.priceManager || new PriceManager(maxHistory, this.initializer.initializePrice(), scalingFactor, totalSupply, seedAmount, this.logger);
        this.activityManager = options.activityManager || new ActivityManager(this, this.priceManager, tradeRun, this.logger);  // Ensure it's initialized before use
        this.name = name;
        this.initialize(initialPrice, initialSupply, maxHistory, scalingFactor);




    }
    initialize(_initialPrice, _initialSupply, _maxHistory, _scalingFactor) {
        if (this.isInitialized) return;
        // this.activityManager.startTradingActivity();
        this.isInitialized = true;
    }
    _processTrade(action, amount) {
        console.log("Starting Process Trade!")
        let volumeAverage = this.volumeManager.calculateMovingAverage();
        this.volumeManager.recordVolume(amount);
        console.log("Volume average!: ", volumeAverage);
        let oldSupply = this.priceManager.currentSupply;
        console.log("Old supply!: ", oldSupply);
        let oldPrice = this.priceManager.currentPrice;
        console.log("Old price!: ", oldPrice);
        console.log("Updated Price!");
        let newPrice = this.priceManager.currentPrice;
        let newSupply = this.priceManager.currentSupply;
        let highestPrice = this.priceManager.highestPrice;
        this.priceManager.updatePrice(action, amount);
        console.log("Highest Price!: ", highestPrice);
        let _action = action == 'buy' ? 'BUY' : 'SELL';
        this.logger.logTradeDetails(_action, amount, oldSupply, oldPrice, newPrice, newSupply, highestPrice);
        console.log("Trade Complete");
    }

    buyTokens(amount) {
        this.validator.validateTradeAmount(amount);
        this._processTrade('buy', amount);
    }

    sellTokens(amount) {
        this.validator.validateTradeAmount(amount);
        this.validator.validateSellAmount(this.currentSupply, amount);
        this._processTrade('sell', amount);
    }

    getPriceHistory() {
        return [...this.priceManager.priceHistory];
    }

    getPrice() {
        return this.priceManager.currentPrice;
    }

    getTokenState() {
        this.logger.logCurrentState(this.name, this.priceManager.currentPrice, this.priceManager.totalSupply, this.priceManager.highestPrice, this.priceManager.scalingFactor);
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