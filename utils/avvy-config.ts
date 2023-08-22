export const avvyDomainsAddress = "0x1ea4e7A798557001b99D88D6b4ba7F7fc79406A9";
export const avvyAbi = [{
    "inputs": [{
        "internalType": "contract ContractRegistryInterface",
        "name": "_contractRegistry",
        "type": "address",
    }],
    "stateMutability": "nonpayable",
    "type": "constructor",
}, {
    "inputs": [],
    "name": "contractRegistry",
    "outputs": [{
        "internalType": "contract ContractRegistryInterface",
        "name": "",
        "type": "address",
    }],
    "stateMutability": "view",
    "type": "function",
}, {
    "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, {
        "internalType": "string",
        "name": "key",
        "type": "string",
    }],
    "name": "resolve",
    "outputs": [{ "internalType": "string", "name": "value", "type": "string" }],
    "stateMutability": "view",
    "type": "function",
}, {
    "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, {
        "internalType": "uint256",
        "name": "key",
        "type": "uint256",
    }],
    "name": "resolveStandard",
    "outputs": [{ "internalType": "string", "name": "value", "type": "string" }],
    "stateMutability": "view",
    "type": "function",
}, {
    "inputs": [{ "internalType": "address", "name": "addy", "type": "address" }],
    "name": "reverseResolveEVMToName",
    "outputs": [{
        "internalType": "string",
        "name": "preimage",
        "type": "string",
    }],
    "stateMutability": "view",
    "type": "function",
}];