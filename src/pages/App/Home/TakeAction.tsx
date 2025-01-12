import React, { useState, useEffect } from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import FireBtn from "../../../components/Buttons/FireBtn";
import MassHuntModal from "../../../components/Modals/MassHunt.modal";
import SummonBeastPopover from "../../../components/Popover/SummonBeast.popover";
import SummonWarriorPopover from "../../../components/Popover/SummonWarrior.popover";
import constants from "../../../constants";
import { AppSelector } from "../../../store";
import { getTranslation } from "../../../utils/utils";
import {
  useBeast,
  useCGA,
  useGameAccess,
  useGameGovernanceToken,
  useLegion,
  useMonster,
  usePancakeSwapRouter,
  useVRF,
  useWarrior,
  useWeb3,
} from "../../../web3hooks/useContract";
import { beastState } from "../../../reducers/beast.reducer";
import { warriorState } from "../../../reducers/warrior.reducer";
import {
  legionState,
  updateLegionState,
} from "../../../reducers/legion.reducer";
import HuntService from "../../../services/hunt.service";
import WarriorService from "../../../services/warrior.service";
import { updateCommonState } from "../../../reducers/common.reduer";
import BeastService from "../../../services/beast.service";
import { navLinks } from "../../../config/nav.config";
import { updateModalState } from "../../../reducers/modal.reducer";
import SwapGovernanceTokenModal from "../../../components/Modals/SwapGovernanceToken.modal";
import GoverTokenService from "../../../services/goverToken.service";
import { gameAccessState } from "../../../reducers/gameAccess.reducer";
import ModalService from "../../../services/modal.service";

