"use strict";

const rf = require("fs"); 
var path = require('path');
const Web3 = require("web3");
const CONFIG = require('../domain/web3deploy.prepare').CONFIG;
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIG.ethereum.rpc));

let util = module.exports;

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
};

util.guid = function guid(){
    /** it just version 4 guid **/
    function s4(){
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return [s4(), s4(), s4(), s4(), s4(), s4()].join("");
};

util.getDefaltEthAddress = function getDefaltEthAddress(){
    return "0x-eth-contract-address";
};

util.generateTxOfContract = function generateTxOfContract(from, contract, method, amount, receiver){
    let target = receiver.startsWith("0x") ?  receiver.substring(2) : receiver;
    // let gasVal = 90000;
    // let gasValMin = 6000;
    // let gasValMax = 6000000;
    // let gasPrice = 1000000000;
    var preparedTx = {
        from: from,
        to: contract,
        data: [ method, target.padStart(64, '0'), amount.toString(16).padStart(64, '0')].join("")
    };
    // gas:'0x' + gasVal.toString(16),
    // gasPrice:'0x' + gasPrice.toString(16)
    return preparedTx;
};

util.getContractDecimal = function getContractDecimal(contract){
    var tokens = JSON.parse(rf.readFileSync("tokenabi.json","utf-8"));
    var decimal = 1e18;
    tokens.forEach(function(element) {
        if(element.contractAddress.toLowerCase() == contract.toLowerCase()){
            decimal =  element.contractDecimal;
        }
    });
    return decimal;
} 

util.getTransferMethod = function getTransferMethod(contract){
    var tokens = JSON.parse(rf.readFileSync("tokenabi.json","utf-8"));
    var mMethod = "0xa9059cbb";
    tokens.forEach(function(element) {
        if(element.contractAddress.toLowerCase() == contract.toLowerCase()){
            mMethod =  element.contractMethod;
        }
    });
    return mMethod;
} 

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
  
util.getformateDateAndTimeToString  = function getformateDateAndTimeToString()  
{  
    // var time1 = new Date().Format("yyyy-MM-dd");
    var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
    return time2;  
};

//线程停留1s  msec = 1000
util.startSleep  = function startSleep(msec){
    var t = Date.now();  
    function sleep(d){  
        while(Date.now - t <= d);  
    }   
    sleep(msec*1000);
};

util.getTokenBalance = function getTokenBalance(contractAddress,address){

    var tokens = JSON.parse(rf.readFileSync("tokenabi.json","utf-8"));
    var tokenBalance = 0;
    tokens.forEach(function(element) {
        if(element.contractAddress.toLowerCase() == contractAddress.toLowerCase()){
            let abi = element.contractAbi;
            var MyContract = rpcWeb3.eth.contract(abi);
            var myContractInstance = MyContract.at(element.contractAddress);
            tokenBalance = myContractInstance.balanceOf(address)/element.contractDecimal;
        }
    });
    return tokenBalance;
};

util.findfile = function findfile(fileName,myfilePath){
    var file = undefined;
    function finder(filePath) {
        let files = rf.readdirSync(filePath);
        files.forEach((name) => {
            let fPath = path.join(filePath,name);
            let stats = rf.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) {
                if(fPath.indexOf(fileName) >= 0){
                    file = fPath;
                }
            }
        });
    }
    finder(myfilePath);
    return file;
};
util.deployGasPrice = 10000000000;
util.gasPrice = 18000000000;
util.abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "buyerSelfRefundEth",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "deadline",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "whiteAddress",
				"type": "address"
			}
		],
		"name": "removeWhiteAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "beneficiaryWithdrawal",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "beneficiary",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "max_amount",
				"type": "uint256"
			}
		],
		"name": "setMaxAmount",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "buyerAddress",
				"type": "address"
			},
			{
				"name": "percent",
				"type": "uint256"
			}
		],
		"name": "sendTokenToBuyerByPercent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "maxAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "ownerCheckGoalReached",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "tokenReward",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "fundingGoal",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "amountRaised",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "min_amount",
				"type": "uint256"
			}
		],
		"name": "setMinAmount",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "toAddress",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ownerTransferToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "isSuccess",
				"type": "bool"
			}
		],
		"name": "ownerCheckGoalIfReached",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "price",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "toAddress",
				"type": "address"
			}
		],
		"name": "ownerDealWithEth",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "crowdsaleClosed",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "hadSend",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "fundingGoalReached",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "buyerAddress",
				"type": "address"
			}
		],
		"name": "refundEth",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "toAddress",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ownerDealWithEthCoins",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "whiteAddressesOf",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "buyerAddress",
				"type": "address"
			}
		],
		"name": "sendTokenToBuyer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "whiteAddress",
				"type": "address"
			}
		],
		"name": "addWhiteAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "ifSuccessfulSendTo",
				"type": "address"
			},
			{
				"name": "fundingGoalInEthers",
				"type": "uint256"
			},
			{
				"name": "durationInMinutes",
				"type": "uint256"
			},
			{
				"name": "finneyCostOfEachToken",
				"type": "uint256"
			},
			{
				"name": "addressOfTokenUsedAsReward",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "totalAmountRaised",
				"type": "uint256"
			}
		],
		"name": "GoalReached",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "backer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "isContribution",
				"type": "bool"
			}
		],
		"name": "FundTransfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "fundingGoal",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amountRaised",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "fromAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferEvent",
		"type": "event"
	}
];

