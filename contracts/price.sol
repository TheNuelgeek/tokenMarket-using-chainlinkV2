//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;
    //AggregatorV3Interface internal priceFeed2;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     * Aggregator: USD/ETH
     * Address: 0x0bF499444525a23E7Bb61997539725cA2e928138
     */
    constructor() {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        //priceFeed2 = AggregatorV3Interface(0x0bF499444525a23E7Bb61997539725cA2e928138);
    }

    /**
     * Returns the latest price
     */
    function getLatestPriceEthUsd() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    // function getLatestPriceUsdEth() public view returns (int) {
    //     (
    //         /*uint80 roundID*/,
    //         int price,
    //         /*uint startedAt*/,
    //         /*uint timeStamp*/,
    //         /*uint80 answeredInRound*/
    //     ) = priceFeed2.latestRoundData();
    //     return price;
    // }
}