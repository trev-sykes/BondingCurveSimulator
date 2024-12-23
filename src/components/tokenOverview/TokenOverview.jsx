import styles from "./tokenOverview.module.css"
import {
    MoveUp,
    MoveDown
} from 'lucide-react';
const TokenOverview = ({ name, price, latestPrice, lastTradeType, token }) => {
    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <h2>Token Overview</h2>
            </div>
            <div className={styles.panelContent}>
                <div className={styles.statRow}>
                    <span>Current Curve:</span>
                    <span className={styles.title}>{name ? name : 'Unknown'}</span>
                </div>
                <div className={styles.statRow}>
                    <span>Latest Trade Price:</span>
                    <span className={styles.title}>{latestPrice ? `$${latestPrice.toFixed(2)}` : 'N/A'}</span>
                </div>
                <div className={styles.statRow}>
                    <span>Latest Trade Type:</span>
                    <span className={lastTradeType === 'buy' ? styles.buyTrades : styles.sellTrades}>
                        {lastTradeType}{lastTradeType == 'buy' ? <MoveUp height={10} /> : <MoveDown height={10} />}
                    </span>
                </div>
                {/* <div className={styles.statRow}>
                    <span>Max Supply:</span>
                    <span >{token?.getTokenState()?.totalSupply}</span>
                </div> */}
            </div>
        </div>
    )

}
export default TokenOverview;