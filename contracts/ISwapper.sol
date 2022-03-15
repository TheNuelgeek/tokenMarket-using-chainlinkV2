//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./price.sol";

interface IERC20{
    function transferFrom(address _from,address _to,uint256 _amount) external returns(bool);
    function transfer(address _to,uint256 _amount) external returns(bool);
}

contract Market{

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

    PriceConsumerV3 p = new PriceConsumerV3();
    int price = p.getLatestPriceEthUsd();
    int rate = price / decimal;
    int decimal;
    mapping(uint=>Order) public orders;

    function addOrder(address _fromToken,address _toToken,uint _amountIn, int _decimal) external{
        require(IERC20(_fromToken).transferFrom(msg.sender,address(this),_amountIn),"Not accessible");
        Order storage o=orders[orderIndex];
        decimal = _decimal;
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
        uint calcRate = _amountIn/uint(rate);
        require(IERC20(o.toToken).transferFrom(msg.sender, o.owner, _amountIn),"");
        require(IERC20(o.fromToken).transfer(msg.sender, calcRate));

        o.amountAvailable -= calcRate;
        o.done=o.amountAvailable==0?true:false;
    }
 
}