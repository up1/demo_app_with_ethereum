var Web3 = require('web3');
var web3 = new Web3();

var hello;

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var contractAddress = '0xAE621D7660B7a24fb1d41156Cea1489b42D52b1e';
var contractCJI = [ { "constant": false, "inputs": [ { "name": "name", "type": "string" } ], "name": "sayHi", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "sayHello", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "inputs": [], "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "message", "type": "string" } ], "name": "print_log", "type": "event" } ];

web3.eth.getCode(contractAddress, function(error, res) {
  if (!error) {
    var helloContract = web3.eth.contract(contractCJI);
    hello = helloContract.at(contractAddress);
    callHello();
    callSayHi("xxxx");
  }
});

function callHello() {
  hello.sayHello.call(function(error, name) {
    console.log(">>>" + name);
  });
}

function callSayHi(name) {
  hello.sayHi.call(name, function(error, result) {
    console.log(">>>" + result);
  });
}
