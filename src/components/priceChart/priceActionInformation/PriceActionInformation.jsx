import React from "react";
import styles from "./priceActionInformation.module.css"; // Importing the module CSS

const PriceModelPopup = ({ setVisibility }) => {
    const togglePopup = () => setVisibility(false);

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <button onClick={togglePopup} className={styles.closeBtn}>X</button>
                <h2>Understanding Bonding Curves</h2>
                <p>
                    Bonding curves adjust token prices based on supply. As more tokens are bought or sold, the price changes automatically.
                </p>
                <h3>Types of Bonding Curves:</h3>
                <ul>
                    <li><strong>Linear Model (lin):</strong> Price increases proportionally as more tokens are purchased.</li>
                    <li><strong>Logarithmic Model (log):</strong> Price increases slowly as supply grows, mimicking early adoption dynamics.</li>
                </ul>
                <p>Bonding curves create a predictable, automated price mechanism based on token supply.</p>
            </div>
        </div>
    );
};

export default PriceModelPopup;
