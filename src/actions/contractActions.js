export const RELOAD_CONTRACT_STATUS = "RELOAD_CONTRACT_STATUS";
export const SET_MASS_HUNT_RESULT = "SET_MASS_HUNT_RESULT";
export const INIT_MASS_HUNT_RESULT = "INIT_MASS_HUNT_RESULT";
export const UPDATE_STORE = "UPDATE_STORE";

export const setReloadStatus = (payload) => {
  return {
    type: RELOAD_CONTRACT_STATUS,
    payload: payload,
  };
};

export const setMassHuntResult = (payload) => {
  return {
    type: SET_MASS_HUNT_RESULT,
    payload: payload,
  };
};

export const initMassHuntResult = () => {
  return {
    type: INIT_MASS_HUNT_RESULT,
  };
};

export const updateStore = (payload) => {
  return {
    type: UPDATE_STORE,
    payload: payload,
  };
};
