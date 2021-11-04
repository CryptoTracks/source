const CryptoTracks = artifacts.require("CryptoTracks");
CryptoTracks.defaults({
  gasPrice: 0
});
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("CryptoTracks", function (accounts) {
  it("should init to 1 tune", async function () {
    const instance = await CryptoTracks.deployed();
    const res = await instance.getTunesLength();
    assert.isTrue(res == 1);
  });

  it("should get genesis tune", async function () {
    const instance = await CryptoTracks.deployed();
    const res = await instance.getTune(0);
    assert.equal(res[8], accounts[0]);
  });

  it('should favorite genesis tune', async function() {
    const favValue = 0.001 * 10e18;
    const instance = await CryptoTracks.deployed();
    let myFavorites = await instance.getMyFavorites({ from: accounts[1] });
    assert.isTrue(myFavorites.length === 0);
    const myBalanceBefore = await web3.eth.getBalance(accounts[1]);
    const artistBalanceBefore = await web3.eth.getBalance(accounts[0]);
    const receipt = await instance.favorite(0, { from: accounts[1], value: favValue });
    myFavorites = await instance.getMyFavorites({ from: accounts[1] });
    assert.isTrue(myFavorites.length === 1);
    const myBalanceAfter= await web3.eth.getBalance(accounts[1]);
    const artistBalanceAfter = await web3.eth.getBalance(accounts[0]);
    assert.equal(favValue, artistBalanceAfter - artistBalanceBefore);
    assert.equal(favValue, myBalanceBefore - myBalanceAfter);
  })

  it('should error favorite w/ bad fee', async function() {
    const favValue = 0.00099 * 10e18;
    const instance = await CryptoTracks.deployed();
    try {
      await instance.favorite(0, { from: accounts[1], value: favValue });
      assert(false);
    } catch (err) {
      assert(true);
    }
  })

  it('should create a tune', async function() {
    const donation = 0.01 * 10e18;
    const instance = await CryptoTracks.deployed();
    const res = await instance.getTunesLength();
    assert.isTrue(res == 1);
    const encoder = [
      new web3.utils.BN(web3.utils.randomHex(32)),
      new web3.utils.BN(web3.utils.randomHex(32)),
      new web3.utils.BN(web3.utils.randomHex(32)),
      new web3.utils.BN(web3.utils.randomHex(32)),
      new web3.utils.BN(web3.utils.randomHex(32)),
      new web3.utils.BN(web3.utils.randomHex(32)),
      new web3.utils.BN(web3.utils.randomHex(32)),
      new web3.utils.BN(web3.utils.randomHex(32))
    ];
    const balanceBefore = await web3.eth.getBalance(accounts[0]);
    const tuneReceipt = await instance.publishTune(encoder[0], encoder[1], encoder[2], encoder[3],
      encoder[4], encoder[5], encoder[6], encoder[7], { from: accounts[1], value: donation });
    const tuneLength = await instance.getTunesLength();
    assert.isTrue(tuneLength == 2);
    const tune = await instance.getTune(1);
    assert.equal(tune[0].toString(), encoder[0].toString());
    assert.equal(tune[1].toString(), encoder[1].toString());
    assert.equal(tune[2].toString(), encoder[2].toString());
    assert.equal(tune[3].toString(), encoder[3].toString());
    assert.equal(tune[4].toString(), encoder[4].toString());
    assert.equal(tune[5].toString(), encoder[5].toString());
    assert.equal(tune[6].toString(), encoder[6].toString());
    assert.equal(tune[7].toString(), encoder[7].toString());
    assert.equal(tune[8].toString(16), accounts[1]);
    assert.equal(tune[9].toString(10), '0');

    await instance.withdraw();
    const balanceAfter = await web3.eth.getBalance(accounts[0]);
    assert.equal(donation, balanceAfter - balanceBefore);
  })
});
