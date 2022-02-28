import * as React from "react";
import AskMetaLogin from "./component/AskMetaLogin/AskMetaLogin";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./wallet";
import View from "./View";
import "./App.css";
import { useSelector } from 'react-redux'

function ResponsiveDrawer(props: any) {
  const [loaded, setLoaded] = React.useState(false);
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React();


  const { reloadContractStatus } = useSelector(
    (state: any) => state.contractReducer
  );

  // const path = window.location.pathname;
  // function stringRemover(str: string): string {
  //   if (str[str.length - 1] === "/") {
  //     return stringRemover(str.slice(0, str.length - 1));
  //   }
  //   return str;
  // }
  // if (path.length !== 1 && path[path.length - 1] === "/") {
  //   window.location.href = window.location.origin + stringRemover(path);
  // }

  React.useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true);
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [activateNetwork, networkActive, networkError]);

  if (loaded) {
    return networkActive ? <View /> : <AskMetaLogin />;
  }
  return <div />;
}

export default ResponsiveDrawer;
