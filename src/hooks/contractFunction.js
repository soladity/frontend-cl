import { getBeastAddress, getWarriorAddress, getLegionAddress } from '../utils/addressHelpers';

export const getBloodstoneBalance = async (web3, contract, account) => {
    const response = await contract.methods.balanceOf(account).call();
    return web3.utils.fromWei(response, 'ether').toString();
}

export const getBeastBloodstoneAllowance = async (web3, contract, account) => {
    const response = await contract.methods.allowance(account, getBeastAddress()).call();
    return web3.utils.fromWei(response, 'ether').toString();
}

export const setBeastBloodstoneApprove = async (web3, contract, account) => {
    const response = await contract.methods.approve(getBeastAddress(), web3.utils.toWei('1000000000', 'ether').toString()).send({ from: account });
    return response;
}

export const mintBeast = async (web3, contract, account, amount) => {
    const response = await contract.methods.mint(amount).send({ from: account });
    return response;
}

export const getBeastBalance = async (web3, contract, account) => {
    const response = await contract.methods.balanceOf(account).call();
    return response;
}

export const getBeastTokenIds = async (web3, contract, account) => {
    const response = await contract.methods.getTokenIds(account).call();
    return response;
}

export const getBeastToken = async (web3, contract, tokenId) => {
    const response = await contract.methods.getBeast(tokenId).call();
    const beast = {
        type: response[0],
        strength: response[1],
        capacity: response[2],
        image: response[3],
        imageAlt: response[4]
    }
    return beast;
}

export const getBeastUrl = async (web3, contract) => {
    // const response = await contract.methods._baseURL().call();
    return "https://ipfs.infura.io:5001/api/v0/cat/";
}

export const getWarriorBloodstoneAllowance = async (web3, contract, account) => {
    const response = await contract.methods.allowance(account, getWarriorAddress()).call();
    return web3.utils.fromWei(response, 'ether').toString();
}

export const setWarriorBloodstoneApprove = async (web3, contract, account) => {
    const response = await contract.methods.approve(getWarriorAddress(), web3.utils.toWei('1000000000', 'ether').toString()).send({ from: account });
    return response;
}

export const mintWarrior = async (web3, contract, account, amount) => {
    const response = await contract.methods.mint(amount).send({ from: account });
    return response;
}

export const getWarriorUrl = async (web3, contract) => {
    // const response = await contract.methods._baseURL().call();
    return "https://ipfs.infura.io:5001/api/v0/cat/";
}

export const getWarriorBalance = async (web3, contract, account) => {
    const response = await contract.methods.balanceOf(account).call();
    return response;
}

export const getWarriorTokenIds = async (web3, contract, account) => {
    const response = await contract.methods.getTokenIds(account).call();
    return response;
}

export const getWarriorToken = async (web3, contract, tokenId) => {
    const response = await contract.methods.getWarrior(tokenId).call();
    const beast = {
        type: response[0],
        strength: response[1],
        power: response[2],
        image: response[3],
        imageAlt: response[4]
    }
    return beast;
}

export const mintLegion = async (web3, contract, account, legionName, beastIds, warriorIds) => {
    const response = await contract.methods.mint(legionName, beastIds, warriorIds).send({ from: account });
    return response;
}

export const getLegionTokenIds = async (web3, contract, account) => {
    const response = await contract.methods.getTokenIds(account).call();
    return response;
}

export const getLegionToken = async (web3, contract, tokenId) => {
    const response = await contract.methods.getLegion(tokenId).call();
    const legion = {
        name: response[0],
        image: response[1],
        beasts: response[2],
        warriors: response[3],
        supplies: response[4],
        attackPower: parseInt(response[5]),
    }
    return legion;
}

export const addSupply = async (web3, contract, account, tokenId, supply) => {
    const response = await contract.methods.addSupply(tokenId, supply, true).send({ from: account });
    return response;
}