export const RELOAD_CONTRACT_STATUS = "RELOAD_CONTRACT_STATUS";

export const SET_BEAST_IDS = "SET_BEAST_IDS";

export const setReloadStatus = (payload) => {
  return {
    type: RELOAD_CONTRACT_STATUS,
    payload: payload,
  };
};

export const setBeastIds = (payload) => {
  return {
    type: SET_BEAST_IDS,
    payload: payload,
  };
};
