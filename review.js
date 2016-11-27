var Web3 = require('web3');
var web3 = new Web3();

var review;

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var contractAddress = '0xE34ECb274a8443Cb50b7A18D7a0f49638Ad7eC4d';
var contractCJI = [ { "constant": false, "inputs": [], "name": "ReviewContract", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "user", "type": "address" }, { "name": "score", "type": "uint256" } ], "name": "newReview", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "user", "type": "address" } ], "name": "getReviewByUser", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "allUsers", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "user", "type": "address" }, { "indexed": false, "name": "reviewScore", "type": "uint256" } ], "name": "notify", "type": "event" } ];
var currentAccounts;
web3.eth.getAccounts(function(error, accounts){
  if(!error) {
    currentAccounts = accounts;
    start();
  }
});

function start() {
  web3.eth.getCode(contractAddress, function(error, res) {
    if (!error) {
      var reviewContract = web3.eth.contract(contractCJI);
      review = reviewContract.at(contractAddress);
      callAddReviewWithTx(currentAccounts[0], 8);
      // callGetReviewByUser(currentAccounts[0]);
    }
  });
}

function callAddReviewWithTx(account, score) {
  review.newReview.sendTransaction(account, score, {from: account}, function (err, txHash) {
    console.log('Transaction sent.' + txHash);
    if (err) {
        throw error;
    }
    return waitForTransationToBeMined(txHash, function(error, txHash){
      callGetReviewByUser(account);
      callAllUsers();
    });
  });
}

function callGetReviewByUser(account) {
  review.getReviewByUser.call(account, function(error, result) {
    console.log("Score=" + result);
  });
}

function callAllUsers() {
  review.allUsers.call(function(error, result) {
    console.log("allUsers=" + result);
  });
}


var waitForTransationToBeMined = function(txHash, callback) {
  /*
  * Watch for a particular transaction hash and call the awaiting function when done;
  * Ether-pudding uses another method, with web3.eth.getTransaction(...) and checking the txHash;
  * on https://github.com/ConsenSys/ether-pudding/blob/master/index.js
  */
  var blockCounter = 15;
  // Wait for tx to be finished
  var filter = web3.eth.filter('latest').watch(function(err, blockHash) {
    if (blockCounter<=0) {
      filter.stopWatching();
      filter = null;
      console.warn('!! Tx expired !!');
      if (callback)
        return callback(false);
      else
        return false;
    }
    // Get info about latest Ethereum block
    var block = web3.eth.getBlock(blockHash);
    --blockCounter;
    // Found tx hash?
    if (block.transactions.indexOf(txHash) > -1) {
      // Tx is finished
      filter.stopWatching();
      filter = null;
      if (callback)
        return callback(true);
      else
        return true;
    // Tx hash not found yet?
    } else {
      console.log('Waiting tx..', blockCounter);
    }
  });
};