const TakeAction: React.FC = () => {
  const dispatch = useDispatch();
  const {
    mintBeastPending,
    mintBeastVRFPending,
    initialMintBeastLoading,
    revealBeastLoading,
  } = AppSelector(beastState);
  const {
    mintWarriorPending,
    mintWarriorVRFPending,
    initialMintWarriorLoading,
    revealWarriorLoading,
  } = AppSelector(warriorState);
  const { allLegions, massHuntPending } = AppSelector(legionState);
  const { earlyAccessTurnOff, accessedWarriorCnt } =
    AppSelector(gameAccessState);

  // Account & Web3
  const web3 = useWeb3();
  const { account } = useWeb3React();

  // Contracts
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();
  const vrfContract = useVRF();
  const monsterContract = useMonster();
  const CGAContract = useCGA();
  const goverTokenContract = useGameGovernanceToken();
  const routerContract = usePancakeSwapRouter();
  const gameAccessContract = useGameAccess();

  // States

  const canMassHunt = allLegions.reduce(
    (a, b) => a || b.huntStatus.valueOf(),
    false
  );

  useEffect(() => {
    getBalance();
  }, [account]);

  const getBalance = () => {
    HuntService.checkMassHuntPending(dispatch, account, legionContract);
    HuntService.getAllMonstersAct(dispatch, monsterContract);
  };

  const handleSummonWarriorPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (mintWarriorPending) {
      WarriorService.revealWarrior(dispatch, account, warriorContract);
    } else {
      dispatch(
        updateCommonState({ summonWarriorAnchorEl: event.currentTarget })
      );
    }
  };

  const handleSummonBeastPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (mintBeastPending) {
      BeastService.revealBeast(dispatch, account, beastContract);
    } else {
      dispatch(updateCommonState({ summonBeastAnchorEl: event.currentTarget }));
    }
  };

  const handleInitialMassHunt = async () => {
    HuntService.handleInitialMassHunt(
      dispatch,
      account,
      legionContract,
      vrfContract,
      gameAccessContract
    );
  };

  const handleRevealMassHunt = () => {
    dispatch(updateLegionState({ revealMassHuntLoading: true }));
  };

  const handleOpenSwapGovernanceTokenModal = () => {
    GoverTokenService.getCGAandGoverTokenBalance(
      dispatch,
      web3,
      account,
      CGAContract,
      goverTokenContract,
      routerContract
    );
    dispatch(updateModalState({ swapGovernanceTokenModalOpen: true }));
  };

  const handleEarlyAccessModalOpen = (open: boolean) => {
    ModalService.handleEarlyAccessModalOpen(dispatch, open);
  };

  return (
    <Card
      className="bg-c4"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 4, justifyContent: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid #fff",
            marginBottom: 3,
          }}
        >
          {getTranslation("takeAction")}
        </Typography>
        <Box>
          <Grid container spacing={{ xs: 2, sm: 2, md: 1, lg: 2 }}>
            <Grid
              item
              xs={6}
              md={12}
              lg={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box>
                <FireBtn
                  sx={{
                    mb: 1,
                    width: "100%",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                  aria-describedby="summon-warrior-btn"
                  onClick={handleSummonWarriorPopover}
                  loading={
                    initialMintWarriorLoading.valueOf() ||
                    revealWarriorLoading.valueOf() ||
                    mintWarriorVRFPending.valueOf()
                  }
                >
                  <img
                    src={`/assets/images/dashboard/warrior.png`}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "5px",
                    }}
                    alt="icon"
                  />
                  {mintWarriorPending
                    ? getTranslation("revealWarriors")
                    : getTranslation("summonWarriors")}
                </FireBtn>
                <FireBtn
                  sx={{
                    mb: 1,
                    width: "100%",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                  aria-describedby="summon-beast-btn"
                  onClick={handleSummonBeastPopover}
                  loading={
                    initialMintBeastLoading.valueOf() ||
                    revealBeastLoading.valueOf() ||
                    mintBeastVRFPending.valueOf()
                  }
                >
                  <img
                    src={`/assets/images/dashboard/beast.png`}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "5px",
                    }}
                    alt="icon"
                  />
                  {mintBeastPending
                    ? getTranslation("revealBeasts")
                    : getTranslation("summonBeasts")}
                </FireBtn>
                <NavLink to={navLinks.createlegion} className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/legion.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    {getTranslation("createLegion")}
                  </FireBtn>
                </NavLink>
                <NavLink to={navLinks.hunt} className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/hunt.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    {getTranslation("hunt")}
                  </FireBtn>
                </NavLink>
                <FireBtn
                  sx={{
                    mb: 1,
                    width: "100%",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                  disabled={!canMassHunt}
                  onClick={() => {
                    !massHuntPending
                      ? handleInitialMassHunt()
                      : handleRevealMassHunt();
                  }}
                >
                  <img
                    src={`/assets/images/dashboard/masshuntIcon.png`}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "5px",
                    }}
                    alt="icon"
                  />
                  {getTranslation("massHunt")}
                </FireBtn>
                <a href={"#"} target="_blank" className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    {/* <img
                      src={`/assets/images/dashboard/chart.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    /> */}
                    {getTranslation("buy$CGA")}
                  </FireBtn>
                </a>
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              md={12}
              lg={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box>
                <NavLink to={navLinks.warriorsmarketplace} className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/marketWarrior.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    {getTranslation("warriorsMarket")}
                  </FireBtn>
                </NavLink>
                <NavLink to={navLinks.beastsmarketplace} className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/marketBeast.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    {getTranslation("beastsMarket")}
                  </FireBtn>
                </NavLink>
                <NavLink to={navLinks.legionsmarketplace} className="td-none">
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/marketLegion.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    {getTranslation("legionsMarket")}
                  </FireBtn>
                </NavLink>
                <a
                  href={constants.navlink.dextool}
                  target="_blank"
                  className="td-none"
                >
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/chart.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    {getTranslation("dextoolsChart")}
                  </FireBtn>
                </a>
                <a
                  href={constants.navlink.pancake}
                  target="_blank"
                  className="td-none"
                >
                  <FireBtn
                    sx={{
                      mb: 1,
                      width: "100%",
                      wordBreak: "break-word",
                      fontSize: 14,
                    }}
                  >
                    <img
                      src={`/assets/images/dashboard/pancake.png`}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "5px",
                      }}
                      alt="icon"
                    />
                    {getTranslation("buyBLST")}
                  </FireBtn>
                </a>
                <FireBtn
                  sx={{
                    mb: 1,
                    width: "100%",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                  onClick={() => handleOpenSwapGovernanceTokenModal()}
                >
                  {/* <img
                    src={`/assets/images/dashboard/pancake.png`}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "5px",
                    }}
                    alt="icon"
                  /> */}
                  {getTranslation("swap$GoverToken")}
                </FireBtn>
              </Box>
            </Grid>
            {!earlyAccessTurnOff && (
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Box className="fc1" sx={{ fontWeight: "bold" }}>
                  {getTranslation("earlyAccessLeftForWarriors")}
                  <span className="fc2">
                    {accessedWarriorCnt} {getTranslation("warriors")}
                  </span>
                </Box>
                <FireBtn
                  sx={{
                    wordBreak: "break-word",
                    // fontSize: 14,
                    px: 2,
                  }}
                  size="small"
                  onClick={() => handleEarlyAccessModalOpen(true)}
                >
                  {getTranslation("buyEarlyAccess")}
                </FireBtn>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
      <SummonWarriorPopover />
      <SummonBeastPopover />
      <MassHuntModal />
      <SwapGovernanceTokenModal />
    </Card>
  );
};

export default TakeAction;
