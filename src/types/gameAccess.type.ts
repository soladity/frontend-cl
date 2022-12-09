export interface IGameAccess {
  accessedWarriorCnt: Number;
  busdLimitPer6Hours: Number;
  earlyAccessFeePerWarrior: Number;
  purchasedBusdInPeriod: Number;
  firstPurchaseTime: Number;
  buyEarlyAccessLoading: boolean;

  earlyAccessTurnOff: boolean;
  EAPurchasedStatus: boolean;
}
