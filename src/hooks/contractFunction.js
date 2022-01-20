import { getBeastAddress } from '../utils/addressHelpers';

export const getBloodstoneBalance = async (web3, contract, account) => {
    const response = await contract.methods.balanceOf(account).call();
    return web3.utils.fromWei(response, 'ether').toString();
}

export const getBloodstoneAllowance = async (web3, contract, account) => {
    const response = await contract.methods.allowance(account, getBeastAddress()).call();
    return web3.utils.fromWei(response, 'ether').toString();
}

export const setBloodstoneApprove = async (web3, contract, account) => {
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
    const response = await contract.methods._baseURL().call();
    return response;
}