export const getBloodstoneBalance = async (web3, contract, account) => {
    const response = await contract.methods.balanceOf(account).call();
    return web3.utils.fromWei(response, 'ether').toString();
}

export const mintBeast = async (web3, contract, account, amount) => {
    console.log(account)
    const response = await contract.methods.mint(amount).send({ from: account });
    return response;
}