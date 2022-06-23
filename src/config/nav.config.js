import React from "react";
import { Navigate } from "react-router";
import Monsters from "../containers/Monsters/Monsters";
import Home from "../containers/Home/Home";
import Beasts from "../containers/Beasts/Beasts";
import Warriors from "../containers/Warriors/Warriors";
import Legions from "../containers/Legions/Legions";
import WarriorsMarketplace from "../containers/Marketplace/Warriors";
import BeastsMarketplace from "../containers/Marketplace/Beasts";
import LegionsMarketplace from "../containers/Marketplace/Legions";
import CreateLegions from "../containers/CreateLegions/CreateLegions";
import UpdateLegions from "../containers/UpdateLegions";
import Profile from "../containers/Profile/Profile";
import Policy from "../containers/Policy/Policy";
import Help from "../containers/Help/Help";
import Tips from "../containers/Tips/Tips";
import MassExecute from "../containers/MassExecute/MassExecute";
import HuntingHistory from "../containers/HuntingHistory/HuntingHistory";

export const navConfig = {
  drawerWidth: 250,
  routes: () => [
    {
      path: "/",
      element: <Home />,
      children: [],
    },
    {
      path: "/hunt",
      element: <Monsters />,
    },
    {
      path: "/beasts",
      element: <Beasts />,
    },
    {
      path: "/warriors",
      element: <Warriors />,
    },
    {
      path: "/legions",
      element: <Legions />,
    },
    {
      path: "/warriorsMarketplace",
      element: <WarriorsMarketplace />,
    },
    {
      path: "/beastsMarketplace",
      element: <BeastsMarketplace />,
    },
    {
      path: "/legionsMarketplace",
      element: <LegionsMarketplace />,
    },
    {
      path: "/createlegions",
      element: <CreateLegions />,
    },
    {
      path: "/updatelegions/:id",
      element: <UpdateLegions />,
    },
    {
      path: "/massexecute",
      element: <MassExecute />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/policy",
      element: <Policy />,
    },
    {
      path: "/help",
      element: <Help />,
    },
    {
      path: "/tips",
      element: <Tips />,
    },
    {
      path: "/huntinghistory",
      element: <HuntingHistory />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ],

  navBar: {
    left: [
      {
        type: "head",
        title: "play",
      },
      {
        type: "navlink",
        title: "warriors",
        icon: "warrior.png",
        path: "/warriors",
      },
      {
        type: "navlink",
        title: "beasts",
        icon: "beast.png",
        path: "/beasts",
      },
      {
        type: "navlink",
        title: "legions",
        icon: "legion.png",
        path: "/legions",
      },
      {
        type: "navlink",
        title: "hunt",
        icon: "hunt.png",
        path: "/hunt",
      },
      {
        type: "navlink",
        title: "huntinghistory",
        icon: "hunt.png",
        path: "/huntinghistory",
      },
      {
        type: "divider",
      },
      {
        type: "head",
        title: "market",
      },
      {
        type: "navlink",
        title: "warriors",
        icon: "marketWarrior.png",
        path: "/warriorsMarketplace",
      },
      {
        type: "navlink",
        title: "beasts",
        icon: "marketBeast.png",
        path: "/beastsMarketplace",
      },
      {
        type: "navlink",
        title: "legions",
        icon: "marketLegion.png",
        path: "/legionsMarketplace",
      },
      {
        type: "divider",
      },
      {
        type: "head",
        title: "usefulLinks",
      },
      {
        type: "link",
        title: "buyBlst",
        icon: "pancake.png",
        path: "https://pancakeswap.finance/swap?outputCurrency=0x10cb66ce2969d8c8193707A9dCD559D2243B8b37&inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      },
      {
        type: "navlink",
        title: "help",
        icon: "support.png",
        path: "/help",
      },
      {
        type: "divider",
      },
      {
        type: "head",
        title: "howToPlay",
      },
      {
        type: "tutorial",
        title: "help",
        icon: "tutorial.png",
      },
      {
        type: "link",
        title: "whitepaper",
        icon: "whitepaper.png",
        path: "https://docs.cryptolegions.app/",
        esPath: "https://docs-es.cryptolegions.app/",
      },
      {
        type: "navlink",
        title: "tips",
        icon: "tips.png",
        path: "/tips",
      },
      {
        type: "social",
        title: "discord",
        icon: "/assets/images/discord.png",
        path: "https://cryptolegions.app/d",
      },
      {
        type: "social",
        title: "telegram",
        icon: "/assets/images/telegram.png",
        path: "https://cryptolegions.app/t",
      },
      {
        type: "social",
        title: "twitter",
        icon: "/assets/images/twitter.png",
        path: "https://cryptolegions.app/tw",
      },
      {
        type: "social",
        title: "youtube",
        icon: "/assets/images/youtube.png",
        path: "https://cryptolegions.app/y",
      },
      {
        type: "social",
        title: "medium",
        icon: "/assets/images/medium.png",
        path: "https://cryptolegions.app/m",
      },
      {
        type: "privacy",
        title: "policy",
        icon: "policy",
        path: "/policy",
      },
      {
        type: "footer",
        title1: "madeWith",
        title2: "cryptoAgency",
      },
    ],
    top: [],
  },
};
