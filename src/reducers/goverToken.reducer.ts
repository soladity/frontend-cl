import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IGoverToken } from "../types/goverToken.type";

let initialState: IGoverToken = {
  CGABalance: 0,
  GoverTokenBalance: 0,
  CGABalanceInBUSD: 0,
  GoverTokenBalanceInBUSD: 0,
  buyGoverTokenLoading: false,
  sellGoverTokenLoading: false,
};

export const goverTokenSlice = createSlice({
  name: "goverToken",
  initialState,
  reducers: {
    updateGoverTokenState: (state: IGoverToken, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IGoverToken] = action.payload[key];
      });
    },
  },
  extraReducers: (builder) => {},
});

export const { updateGoverTokenState } = goverTokenSlice.actions;

export const goverTokenState = (state: RootState) => state.goverToken;

export default goverTokenSlice.reducer;
