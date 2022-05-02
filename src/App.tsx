import * as React from "react";
import AskMetaLogin from "./component/AskMetaLogin/AskMetaLogin";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./wallet";
import View from "./View";
import "./App.css";
import { useSelector } from "react-redux";

function ResponsiveDrawer(props: any) {
  const [loaded, setLoaded] = React.useState(false);
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React();
  console.log(networkActive, networkError, activateNetwork);
  const { reloadContractStatus } = useSelector(
    (state: any) => state.contractReducer
  );

  React.useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        console.log(isAuthorized);
        setLoaded(true);
        if (isAuthorized && !networkActive && !networkError) {
          console.log("activateNetwork");
          activateNetwork(injected);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
    console.log(networkActive);
  }, [activateNetwork, networkActive, networkError]);

  if (loaded) {
    return networkActive ? <View /> : <AskMetaLogin />;
  }
  return <div />;
}

export default ResponsiveDrawer;
