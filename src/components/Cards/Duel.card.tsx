import { Box, Card, CardMedia, Typography, Skeleton } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { IDuel, IDivision } from "../../types";
import { AppSelector } from "../../store";
import { filterAndPageState } from "../../reducers/filterAndPage.reducer";
import { duelState, updateDuelState } from "../../reducers/duel.reducer";
import { legionState } from "../../reducers/legion.reducer";
import { updateModalState } from "../../reducers/modal.reducer";
import FireBtn from "../Buttons/FireBtn";
import GreyBtn from "../Buttons/GreyBtn";
import { getTranslation, formatNumber } from "../../utils/utils";
import { cancelDuel } from "../../web3hooks/contractFunctions/duel.contract";
import { useLegion, useDuelSystem, useWeb3 } from "../../web3hooks/useContract";
import DuelService from "../../services/duel.service";
import constants from "../../constants";

type Props = {
  duel: IDuel;
};

const DuelCard: React.FC<Props> = ({ duel }) => {
  // Hook info
  const dispatch = useDispatch();

  const web3 = useWeb3();
  const { duelStatus } = AppSelector(filterAndPageState);
  const { allDuels, divisions } = AppSelector(duelState);
  const { allLegions } = AppSelector(legionState);
  const { account } = useWeb3React();
  const duelContract = useDuelSystem();
  const legionContract = useLegion();

  const [loaded, setLoaded] = useState(false);
  const [leftTime, setLeftTime] = useState("");
  const [duelFlag, setDuelFlag] = useState(false);

  const duelResult = () => {
    const priceDifference1 =
      Math.round(
        Math.abs(duel.result.valueOf() - duel.creatorEstmatePrice.valueOf()) *
          100
      ) / 100;
    const priceDifference2 =
      Math.round(
        Math.abs(duel.result.valueOf() - duel.joinerEstmatePrice.valueOf()) *
          100
      ) / 100;
    if (priceDifference1 == priceDifference2) {
      return 0;
    } else if (priceDifference1 > priceDifference2) {
      return 1;
    } else {
      return 2;
    }
  };

  useEffect(() => {
    setDuelFlag(false);
    divisions.forEach((division: IDivision) => {
      if (
        duel.creatorLegion.attackPower >= division.minAP &&
        duel.creatorLegion.attackPower < division.maxAP
      ) {
        allLegions.forEach((legion) => {
          if (
            legion.attackPower >= division.minAP &&
            legion.attackPower < division.maxAP
          ) {
            setDuelFlag(true);
          }
        });
      }
    });
  }, [allDuels]);

  useEffect(() => {
    const leftTimer = setInterval(() => {
      const left_time =
        new Date(duel.endDateTime.valueOf()).getTime() - new Date().getTime();
      setLeftTime(
        "" +
          Math.floor(left_time / (60 * 60 * 1000)) +
          "h " +
          Math.floor((left_time % (60 * 60 * 1000)) / (60 * 1000)) +
          "m " +
          Math.floor((left_time % (60 * 1000)) / 1000) +
          "s"
      );
    }, 1000);
    return () => clearInterval(leftTimer);
  }, []);

  const handleDuelBtnClick = () => {
    dispatch(
      updateModalState({
        joinDuelModalOpen: true,
        endDateJoinDuel: duel.endDateTime.valueOf(),
      })
    );
    dispatch(
      updateDuelState({
        currentDuelId: duel.duelId.valueOf(),
      })
    );
  };

  const handleUpdatePrediction = () => {
    dispatch(
      updateModalState({
        updatePredictionModalOpen: true,
      })
    );
    dispatch(
      updateDuelState({
        currentDuelId: duel.duelId.valueOf(),
        endDateJoinDuel: duel.endDateTime.valueOf(),
      })
    );
  };

  const handleCancelDuel = async () => {
    try {
      dispatch(
        updateDuelState({
          cancelDuelLoading: true,
        })
      );
      const res = await cancelDuel(duelContract, account, duel.duelId);
      dispatch(
        updateDuelState({
          cancelDuelLoading: false,
        })
      );
      toast.success("Success");
      DuelService.getAllDuelsAct(
        dispatch,
        web3,
        account,
        duelContract,
        legionContract
      );
    } catch (e) {
      dispatch(
        updateDuelState({
          cancelDuelLoading: false,
        })
      );
      console.log("Cancel duel error: ", e);
    }
  };

  const handleDeleteBtnClick = () => {
    Swal.fire({
      title: getTranslation("cancelDuel"),
      text: getTranslation("areYouSure"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: constants.color.color2,
      cancelButtonColor: "#d33",
      confirmButtonText: getTranslation("cancelDuel"),
      cancelButtonText: getTranslation("keepDuel"),
      background: "#111",
      color: "white",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancelDuel();
      }
    });
  };

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  return (
    <Box>
      {duelStatus.valueOf() == 1 ? (
        <>
          <Card sx={{ position: "relative" }}>
            <CardMedia
              component={"img"}
              image={duel.creatorLegion.jpg.valueOf()}
              alt="Legion Image"
              loading="lazy"
              onLoad={handleImageLoaded}
            />
            {loaded === false && (
              <React.Fragment>
                <Skeleton variant="rectangular" width="100%" height="200px" />
                <Skeleton />
                <Skeleton width="60%" />
              </React.Fragment>
            )}
            <Typography variant="h6" className="legion-name-text">
              {duel.creatorLegion.name}
            </Typography>
            <Box className="duel-left-time">
              <Typography sx={{ fontWeight: "bold" }}>{leftTime}</Typography>
            </Box>
            <Box
              className="legion-ap-div"
              sx={{
                left: "calc(50% - 50px)",
              }}
            >
              <Typography variant="h6" className="legion-ap-text">
                {formatNumber(duel.creatorLegion.attackPower)} AP
              </Typography>
            </Box>
            <Typography variant="subtitle2" className="legion-id-text">
              #{duel.creatorLegion.id}
            </Typography>
            <Box className="duel-cancel-div">
              <img
                src="/assets/images/execute.png"
                style={{
                  width: "1.5em",
                }}
                alt="allin"
                onClick={handleDeleteBtnClick}
              />
            </Box>
            <Box className="duel-price-div">
              {!duel.type && (
                <img
                  src="/assets/images/allinduel.png"
                  style={{
                    width: "15px",
                  }}
                  alt="allin"
                />
              )}
              &nbsp;
              <Typography variant="subtitle2" className="duel-bet-price-text">
                {"$" + duel.betPrice}
              </Typography>
            </Box>
          </Card>
          <Box sx={{ textAlign: "center", mt: 1 }}>
            {duel.isMine ? (
              <FireBtn
                sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                onClick={handleUpdatePrediction}
              >
                {getTranslation("updateprediction")}
              </FireBtn>
            ) : duelFlag ? (
              <FireBtn
                sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                onClick={handleDuelBtnClick}
              >
                {getTranslation("duel")}
              </FireBtn>
            ) : (
              <GreyBtn
                sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                onClick={handleDuelBtnClick}
              >
                {getTranslation("duel")}
              </GreyBtn>
            )}
          </Box>
        </>
      ) : duelStatus.valueOf() == 2 ? (
        <>
          <Box
            sx={{
              border: "6px #00d0ff solid",
              padding: "4px",
              display: "flex",
              flexDirection: "row",
              position: "relative",
            }}
          >
            <Card sx={{ position: "relative" }}>
              <CardMedia
                component={"img"}
                image={duel.creatorLegion.jpg.valueOf()}
                alt="Legion Image"
                loading="lazy"
                onLoad={handleImageLoaded}
              />
              {loaded === false && (
                <React.Fragment>
                  <Skeleton variant="rectangular" width="100%" height="200px" />
                  <Skeleton />
                  <Skeleton width="60%" />
                </React.Fragment>
              )}
              <Typography variant="h6" className="legion-name-text">
                {duel.creatorLegion.name}
              </Typography>
              <Box
                className="legion-ap-div"
                sx={{
                  left: "calc(50% - 50px)",
                }}
              >
                <Typography variant="h6" className="legion-ap-text">
                  {formatNumber(duel.creatorLegion.attackPower)} AP
                </Typography>
              </Box>
              <Typography variant="subtitle2" className="legion-id-text">
                #{duel.creatorLegion.id}
              </Typography>
            </Card>
            <Card sx={{ position: "relative", marginLeft: "10px" }}>
              <CardMedia
                component={"img"}
                image={duel.joinerLegion.jpg.valueOf()}
                alt="Legion Image"
                loading="lazy"
                onLoad={handleImageLoaded}
              />
              {loaded === false && (
                <React.Fragment>
                  <Skeleton variant="rectangular" width="100%" height="200px" />
                  <Skeleton />
                  <Skeleton width="60%" />
                </React.Fragment>
              )}
              <Typography variant="h6" className="legion-name-text">
                {duel.joinerLegion.name}
              </Typography>
              <Box
                className="legion-ap-div"
                sx={{
                  left: "calc(50% - 50px)",
                }}
              >
                <Typography variant="h6" className="legion-ap-text">
                  {formatNumber(duel.joinerLegion.attackPower)} AP
                </Typography>
              </Box>
              <Typography variant="subtitle2" className="legion-id-text">
                #{duel.joinerLegion.id}
              </Typography>
            </Card>
            <Box className="duel-estimate-price-div">
              <Typography className="estimate-price">
                ${duel.creatorEstmatePrice}
              </Typography>
              <Typography className="estimate-price">
                ${duel.joinerEstmatePrice}
              </Typography>
            </Box>
            <Box
              sx={{
                width: "30%",
                position: "absolute",
                top: "7%",
                left: "40%",
              }}
            >
              <img
                src="/assets/images/vs.png"
                style={{
                  width: "70%",
                }}
                alt="VS"
              />
            </Box>
            <Box className="duel-left-time">
              <Typography
                className="duel-left-time-text"
                sx={{ fontWeight: "bold" }}
              >
                {leftTime}
              </Typography>
            </Box>
            <Box className="duel-price-div">
              {!duel.type && (
                <img
                  src="/assets/images/allinduel.png"
                  style={{
                    width: "15px",
                  }}
                  alt="allin"
                />
              )}
              &nbsp;
              <Typography variant="subtitle2" className="duel-bet-price-text">
                {"$" + duel.betPrice}
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              border: "6px #195fb4 solid",
              padding: "4px",
              display: "flex",
              flexDirection: "row",
              position: "relative",
            }}
          >
            <Card sx={{ position: "relative" }}>
              <CardMedia
                component={"img"}
                image={duel.creatorLegion.jpg.valueOf()}
                alt="Legion Image"
                loading="lazy"
                onLoad={handleImageLoaded}
                sx={{
                  border: "4px solid",
                  borderColor:
                    duelResult() == 0
                      ? "orange"
                      : duelResult() == 1
                      ? "red"
                      : "green",
                }}
              />
              {loaded === false && (
                <React.Fragment>
                  <Skeleton variant="rectangular" width="100%" height="200px" />
                  <Skeleton />
                  <Skeleton width="60%" />
                </React.Fragment>
              )}
              <Typography variant="h6" className="legion-name-text">
                {duel.creatorLegion.name}
              </Typography>
              <Box
                className="legion-ap-div"
                sx={{
                  left: "calc(50% - 50px)",
                }}
              >
                <Typography variant="h6" className="legion-ap-text">
                  {formatNumber(duel.creatorLegion.attackPower)} AP
                </Typography>
              </Box>
              <Typography variant="subtitle2" className="legion-id-text">
                #{duel.creatorLegion.id}
              </Typography>
            </Card>
            <Card sx={{ position: "relative", marginLeft: "10px" }}>
              <CardMedia
                component={"img"}
                image={duel.joinerLegion.jpg.valueOf()}
                alt="Legion Image"
                loading="lazy"
                onLoad={handleImageLoaded}
                sx={{
                  border: "4px solid",
                  borderColor:
                    duelResult() == 0
                      ? "orange"
                      : duelResult() == 1
                      ? "green"
                      : "red",
                }}
              />
              {loaded === false && (
                <React.Fragment>
                  <Skeleton variant="rectangular" width="100%" height="200px" />
                  <Skeleton />
                  <Skeleton width="60%" />
                </React.Fragment>
              )}
              <Typography variant="h6" className="legion-name-text">
                {duel.joinerLegion.name}
              </Typography>
              <Box
                className="legion-ap-div"
                sx={{
                  left: "calc(50% - 50px)",
                }}
              >
                <Typography variant="h6" className="legion-ap-text">
                  {formatNumber(duel.joinerLegion.attackPower)} AP
                </Typography>
              </Box>
              <Typography variant="subtitle2" className="legion-id-text">
                #{duel.joinerLegion.id}
              </Typography>
            </Card>
            <Box className="duel-estimate-price-div">
              <Typography
                className={
                  duelResult() == 0
                    ? "draw-price-text"
                    : duelResult() == 1
                    ? "loser-price-text"
                    : "winner-price-text"
                }
              >
                ${duel.creatorEstmatePrice}
              </Typography>
              <Typography
                className={
                  duelResult() == 0
                    ? "draw-price-text"
                    : duelResult() == 2
                    ? "loser-price-text"
                    : "winner-price-text"
                }
              >
                ${duel.joinerEstmatePrice}
              </Typography>
            </Box>
            <Box
              sx={{
                width: "30%",
                position: "absolute",
                top: "7%",
                left: "40%",
              }}
            >
              <img
                src="/assets/images/vs.png"
                style={{
                  width: "70%",
                }}
                alt="VS"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                position: "absolute",
                bottom: "20%",
                left: "0%",
              }}
            >
              <Typography className="duel-result-price-text">
                {getTranslation("cryptopricewas", {
                  CL1: duel.result,
                })}
              </Typography>
            </Box>
            <Box className="duel-left-time">
              <Typography
                className="duel-left-time-text"
                sx={{ fontWeight: "bold" }}
              >
                {duel.endDateTime}
              </Typography>
            </Box>
            <Box className="duel-price-div">
              {!duel.type && (
                <img
                  src="/assets/images/allinduel.png"
                  style={{
                    width: "15px",
                  }}
                  alt="allin"
                />
              )}
              &nbsp;
              <Typography variant="subtitle2" className="duel-bet-price-text">
                {"$" + duel.betPrice}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DuelCard;
