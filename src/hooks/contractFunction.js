import {
  getBeastAddress,
  getWarriorAddress,
  getLegionAddress,
  getMarketplaceAddress,
} from "../utils/addressHelpers";

export const getBaseUrl = async () => {
  // const response = await contract.methods._baseURL().call();
  return "https://ipfs.infura.io:5001/api/v0/cat/";
};

export const getBloodstoneBalance = async (web3, contract, account) => {
  const response = await contract.methods.balanceOf(account).call();
  return web3.utils.fromWei(response, "ether").toString();
};

export const getBeastBloodstoneAllowance = async (web3, contract, account) => {
  const response = await contract.methods
    .allowance(account, getBeastAddress())
    .call();
  return web3.utils.fromWei(response, "ether").toString();
};

export const setBeastBloodstoneApprove = async (web3, contract, account) => {
  const response = await contract.methods
    .approve(
      getBeastAddress(),
      web3.utils.toWei("1000000000", "ether").toString()
    )
    .send({ from: account });
  return response;
};

export const getBaseGifURL = async (web3, contract) => {
  const response = await contract.methods.baseGifUrl().call();
  return response;
};

export const getBaseJpgURL = async (web3, contract) => {
  const response = await contract.methods.baseJpgUrl().call();
  return response;
};

/**
 * Beast Session
 */

export const mintBeast = async (web3, contract, account, amount) => {
  const response = await contract.methods.mint(amount).send({ from: account });
  return response;
};

export const getBloodstoneAmountToMintBeast = async (
  web3,
  contract,
  amount
) => {
  const response = await contract.methods.getBloodstoneAmount(amount).call();
  return response;
};

export const getBeastBalance = async (web3, contract, account) => {
  const response = await contract.methods.balanceOf(account).call();
  return response;
};

export const getBeastTokenIds = async (web3, contract, account) => {
  const response = await contract.methods.getTokenIds(account).call();
  return response;
};

export const getBeastToken = async (web3, contract, tokenId) => {
  const response = await contract.methods.getBeast(tokenId).call();
  const beast = {
    type: response[0],
    strength: response[1],
    capacity: response[2],
    // image: response[3],
    // imageAlt: response[4]
  };
  return beast;
};

/**
 * Warrior Session
 */

export const getWarriorBloodstoneAllowance = async (
  web3,
  contract,
  account
) => {
  const response = await contract.methods
    .allowance(account, getWarriorAddress())
    .call();
  return web3.utils.fromWei(response, "ether").toString();
};

export const setWarriorBloodstoneApprove = async (web3, contract, account) => {
  const response = await contract.methods
    .approve(
      getWarriorAddress(),
      web3.utils.toWei("1000000000", "ether").toString()
    )
    .send({ from: account });
  return response;
};

export const mintWarrior = async (web3, contract, account, amount) => {
  const response = await contract.methods.mint(amount).send({ from: account });
  return response;
};

export const getBloodstoneAmountToMintWarrior = async (
  web3,
  contract,
  amount
) => {
  const response = await contract.methods.getBloodstoneAmount(amount).call();
  return response;
};

export const getWarriorBalance = async (web3, contract, account) => {
  const response = await contract.methods.balanceOf(account).call();
  return response;
};

export const getWarriorTokenIds = async (web3, contract, account) => {
  const response = await contract.methods.getTokenIds(account).call();
  return response;
};

export const getWarriorToken = async (web3, contract, tokenId) => {
  const response = await contract.methods.getWarrior(tokenId).call();
  const beast = {
    type: response[0],
    strength: response[1],
    power: response[2],
    // image: response[3],
    // imageAlt: response[4]
  };
  return beast;
};

/**
 * Create Legion Session
 */

export const getLegionBloodstoneAllowance = async (web3, contract, account) => {
  const response = await contract.methods
    .allowance(account, getLegionAddress())
    .call();
  return web3.utils.fromWei(response, "ether").toString();
};

export const setLegionBloodstoneApprove = async (web3, contract, account) => {
  const response = await contract.methods
    .approve(
      getLegionAddress(),
      web3.utils.toWei("1000000000", "ether").toString()
    )
    .send({ from: account });
  return response;
};

export const mintLegion = async (
  web3,
  contract,
  account,
  legionName,
  beastIds,
  warriorIds
) => {
  const response = await contract.methods
    .mint(legionName, beastIds, warriorIds)
    .send({ from: account });
  return response;
};

export const canHunt = async (web3, contract, tokenID) => {
  const response = await contract.methods.canHuntMonster(tokenID).call();
  return response;
};

export const hunt = async (web3, contract, account, legionID, monsterID) => {
  const response = await contract.methods
    .hunt(legionID, monsterID)
    .send({ from: account })
    .on("receipt", function (receipt) {
      console.log(receipt.events);
    });
  console.log(response)
  return response;
};

/**
 * Monster Contracts
 */

export const getMonsterInfo = async (web3, contract, monsterID) => {
  const response = await contract.methods.getMonsterInfo(monsterID).call();
  const monster = {
    name: response[0],
    base: response[1],
    ap: parseInt(response[2]) / 100,
    reward: response[3] / 10,
    // image: response[3],
    // imageAlt: response[4]
  };
  return monster;
};

