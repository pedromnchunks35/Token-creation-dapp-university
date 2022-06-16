/* GRAB OUR CONTRACT */
const Token = artifacts.require("Token");
const Tokensale = artifacts.require("Tokensale");
/* TAKE OUR FUNCTION WHICH RECEIVES AN DEPLOYER */
module.exports = async function (deployer) {
  /* DEPLOY THE CONTRACT UP */
  await deployer.deploy(Token,1000000);
  /* DEPLOY THE TOKEN SALE CONTRACT */
  await deployer.deploy(Tokensale,Token.address,1000);
};
