import styles from "./tradeVolume.module.css"
const TradeVoume = ({ totalTradeStats, token }) => {

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <h2>Trade Volume</h2>
            </div>
            <div className={styles.panelContent}>
                <div className={styles.statRow}>
                    <span>Total Buy Volume:</span>
                    <span className={styles.buyTrades}>{totalTradeStats.totalBuyAmount}</span>
                </div>
                <div className={styles.statRow}>
                    <span>Total Sell Volume:</span>
                    <span className={styles.sellTrades}>{totalTradeStats.totalSellAmount}</span>
                </div>
                <div className={styles.statRow}>
                    <span>Current Supply:</span>
                    <span className={styles.sellTrades}>{token?.getTokenState()?.currentSupply}</span>
                </div>
                <div className={styles.statRow}>
                    <span>Max Supply:</span>
                    <span className={styles.sellTrades}>{token?.getTokenState()?.totalSupply}</span>
                </div>

            </div>
        </div>
    )
}

export default TradeVoume;