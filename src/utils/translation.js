import { translations } from "../constant/language";

export const getTranslation = (key, _param1, _param2) => {
  const lang = localStorage.getItem("lang")
    ? localStorage.getItem("lang")
    : "en";
  if (key == "gotUnclaimedReward") {
  }
  return _param1
    ? translations[key](_param1, _param2)[lang]
    : translations[key][lang];
};
