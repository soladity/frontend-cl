import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import {
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  Card,
  Button,
  CircularProgress,
} from "@mui/material";
import { meta_constant } from "../../config/meta.config";
import { getTranslation } from "../../utils/translation";
import { gql, useLazyQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { makeStyles } from "@mui/styles";
import { toCapitalize } from "../../utils/common";
import monstersInfo from "../../constant/monsters";
import CommonBtn from "../../component/Buttons/CommonBtn";
import moment from "moment";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles(() => ({
  MassHuntItemLose: {
    boxShadow:
      "rgb(0 0 0 / 37%) 0px 2px 4px 0px, rgb(14 30 37 / 85%) 0px 2px 16px 0px",
    borderRadius: 5,
    background: "#630000",
  },
  MassHuntItemWin: {
    boxShadow:
      "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    animation: `$Flash linear 2s infinite`,
    borderRadius: 5,
    background: "#074900",
  },
  "@keyframes Flash": {
    "0%": {
      boxShadow:
        "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    },
    "50%": {
      boxShadow:
        "rgb(247 247 247 / 30%) 0px 2px 4px 0px, rgb(217 221 206 / 40%) 0px 2px 16px 0px",
    },
    "100%": {
      boxShadow:
        "rgb(247 247 247 / 55%) 0px 2px 4px 0px, rgb(217 221 206 / 85%) 0px 2px 16px 0px",
    },
  },
}));

const HuntingHistory = () => {
  const query = gql`
    query Query($first: Int, $skip: Int, $address: String) {
      huntingHistories(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
        where: { _addr: $address }
      ) {
        id
        _addr
        name
        legionId
        monsterId
        roll
        percent
        success
        reward
        block
        timestamp
      }
    }
  `;
  const { account } = useWeb3React();

  // const account = "0xa4BE18916Ea055D87366413e4F4b249Cb02D945E";
  const classes = useStyles();

  const [huntHistory, setHuntHistory] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(12);
  const [loadMoreBtnShow, setLoadMoreBtnShow] = useState(true);
  const [showAnimation, setShowAnimation] = useState<string | null>("0");

  const [loadEntries, { loading, error, data: entriesData }] =
    useLazyQuery(query);

  console.log(entriesData);

  useEffect(() => {
    setShowAnimation(
      localStorage.getItem("showAnimation")
        ? localStorage.getItem("showAnimation")
        : "0"
    );
    if (account) {
      getHistory(0);
    }
  }, []);

  useEffect(() => {
    const entries = entriesData?.huntingHistories
      ? entriesData.huntingHistories
      : [];
    let temp: any[] = huntHistory;
    temp = temp.concat(entries);
    console.log(entries);
    if (entriesData && entries.length < pageSize) {
      setLoadMoreBtnShow(false);
    }
    setHuntHistory(temp);
  }, [entriesData]);

  useEffect(() => {
    console.log(huntHistory);
  }, [huntHistory]);

  const getHistory = (skip: number) => {
    if (loadMoreBtnShow)
      loadEntries({
        variables: { first: pageSize, skip: skip, address: account },
      });
  };

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta_constant.monster.title}</title>
        <meta name="description" content={meta_constant.monster.description} />
        {meta_constant.monster.keywords && (
          <meta
            name="keywords"
            content={meta_constant.monster.keywords.join(",")}
          />
        )}
      </Helmet>
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Card>
            <Box
              // className={classes.warning}
              sx={{ p: 4, justifyContent: "start", alignItems: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  // flexDirection: "column",
                  mx: 4,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {getTranslation("hunthistory")}
                </Typography>
                <NavLink to="/hunt" className="non-style">
                  <CommonBtn style={{ fontWeight: "bold" }}>
                    {getTranslation("hunt")}
                  </CommonBtn>
                </NavLink>
              </Box>
            </Box>
          </Card>
        </Grid>
        {huntHistory.map((item: any, index: number) => (
          <Grid item xs={6} md={4} lg={2} key={index}>
            <Box
              key={index}
              className={
                item.success
                  ? classes.MassHuntItemWin
                  : classes.MassHuntItemLose
              }
              sx={{
                textAlign: "center",
                margin: 1,
                p: 1,
              }}
            >
              <Box sx={{ fontSize: 12, mb: 1, mt: 1, fontWeight: "bold" }}>
                <span>
                  {moment(new Date(item.timestamp * 1000)).format("YYYY-MM-DD")}
                </span>
              </Box>
              {item.success ? (
                <img
                  src={
                    showAnimation === "0"
                      ? item["monsterId"] == 24
                        ? `/monster_dying_end/m24end.jpg`
                        : `/assets/images/characters/jpg/monsters_dying/m${item["monsterId"]}.jpg`
                      : item["monsterId"] == 24
                      ? `/monster_dying_end/m24end.gif`
                      : `/assets/images/characters/gif/monsters_dying/m${item["monsterId"]}.gif`
                  }
                  style={{ width: "100%" }}
                />
              ) : (
                <img
                  src={
                    showAnimation === "0"
                      ? `/assets/images/characters/jpg/monsters/m${item["monsterId"]}.jpg`
                      : `/assets/images/characters/gif/monsters/m${item["monsterId"]}.gif`
                  }
                  style={{ width: "100%" }}
                />
              )}
              <Box sx={{ p: 1, wordBreak: "break-word" }}>{item.name}</Box>
              <Box sx={{ fontSize: 12 }}>
                <span style={{ fontWeight: "bold" }}>
                  #{item.monsterId}{" "}
                  {toCapitalize(
                    monstersInfo[parseInt(item.monsterId) - 1].name
                  )}
                </span>
              </Box>
              <Box sx={{ fontSize: 12 }}>
                <span>
                  {getTranslation("maxRoll")}: {item.percent}
                </span>
              </Box>
              <Box sx={{ fontSize: 12 }}>
                <span>
                  {getTranslation("yourRoll")}: {item.roll}
                </span>
              </Box>
              <Box sx={{ p: 1, fontSize: 12, fontWeight: "bold" }}>
                {item.success ? (
                  <span>
                    {getTranslation("won")}{" "}
                    {(item.reward / 10 ** 18).toFixed(0)} $BLST
                  </span>
                ) : (
                  <span>{getTranslation("lost")}</span>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      {loadMoreBtnShow && !loading && (
        <Box sx={{ textAlign: "center" }}>
          <CommonBtn
            style={{ fontWeight: "bold" }}
            onClick={() => getHistory(huntHistory.length)}
          >
            {getTranslation("loadmore")}
          </CommonBtn>
        </Box>
      )}
      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {huntHistory.length === 0 && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {getTranslation("nohistory")}
          </Typography>

          <NavLink to="/hunt" className="non-style">
            <CommonBtn style={{ fontWeight: "bold" }}>
              {getTranslation("gohuntmore")}
            </CommonBtn>
          </NavLink>
        </Box>
      )}
    </Box>
  );
};

export default HuntingHistory;
