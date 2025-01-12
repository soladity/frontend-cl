const version = {
  test: {
    version: "test",
    chain: "testnet",
    chainID: process.env.REACT_APP_TEST_CHAIN_ID || 97,
    chainIDHex: process.env.REACT_APP_TEST_CHAIN_ID_HEX || 0x61,
    rpcUrl: "https://data-seed-prebsc-2-s3.binance.org:8545/",
    rpcWsUrl:
      "wss://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/testnet/ws",
    walletAddRpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
    duelPeriod: 1200 * 1000,
    duelInvitePeriod: 600 * 1000,
    oneDay: 120 * 1000,
    earlyAccessPeriod: 6 * 3600 * 1000,
  },
  main: {
    version: "main",
    chain: "mainnet",
    chainID: process.env.REACT_APP_MAIN_CHAIN_ID || 56,
    chainIDHex: process.env.REACT_APP_MAIN_CHAIN_ID_HEX || 0x38,
    rpcUrl:
      "https://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/mainnet",
    rpcWsUrl:
      "wss://speedy-nodes-nyc.moralis.io/e205f98725c0bea218c8fdee/bsc/mainnet/ws",
    walletAddRpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
    duelPeriod: 24 * 3600 * 1000,
    duelInvitePeriod: 6 * 3600 * 1000,
    oneDay: 24 * 3600 * 1000,
    earlyAccessPeriod: 6 * 3600 * 1000,
  },
};

const gameSiteUrl = "https://play.cryptolegions.app";
const companySiteUrl = "https://cryptogames.agency";
const gameLongName = "Crypto Legions V4";
const gameShortName = "CryptoLegionsV4";
const gameMonsterName = "Monster";

const approveBLSTForBeast = "50000";
const approveBUSDForLegion = "1400";
const approveGoverToken = "50000";
const BUSDForPlay = 100;
const gameStartDay = "2022-09-27T00:00:00.000";
const maxSellPrice = 5000000;
const maxEstimatePrice = 10000;
const nftItemType = {
  beast: 1,
  warrior: 2,
  legion: 3,
};

const buyingLegionBlockPeriod = 3600 * 24 * 7;
const maxBuyingLegionItemNum = 2;

const displayDuelsBlockPeriod = 3600 * 48;
const maxDuelNumWithSamePlayer = 4;

const symbols = {
  warrior: "W",
  beast: "B",
  attackPower: "AP",
};

const languages = [
  {
    title: "en",
    name: "English",
    img: "en.svg",
  },
  {
    title: "es",
    name: "Spanish",
    img: "es.svg",
  },
  {
    title: "cn",
    name: "Chinese",
    img: "cn.svg",
  },
  {
    title: "pt",
    name: "Portuguese",
    img: "pt.svg",
  },
  {
    title: "tr",
    name: "Turkish",
    img: "tr.svg",
  },
  {
    title: "ru",
    name: "Russian",
    img: "ru.svg",
  },
  {
    title: "fr",
    name: "French",
    img: "fr.svg",
  },
  {
    title: "nl",
    name: "Dutch",
    img: "nl.svg",
  },
  {
    title: "pl",
    name: "Polish",
    img: "pl.svg",
  },
  {
    title: "ph",
    name: "Filipino",
    img: "ph.svg",
  },
  {
    title: "vn",
    name: "Vietnamese",
    img: "vn.png",
  },
  {
    title: "de",
    name: "German",
    img: "de.png",
  },
  {
    title: "ro",
    name: "Romanian",
    img: "ro.png",
  },
  {
    title: "ua",
    name: "Ukrainian",
    img: "ua.png",
  },
  {
    title: "jp",
    name: "Japanese",
    img: "jp.png",
  },
  {
    title: "hi",
    name: "Hindi",
    img: "hi.png",
  },
  {
    title: "th",
    name: "Thai",
    img: "th.png",
  },
  {
    title: "it",
    name: "Italian",
    img: "it.png",
  },
  {
    title: "ar",
    name: "Arabic",
    img: "ar.png",
  },
];

export default {
  version: version.test,
  gameSiteUrl,
  companySiteUrl,
  languages,
  approveBLSTForBeast,
  approveBUSDForLegion,
  approveGoverToken,
  BUSDForPlay,
  gameStartDay,
  maxSellPrice,
  maxEstimatePrice,
  nftItemType,
  symbols,
  gameLongName,
  gameShortName,
  gameMonsterName,
  buyingLegionBlockPeriod,
  maxBuyingLegionItemNum,
  displayDuelsBlockPeriod,
  maxDuelNumWithSamePlayer,
};
