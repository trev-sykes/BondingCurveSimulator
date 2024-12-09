import React, { useState } from "react";
import styles from "./priceActionInformation.module.css"; // Importing the module CSS

const PriceModelPopup = ({ setVisibility }) => {
    const togglePopup = () => {
        setVisibility(false);
    };
    return (
        <>

            {
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                        <button onClick={togglePopup} className={styles.closeBtn}>
                            X
                        </button>
                        <h2>Understanding Bonding Curves</h2>
                        <p>
                            Bonding curves are a mathematical model used to determine the
                            price of tokens based on their supply. Think of it as a way to
                            automatically adjust the price as more tokens are bought or sold.
                        </p>
                        <h3>Types of Bonding Curves:</h3>
                        <ul>
                            <li>
                                <strong>Linear Model (lin):</strong> Price increases
                                proportionally as more tokens are purchased. This is a straight
                                line.
                            </li>
                            <li>
                                <strong>Logarithmic Model (log):</strong> Price increases more
                                slowly as supply increases, simulating the behavior of assets
                                like Bitcoin, where early adoption results in steep price
                                increases, but as more supply enters the market, price increases
                                slow down.
                            </li>
                        </ul>
                        <h3>Bitcoin Analogy</h3>
                        <p>
                            Just like how Bitcoin’s price initially spiked rapidly due to
                            limited supply and increasing demand, bonding curves aim to
                            replicate this dynamic, but with automated price adjustments based
                            on token supply.
                        </p>
                        <p>
                            In the case of Bitcoin, the early scarcity created a rapid
                            increase in price. Similarly, with a bonding curve, the earlier
                            purchases of tokens can cause the price to grow quickly, but as
                            supply increases, the price growth starts to slow down.
                        </p>
                        <p>Bonding curves create a predictable, automatic market price.</p>
                    </div>
                </div>
            }
        </>
    );
};

export default PriceModelPopup;
