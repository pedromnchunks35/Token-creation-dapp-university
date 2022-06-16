/* GRAB CONTRACT */
const Token = artifacts.require('Token');
/* FUNCTION TO TEST IF THE SUPPLY IS SETTED */
contract('First part',function(accounts){
/* THE CHECKING */
it('Sets the total supply upon deployment',function(){
/* RETURN THE CONTRACT INSTANCE */
return Token.deployed().then(function(instance){
    /* TOKEN INSTANCE */
    tokenInstance=instance;
    /* RETURN OF THE METHOD CONTAINED IN THE CONTRACT INSTANCE */
    return tokenInstance.totalSupply();
    /* TOTAL SUPPLY RETURNED BY THE GET */
}).then(function(totalSupply){
    /* CHECK IF THE VALUE RETURN IS EQUAL TO 1M */
    assert.equal(totalSupply.toNumber(),1000000,'The supply is 1M');
});

});
});
/*CONTRACT*/
contract('Secound part',function(accounts){
/*SOME VARS*/
var instance;
var balance;
/*CHECK BALANCE*/
it('Check balance of the adm',async function(){
/*Token instance*/
instance = await Token.deployed();
/*CHECK BALANCE*/
balance = await instance.balanceOf(accounts[0]);
/*CHECK IF THE BALANCE CORRESPONDES*/
assert.equal(balance.toNumber(),1000000,'Balance is correct');
});


/* VALUES CHECK */
it('Initializes the contract with the correct vales',async function(){
/*INSTANCE*/
var instance = await Token.deployed();
/*GETNAME*/
var name = await instance.name();
/*GET SYMBOL*/
var symbol = await instance.symbol();
/* GET VERSION */
var version = await instance.version();
/* NAME CHECK */
assert.equal(name,'Marta','Marta?');
/* SYMBOL CHECK */
assert.equal(symbol,'MRT','Symbol MRT?');
/* VERSION CHECK */
assert.equal(version,'MRT V1.0','Version is correct');
});


/* CHECK IF THERES AN REVERT MESSAGE BY TRYING TO BUY AN EXESSIVE AMOUNT */
it('Transfers token ownership', async function(){
/* INSTANCE OF THE CONTRACT */
var instance = await Token.deployed();
/* TRANSFER THAT IS IMPOSSIVEL TO DO  */
try {
  /* TRY TO CALL THE TRANSFER WHERE WE PASS AN AMOUNT BIGGER THAN THE CURRENT BALANCE OF AN CERTAIN ACCOUNT */
  await instance.transfer.call(accounts[1],9999999);
  /* IF IT REACHES THIS ASSERT.FAIL IT MEANS THAT THE FUNCTION UP DID NOT THROW AN ERROR */
  assert.fail;
} catch (error) {
    /* IF IT REACHES THIS BLOCK , THERES AN EXECPTION */
    /* REVERT MESSAGE */
  assert(error.message.indexOf('revert')>=0,'Error must contain an revert');
}
});
/* MAKE AN TRANSFER */
it('Make the transfer',async function(){
/* INSTANCE GET */
var instance = await Token.deployed();
/* TRANSFER ITSELF */
var receipt=await instance.transfer(accounts[1],250000,{from: accounts[0]});
/* GET THE BALANCE OF ACCOUNTS 1 */
var balance_account1 = await instance.balanceOf(accounts[1]);
/* CHECK IF THE BALANCE CORRESPONDS */
assert(balance_account1.toNumber()==250000,'The amount was not added');
/* BALANCE OF ACCOUNT 0 */
var balance_account0 = await instance.balanceOf(accounts[0]);
/* CHECK IF THE BALANCE CORRESPONDS */
assert(balance_account0.toNumber()+250000 == 1000000,'The amount was not retrieved');
/* CHECK THE LOGS OF THE RECEIPT */
assert(receipt.logs.length==1,'Event needs to be triggered');
/* CHECK THE REAL CALL FROM THE FRONT END */
var response=await instance.transfer.call(accounts[1],250000,{from:accounts[0]});
/* CHECK IF IT RETURNS TRUE */
assert.equal(response,true,'It does not return true');

});

/* CHECK IF IT APPROVES AN CERTAIN ACCOUNT TO SPEND ANOTHER ACCOUNT TOKENS */
it('aprove an token for delegated transfer', async function(){
  /* INSTANCE */
  var instance = await Token.deployed();
  /* THE APROVAL */
  var aproval= await instance.approve.call(accounts[1],100);
  /* CHECK THE APROVAL */
  assert.equal(aproval,true,'It doesnt return true');
  /* RECEIVE */
  var receipt = await instance.approve(accounts[1],100,{from: accounts[0]});
  /* CHECK IF IT AS LOGS */
  assert.equal(receipt.logs.length,1,'Theres some logs');
  assert.equal(receipt.logs[0].event,'Approve','Should be the approval event');
  assert.equal(receipt.logs[0].args._owner,accounts[0],'It is authrized by the account 0');
  assert.equal(receipt.logs[0].args._spender,accounts[1],'spender is the spender itself');
  assert.equal(receipt.logs[0].args._value,100,'the transfered amount');

  /* CHECK THE ALLOWANCE */
  var allowance = await instance.allowance(accounts[0],accounts[1]);
  /* CHECK THE VALUE THAT WE ALLOWED */
  assert.equal(allowance.toNumber(),100,'Stores the allowance for delegated transfer');
});

/* CHECKS THE TRANSFERFROM */
it('Checks the transfer',async function(){
  /* CONTRACT INSTANCE */
  var instance = await Token.deployed();
  /* ACCOUNTS TEST */
  fromAccount = accounts[2];
  toAccount = accounts[3];
  spendingAccount = accounts[4];

  /* TRANSFER SOME TOKENS TO THE FROM ACCOUNT */
  await instance.transfer(fromAccount,100,{from: accounts[0]});

  /* APROVE THE SPENDING ACCOUNT TO SPEND 10 TOKENS FROM FROMACCOUNT */
  await instance.approve(spendingAccount,10,{from: fromAccount});
  /* CHECK IF THE APPROVAL IS RIGHT */
  var check = await instance.allowance(fromAccount,spendingAccount);
  /* CHECKING */
  assert.equal(check,10,'It needs to be 10');
  /* CHECKING IF THE TRANSFER FROM CONDITIONS ARE CORRECT */
  try {
  await instance.transferFrom(fromAccount,toAccount,999,{from: spendingAccount});
  } catch (error) {
    /* CHECKING */
  assert(error.message.indexOf('revert') >= 0 , 'Cannot transfer an value higher than the balance or the allowed');
  }
  /* CHECK IF I CAN ACTUALLY SENDED THE MONEY*/
  await instance.transferFrom(fromAccount,toAccount,3,{from: spendingAccount});
  /* CHECK BALANCE */
  var balance = await instance.balanceOf(toAccount);
  /* CHECK IF THE BALANCE IS 3 */
  assert(balance==3,'It needs to be 3');
  /* CHECK IF THE FROM ACCOUNT DID HAVE RETRIEVED THE VALUE */
  var balance_from = await instance.balanceOf(fromAccount);
  /* CHECK THE FROM BALANCE */
  assert(balance_from.toNumber()==97,'It needs to be 97');
  /* CHECK IF THE SPENDING ALLOWANCE */
  var allowance_spending = await instance.allowance(fromAccount,spendingAccount);
  /* CHECK IF THE ALLOWANCE AS DECREASE */
  assert(allowance_spending==7,'It needs to be 7');

   /* CHECKING IF THE SPENDING ACCOUNT CAN SPEND MORE THAN THE ALLOWED */
   try {
    await instance.transferFrom(fromAccount,toAccount,12,{from: spendingAccount});
    } catch (error) {
      /* CHECKING */
    assert(error.message.indexOf('revert') >= 0 , 'It need to throw an revert because the allowance is less that the value transfered');
    }


})



});
