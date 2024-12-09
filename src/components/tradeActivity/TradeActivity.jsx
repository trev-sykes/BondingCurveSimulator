import styles from "./tradeActivity.module.css"

const TradeActivity = ({ totalTradeStats }) => {


    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <h2>Trade Activity</h2>
            </div>
            <div className={styles.panelContent}>
                <div className={styles.statRow}>
                    <span>Total Trades:</span>
                    <span>{totalTradeStats.totalTrades}</span>
                </div>
                <div className={styles.statRow}>
                    <span>Buy Trades:</span>
                    <span className={styles.buyTrades}>{totalTradeStats.buyTrades}</span>
                </div>
                <div className={styles.statRow}>
                    <span>Sell Trades:</span>
                    <span >{totalTradeStats.sellTrades}</span>
                </div>


            </div>
        </div>
    )
}
export default TradeActivity