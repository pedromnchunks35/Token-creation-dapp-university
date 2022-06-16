var Tokensale = artifacts.require('./Tokensale.sol');
var Token = artifacts.require('./Token.sol');
contract('Third part - Token Sale', function(accounts){

var _tokensprice=1000;

/* SEE IF IT INITILIZES CORRECTLY */
it('Initializes correctly the values', async function(){
/* GET THE INSTANCE */
var instance = await Tokensale.deployed();
/* TOKEN CONTRACT */
var token_contract = await instance.token_contract();
/* CHECK IF THERES AN TOKEN CONTRACT */
assert.notEqual(token_contract,0x0,'it doesnt have contract address');
/* PRICE */
var price = await instance.price();
/* CHECK IF THE PRICE CORRESPONDS */
assert.equal(price,1000,'It needs to be 1000');
});



/* TOKEN BUYING */
it('facilitates token buying', async function() {
    /* GET THE INSTANCE */
    var instance = await Tokensale.deployed();
    var instance_token = await Token.deployed();

    /* TRANSFER TO THE CONTRACT ADDRESS THE NUMBER OF TOKENS WE WANT TO BE AVAILABLE(REMEMBER THAT ALL SUPPLY IS ON OUR FIRST ACCOUNT)*/
    await instance_token.transfer(instance.address,1000,{from: accounts[0]});
    /* BUYING ONE TOKEN */
    await instance.buyTokens(100,{from: accounts[1],value: 100*_tokensprice});
   /* GET TOKENS SOLD */
   var tokens_sold = await instance.tokensSold();
   /* CHECK IF WE DID SELL 100 */
   assert.equal(tokens_sold,100,'It needs to be 100');

});
/* SINCE WE ALREADY TRANSFERED 1000 TOKENS IN THE PREVIOUS TEST WE WILL ONLY BUY THE TOKENS TO TRIGGER THE SELL EVENT */
/* CHECK IF THE EVENTS ARE TRIGGERED */
it('Trigger an sell event',async function(){
/* INSTANCE */
var instance = await Tokensale.deployed();
/* GETTING AN RECEIPT (WE WILL ONLY BUY 900 BECAUSE WE BOUGTH 100 IN THE PREVIOUS TEST) */
var receipt = await instance.buyTokens(900,{from: accounts[2],value: 900*_tokensprice});
/* LENGTH OF THE RECEIPT */
assert.equal(receipt.logs.length,1,'It needs to trigger an event');
/* GETTING THE TYPE OF EVENT */
assert.equal(receipt.logs[0].event,'Sell','The event should be a sell event');
/* GETTING THE BUYER */
assert.equal(receipt.logs[0].args._buyer,accounts[2],'It needs to be the account that actually made the transaction');
/* GETTING THE AMOUNT */
assert.equal(receipt.logs[0].args._amount,900,'It needs to be the exact quantity of tokens that we bought in the event'); 
});

/* END OF THE SALE */
it('Token Sale Ending', async function(){
/* INSTANCES */
var instance_sale = await Tokensale.deployed();
var instance_token = await Token.deployed();
 /* CHECK IF IT THROWS AN ERROR IN CASE WE INVOKE THAT FUNCTION WITH OTHER ACCOUNT THAN THE ADMIN ACCOUNT */
 try {
     await instance_sale.endSale({from: accounts[1]});
 } catch (error) {
 assert(error.message.indexOf('revert')>0,'It must throw an error because it isnt the admin');    
 }

/* CHECK IF WE CAN CALL IT AS ADMIN */
await instance_sale.endSale({from: accounts[0]});
/* GET THE TOKENS LEFT */
var tokens_left = await instance_token.balanceOf(accounts[0]);
/* CHECK IF THE BALANCE IS CORRECT */
assert.equal(tokens_left,999000,'It needs to retrieve 1000');
/* CHECK IF THE PRICE DID RESET WITH THE SELF DESTRUCT */
try {
await instance_sale.price(); 
} catch (error) {
} 

});





})