util.data = '0x6080604052662386f26fc1000060055569152d02c7e14af68000006006556000600c60006101000a81548160ff0219169083151502179055506000600c60016101000a81548160ff0219169083151502179055506000600c60026101000a81548160ff02191690831515021790555034801561007a57600080fd5b5060405160a0806124248339810180604052810190808051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550670de0b6b3a76400008402600281905550603c830242016004819055508160078190555080600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050612265806101bf6000396000f300608060405260043610610180576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631e85b7a51461031957806329dcb0cf146103305780632e135c541461035b5780633686ca3e1461039e57806338af3eed146103b557806341c0e1b51461040c5780634fe47f701461042357806354a79a0d146104505780635f48f3931461049d578063648baf50146104c85780636e66f6e9146104f757806370a082311461054e5780637a3a0e84146105a55780637b3e5e7b146105d0578063897b0637146105fb5780638da5cb5b146106285780639b2cb5d81461067f5780639bfd986e146106aa5780639f1bf666146106f7578063a035b1fe14610726578063a34328bf14610751578063ccb07cef14610794578063d1bbf838146107c3578063d424f6281461081a578063d83edd7014610849578063d87ee2ef1461088c578063e169185a146108d9578063e69b5a6a14610934578063f2fde38b14610977578063f65ad55c146109ba575b6000600c60019054906101000a900460ff1615151561019e57600080fd5b600454421015156101ae57600080fd5b600b60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561020657600080fd5b349050600554811015801561021d57506006548111155b801561022f5750600254816003540111155b151561023a57600080fd5b80600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806003600082825401925050819055507f8098cf0563cf36c7339b1b31f144712a27ea613dd22e39438cf1a1e5d3e1a2e66002546003543384604051808581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200194505050505060405180910390a150005b34801561032557600080fd5b5061032e6109fd565b005b34801561033c57600080fd5b50610345610bd7565b6040518082815260200191505060405180910390f35b34801561036757600080fd5b5061039c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610bdd565b005b3480156103aa57600080fd5b506103b3610c93565b005b3480156103c157600080fd5b506103ca610e30565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561041857600080fd5b50610421610e56565b005b34801561042f57600080fd5b5061044e60048036038101908080359060200190929190505050610eeb565b005b34801561045c57600080fd5b5061049b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610f50565b005b3480156104a957600080fd5b506104b26113aa565b6040518082815260200191505060405180910390f35b3480156104d457600080fd5b506104dd6113b0565b604051808215151515815260200191505060405180910390f35b34801561050357600080fd5b5061050c6113c3565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561055a57600080fd5b5061058f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506113e9565b6040518082815260200191505060405180910390f35b3480156105b157600080fd5b506105ba611401565b6040518082815260200191505060405180910390f35b3480156105dc57600080fd5b506105e5611407565b6040518082815260200191505060405180910390f35b34801561060757600080fd5b506106266004803603810190808035906020019092919050505061140d565b005b34801561063457600080fd5b5061063d611472565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561068b57600080fd5b50610694611497565b6040518082815260200191505060405180910390f35b3480156106b657600080fd5b506106f5600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061149d565b005b34801561070357600080fd5b50610724600480360381019080803515159060200190929190505050611651565b005b34801561073257600080fd5b5061073b6117b6565b6040518082815260200191505060405180910390f35b34801561075d57600080fd5b50610792600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506117bc565b005b3480156107a057600080fd5b506107a9611915565b604051808215151515815260200191505060405180910390f35b3480156107cf57600080fd5b50610804600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611928565b6040518082815260200191505060405180910390f35b34801561082657600080fd5b5061082f611940565b604051808215151515815260200191505060405180910390f35b34801561085557600080fd5b5061088a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611953565b005b34801561089857600080fd5b506108d7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611b2e565b005b3480156108e557600080fd5b5061091a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611c8c565b604051808215151515815260200191505060405180910390f35b34801561094057600080fd5b50610975600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611cac565b005b34801561098357600080fd5b506109b8600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506120e5565b005b3480156109c657600080fd5b506109fb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050612183565b005b6000600c60029054906101000a900460ff168015610a285750600c60009054906101000a900460ff16155b1515610a3357600080fd5b6000600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054111515610a8157600080fd5b600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015610bcf576000600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf633826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1610bd4565b600080fd5b50565b60045481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c3857600080fd5b6000600b60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b600c60029054906101000a900460ff161515610cae57600080fd5b600c60009054906101000a900460ff168015610d1757503373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b1515610d2257600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f1935050505015610e29577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16000600381905550610e2e565b600080fd5b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610eb157600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f4657600080fd5b8060068190555050565b600080600080600960008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054111515610fa257600080fd5b600c60029054906101000a900460ff168015610fca5750600c60009054906101000a900460ff165b1515610fd557600080fd5b670de0b6b3a76400008411806110325750670de0b6b3a7640000600a60008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b806110855750670de0b6b3a764000084600a60008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401115b1561108f57600080fd5b600960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549250309150670de0b6b3a7640000846007548502028115156110ed57fe5b04905080600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231846040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1580156111ae57600080fd5b505af11580156111c2573d6000803e3d6000fd5b505050506040513d60208110156111d857600080fd5b810190808051906020019092919050505010156111f457600080fd5b83600a60008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb86836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15801561130657600080fd5b505af115801561131a573d6000803e3d6000fd5b505050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6856007548381151561134d57fe5b046001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a15050505050565b60065481565b600c60029054906101000a900460ff1681565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60096020528060005260406000206000915090505481565b60025481565b60035481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561146857600080fd5b8060058190555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60055481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114f857600080fd5b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1580156115bd57600080fd5b505af11580156115d1573d6000803e3d6000fd5b505050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a15050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156116ac57600080fd5b8015611761576001600c60006101000a81548160ff0219169083151502179055507fec3f991caf7857d61663fd1bba1739e04abd4781238508cde554bb849d790c85600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600354604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a161177d565b6000600c60006101000a81548160ff0219169083151502179055505b6001600c60016101000a81548160ff0219169083151502179055506001600c60026101000a81548160ff02191690831515021790555050565b60075481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561181757600080fd5b600c60029054906101000a900460ff16801561183f5750600c60009054906101000a900460ff165b151561184a57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f193505050501561190d577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6816003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16000600381905550611912565b600080fd5b50565b600c60019054906101000a900460ff1681565b600a6020528060005260406000206000915090505481565b600c60009054906101000a900460ff1681565b6000600c60029054906101000a900460ff16801561197e5750600c60009054906101000a900460ff16155b151561198957600080fd5b6000600960008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115156119d757600080fd5b600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015611b25576000600960008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1611b2a565b600080fd5b5050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611b8957600080fd5b600c60029054906101000a900460ff168015611bb15750600c60009054906101000a900460ff165b1515611bbc57600080fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015611c83577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a180600360008282540392505081905550611c88565b600080fd5b5050565b600b6020528060005260406000206000915054906101000a900460ff1681565b600080600080600960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054111515611cfe57600080fd5b600c60029054906101000a900460ff168015611d265750600c60009054906101000a900460ff165b1515611d3157600080fd5b600960008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549250309150670de0b6b3a7640000600a60008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054670de0b6b3a764000003600754850202811515611dd857fe5b04905080600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231846040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b158015611e9957600080fd5b505af1158015611ead573d6000803e3d6000fd5b505050506040513d6020811015611ec357600080fd5b81019080805190602001909291905050501080611f275750670de0b6b3a7640000600a60008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b15611f3157600080fd5b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb85836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b158015611ff657600080fd5b505af115801561200a573d6000803e3d6000fd5b50505050670de0b6b3a7640000600a60008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6846007548381151561208957fe5b046001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a150505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561214057600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156121de57600080fd5b6001600b60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550505600a165627a7a72305820f5213fe8bef99985fe5f420ad4ef372ea34b9980de234fb8527a8936724749db0029';