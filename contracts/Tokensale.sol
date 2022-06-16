//LICENSE SPDX
pragma solidity ^0.8.11;

import "./Token.sol";

/* CONTRACT ITSELF */
contract Tokensale{
/* VARIABLES (IT IS NOT PUBLIC SO PEOPLE CANNOT SEE IT) */
address admin;
Token public token_contract;
uint256 public price;
uint256 public tokensSold;

event Sell(
    address _buyer,
    uint256 _amount
);


/* CONSTRUCTOR */
constructor(Token _token_contract , uint256 _price){
/* ASSIGN AN ADMIN */
admin = msg.sender;
/* TOKEN CONTRACT */
token_contract = _token_contract;
/* TOKEN PRICE */
price=_price;
}
/* BUY TOKENS FUNCTION */
function buyTokens(uint256 _numberOfTokens) public payable{
    /* AN REQUIRE */
    require(_numberOfTokens * price == msg.value);
    /* REQUIRE THAT THERES ENOUGH TOKENS */
    require(token_contract.balanceOf(address(this)) >= _numberOfTokens);
    /* REQUIRE THAT THE SELL IS SUCESSFULL */
    require(token_contract.transfer(msg.sender,_numberOfTokens));
    /* KEEP TRACK OF THE TOKENS SOLD */
    tokensSold += _numberOfTokens;
    /* TRIGGER SELL EVENT */
    emit Sell(msg.sender,_numberOfTokens);
}
/* END THE SALE */
function endSale() public _onlyOwner{
/* SUICIDE */
selfdestruct(payable(address(this)));
}

/* ONLY OWNER MODIFIER */
modifier _onlyOwner(){
    /* REQUIRE IT IS THE OWNER */
    require(msg.sender == admin);
    /* REQUIRE IT TRANSFER ALL THE FUNDS TO THE ADMIN WALLET */
    require(token_contract.transfer(admin, token_contract.balanceOf(address(this))));
    _;
}


}