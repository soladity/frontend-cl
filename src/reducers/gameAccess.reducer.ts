import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IGameAccess } from "../types/gameAccess.type";

let initialState: IGameAccess = {
  accessedWarriorCnt: 0,
  busdLimitPer6Hours: 0,
  earlyAccessFeePerWarrior: 0,
  purchasedBusdInPeriod: 0,
  firstPurchaseTime: 0,
  buyEarlyAccessLoading: false,
  earlyAccessTurnOff: false,
  EAPurchasedStatus: false,
};

export const gameAccessSlice = createSlice({
  name: "gameAccess",
  initialState,
  reducers: {
    updateGameAccessState: (state: IGameAccess, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IGameAccess] = action.payload[key];
      });
    },
  },
  extraReducers: (builder) => {},
});

export const { updateGameAccessState } = gameAccessSlice.actions;

export const gameAccessState = (state: RootState) => state.gameAccess;

export default gameAccessSlice.reducer;
