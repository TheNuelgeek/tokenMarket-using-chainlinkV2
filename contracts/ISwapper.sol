//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

//import "./price.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


interface IERC20{
    function transferFrom(address _from,address _to,uint256 _amount) external returns(bool);
    function transfer(address _to,uint256 _amount) external returns(bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
contract Market{

    AggregatorV3Interface internal priceFeed;
    struct Order{
        address fromToken;
        bool done;
        address toToken;
        uint256 toTokenAmount;
        uint256 fromTokenAmount;
        uint256 amountAvailable;
        address owner;
    }

    uint orderIndex = 1;

    // PriceConsumerV3 p = new PriceConsumerV3();
    // int price =4;
    // int decimal;
    int rate;
    mapping(uint=>Order) public orders;

    constructor() {
        priceFeed = AggregatorV3Interface(0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c);
    }

    function getLatestPriceLinkUsdc() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    function addOrder(address _fromToken,address _toToken,uint _amountIn) external{
        require(IERC20(_fromToken).transferFrom(msg.sender,address(this),_amountIn),"Not accessible");
        Order storage o=orders[orderIndex];
        int _price = getLatestPriceLinkUsdc();
        rate = _price;
        o.fromToken = _fromToken;
        o.toToken = _toToken;
        o.fromTokenAmount= _amountIn;
        o.amountAvailable=_amountIn;
        o.owner=msg.sender;
        orderIndex++;
        assert(o.toToken!=address(0));
    }

    function swapLinkUsdc(uint _index) external payable{
        Order storage o=orders[_index];
        require(!o.done, "oder has been executed");
        assert(o.toToken != address(0));
        uint calcRate = ((o.amountAvailable) * uint(rate));
        require(IERC20(o.toToken).transferFrom(msg.sender, o.owner, calcRate/10**8)," Money not received");
        require(IERC20(o.fromToken).transfer(msg.sender, o.amountAvailable), "Money not sent");
        o.done=o.amountAvailable==0?true:false;
    }
 
}