/* VERSION OF SOLIDITY */
pragma solidity ^0.8.11;

//ERC Token Standard #20 Interface
/* TOKEN CONTRACT */
contract Token{
/* VARIABLES */
/*SUPPLY*/
uint256 public totalSupply;
/*BALANCE OF*/
mapping(address => uint256) public balanceOf;
/* NESTED MAPPING OF THE ALLOWANCE */
mapping(address => mapping(address => uint256)) public allowance;
/*Name*/
string public name = 'Marta';
/*SYMBOL*/
string public symbol = 'MRT';
/*VERSION*/
string public version = 'MRT V1.0';

/* TRANSFER EVENT IT EXISTS TO MAKE AN "DEBUG" , WHAT I MEAN BY THAT IS THAT IT COMMUNICATES EVERY OPERATION ON THE BLOCKCHAIN*/
event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
);
/* APPROVAL EVENT LOGS */
event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value    
);




/* CONTRUCTOR ITSELF */
constructor(uint256 _initialSupply){
/* TOKEN NAME */
totalSupply = _initialSupply;
/*PUT THE TOKENS IN THE OWNER OF THE CONTRACT*/
balanceOf[msg.sender]=_initialSupply;
}


/* FUNCTION TRANSFER */
function transfer(address _to,uint256 _value)public returns(bool sucess){
/* EXCEPTION IF USER DOESNT HAVE ENOUGHT */
require(balanceOf[msg.sender] >= _value);
/* TRANSFER THE BALANCE */
balanceOf[msg.sender]-= _value;
balanceOf[_to]+=_value;
/* TRANSFER EVENT */
emit Transfer(msg.sender, _to, _value);
/* RETURN AN BOOLEAN */
return true;

}



/* APROVAL FUNCTION */
function approve(address _spender, uint256 _value) public returns(bool sucess){
/* ALLOWANCE */
allowance[msg.sender][_spender]= _value;
/* EVENT */
emit Approval(msg.sender, _spender, _value);
/* RETURN THE SUCESS MSG */
return true;
}

/* TRANSFERFROM */
function transferFrom(address _from, address _to , uint256 _value) public returns (bool sucess){
/* REQUIRE THAT THE FROM AS ENOUGHT TOKENS */
require(balanceOf[_from] >= _value);
/* THE SENDER MUST HAVE PERMISSION TO SEND TOKENS IN _FROM BEWALF AND THE ALLOWED TOKENS MUST ME SUPERIOR */
require(allowance[_from][msg.sender] >= _value);
/* CHANGE THE BALANCE */
balanceOf[_from]-=_value;
balanceOf[_to]+=_value;
/* UPDATE THE ALLOWANCE */
allowance[_from][msg.sender]-= _value;
/* TRANFER EVENT */
emit Transfer(_from,_to,_value);
/* RETURN BOOLEAN */
return true;
}



}