// Reward Pool
export const getUnclaimedUSD = async (web3, contract, account) => {
  const response = await contract.methods.getUnclaimedUSD(account).call();
  return response;
};

export const getLegionTokenIds = async (web3, contract, account) => {
  const response = await contract.methods.getTokenIds(account).call();
  return response;
};

export const getLegionToken = async (web3, contract, tokenId) => {
  const response = await contract.methods.getLegion(tokenId).call();
  const legion = {
    name: response[0],
    beasts: response[1],
    warriors: response[2],
    supplies: response[3],
    attackPower: Math.floor(parseInt(response[4]) / 100),
    lastHuntTime: response[5],
  };
  return legion;
};

export const getLegionLastHuntTime = async (web3, contract, tokenId) => {
  const response = await contract.methods.lastHuntTime(tokenId).call();
  return response;
};

export const addSupply = async (web3, contract, account, tokenId, supply) => {
  const response = await contract.methods
    .addSupply(tokenId, supply, true)
    .send({ from: account });
  return response;
};

export const getLegionDetails = async (web3, contract, tokenID) => {
  const response = await contract.methods.getLegion(tokenID).call();
  const legion = {
    name: response[0],
    beastIDs: response[2],
    warriorIDs: response[3],
    supplies: response[4],
    ap: Math.floor(parseInt(response[5]) / 100),
    onMarket: response[6],
  };
  return legion;
};

export const getAvailableLegionsCount = async (web3, contract, account) => {
  const response = await contract.methods
    .getAvailableLegionsCount(account)
    .call();
  return response;
};

export const getTaxLeftDays = async (web3, contract, account) => {
  const response = await contract.methods.getTaxLeftDays(account).call();
  return response;
};

export const getMaxAttackPower = async (web3, contract, account) => {
  const response = await contract.methods.getMaxAttackPower(account).call();
  return response;
};

export const getLegionImage = async (web3, contract, ap) => {
  const response = await contract.methods
    .getImage(parseInt(ap).toString())
    .call();
  const image = {
    image: response[1],
    animationImage: response[0],
  };
  return image;
};

export const getHuntStatus = async (web3, contract, id) => {
  const response = await contract.methods.canHuntMonster(id).call();
  let status = "";
  if (response === "1") status = "green";
  else if (response === "2") status = "orange";
  else status = "red";
  return status;
};

export const addBeasts = async (
  web3,
  contract,
  account,
  legionID,
  beastsIDs
) => {
  const response = await contract.methods
    .addBeasts(legionID, beastsIDs)
    .send({ from: account });
  return response;
};

export const addWarriors = async (
  web3,
  contract,
  account,
  legionID,
  warriosIDs
) => {
  const response = await contract.methods
    .addWarriors(legionID, warriosIDs)
    .send({ from: account });
  return response;
};

export const claimReward = async (web3, contract, account) => {
  const response = await contract.methods.claimReward().send({ from: account });
  return response;
};

export const sellToken = async (web3, contract, account, type, id, price) => {
  const response = await contract.methods
    .sellToken(type, id, price)
    .send({ from: account });
  return response;
};

export const getOnMarketplace = async (web3, contract) => {
  const response = await contract.methods
    .getTokenIds(getMarketplaceAddress())
    .call();
  return response;
};

export const getOwner = async (web3, contract, id) => {
  const response = await contract.methods.ownerOf(id).call();
  return response;
};

export const cancelMarketplace = async (web3, contract, account, type, id) => {
  const response = await contract.methods
    .cancelSelling(type, id)
    .send({ from: account });
  return response;
};

export const buyToken = async (web3, contract, account, type, id) => {
  const response = await contract.methods
    .buyToken(type, id)
    .send({ from: account });
  return response;
};

export const getMarketItem = async (web3, contract, type, id) => {
  const response = await contract.methods.getMarketItem(type, id).call();
  const item = {
    price: response[0],
    owner: response[1],
  };
  return item;
};

export const setMarketplaceApprove = async (web3, contract, account, id) => {
  const response = await contract.methods
    .approve(getMarketplaceAddress(), id)
    .send({ from: account });
  return response;
};

export const setMarketplaceBloodstoneApprove = async (
  web3,
  contract,
  account
) => {
  const response = await contract.methods
    .approve(
      getMarketplaceAddress(),
      web3.utils.toWei("1000000000", "ether").toString()
    )
    .send({ from: account });
  return response;
};

export const getMarketplaceBloodstoneAllowance = async (
  web3,
  contract,
  account
) => {
  const response = await contract.methods
    .allowance(account, getMarketplaceAddress())
    .call();
  return web3.utils.fromWei(response, "ether").toString();
};

export const execute = async (web3, contract, account, type, id) => {
  const response = await contract.methods
    .execute(id, type)
    .send({ from: account });
  return response;
};

export const getFee = async (contract, index) => {
  const response = await contract.methods.getFee(index).call();
  return response;
};

export const updateLegion = async (
  web3,
  contract,
  account,
  legionID,
  beastsIDs,
  warriorsIDs
) => {
  const response = await contract.methods
    .updateLegion(legionID, beastsIDs, warriorsIDs)
    .send({ from: account });
  return response;
};
