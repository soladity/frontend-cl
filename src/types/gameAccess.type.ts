export interface IGameAccess {
  accessedWarriorCnt: Number;
  busdLimitPer6Hours: Number;
  earlyAccessFeePerWarrior: Number;
  purchasedBusdInPeriod: Number;
  firstPurchaseTime: Number;
  bonusChance: Number;
  buyEarlyAccessLoading: boolean;

  earlyAccessTurnOff: boolean;
  EAPurchasedStatus: boolean;
}
