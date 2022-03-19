//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

//import "./price.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


interface IERC20{
    function transferFrom(address _from,address _to,uint256 _amount) external returns(bool);
    function transfer(address _to,uint256 _amount) external returns(bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract Market{

    AggregatorV3Interface internal priceFeed;
    struct Order{
        address fromToken; // Contract address usdt
        //uint88 expiry;
        bool done;
        address toToken; // Router
        uint256 toTokenAmount;
        uint256 fromTokenAmount;
        uint256 amountAvailable;
        address owner; // Nuelgeek Usdt
    }

    uint orderIndex = 1;

    // PriceConsumerV3 p = new PriceConsumerV3();
    // int price =4;
    // int decimal;
    int rate;
    mapping(uint=>Order) public orders;

    constructor() {
        priceFeed = AggregatorV3Interface(0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c);
        //priceFeed2 = AggregatorV3Interface(0x0bF499444525a23E7Bb61997539725cA2e928138);
    }

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

    function addOrder(address _fromToken,address _toToken,uint _amountIn, int _decimal) external{
        require(IERC20(_fromToken).transferFrom(msg.sender,address(this),_amountIn),"Not accessible");
        Order storage o=orders[orderIndex];
        int _price = getLatestPriceEthUsd();
        int _rate = _price / _decimal;
        rate = _rate;
        o.fromToken = _fromToken;
        o.toToken = _toToken;
        o.toTokenAmount = uint(rate);
        o.fromTokenAmount= _amountIn;
        o.amountAvailable=_amountIn;
        o.owner=msg.sender;
        orderIndex++;

        // assert(!o.done);
        assert(o.toToken!=address(0));
    }

    function swapEthUsd(uint _index, uint _amountIn) external payable{
        Order storage o=orders[_index];
        require(!o.done, "oder has been executed");
        assert(o.toToken != address(0));
        uint calcRate = _amountIn /uint(rate);
        require(IERC20(o.toToken).transferFrom(msg.sender, o.owner, _amountIn),"Money not sent");
        require(IERC20(o.fromToken).transfer(msg.sender, calcRate), "Money not recived");

        o.amountAvailable -= calcRate;
        o.done=o.amountAvailable==0?true:false;
    }
 
}