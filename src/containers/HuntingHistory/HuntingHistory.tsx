import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { Box, Divider, Grid, Paper, Typography, Card } from "@mui/material";
import ReactPlayer from "react-player/youtube";
import { tipsConstant } from "../../constant";
import { meta_constant } from "../../config/meta.config";
import { getTranslation } from "../../utils/translation";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const HuntingHistory = () => {
  const endpoint =
    "https://api.thegraph.com/subgraphs/name/feloniousgru-super/cryptolegions";
  const query = `
    query($first: Int) {
      huntingHistories(first: $first) {
        id
        _addr
        name
        legionId
      }
    }
  `;

  const client = new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    console.log(query);
    client
      .query({
        query: gql(query),
        variables: {
          first: 5,
        },
      })
      .then((data) => console.log("Subgraph data: ", data))
      .catch((err) => {
        console.log("Error fetching data: ", err);
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
              <Box sx={{ display: "flex", flexDirection: "column", mx: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {getTranslation("huntinghistory")}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>ds</Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HuntingHistory;
