import React from "react";
import Helmet from "react-helmet";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import ReactPlayer from "react-player/youtube";
import { tipsConstant } from "../../constant";
import { meta_constant } from "../../config/meta.config";

const Tips = () => {
  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta_constant.profile.title}</title>
        <meta name="description" content={meta_constant.profile.description} />
        {meta_constant.profile.keywords && (
          <meta
            name="keywords"
            content={meta_constant.profile.keywords.join(",")}
          />
        )}
      </Helmet>

      <Grid container spacing={2}>
        <Grid item xs={12} md={11} lg={10} sx={{ margin: "auto" }}>
          <Typography variant="h3" sx={{ marginBottom: 2 }}>
            Legions University
          </Typography>
          <Paper
            sx={{ padding: [3, 4], backgroundColor: "#16161699" }}
            elevation={3}
          >
            {tipsConstant.content.map((content: any, index: number) => {
              let view = (
                <Typography
                  variant={content.type || "body1"}
                  sx={{ fontWeight: content.type !== "body1" ? "bold" : "500" }}
                  dangerouslySetInnerHTML={{ __html: content.text }}
                ></Typography>
              );
              if (content.type === "divider") {
                view = <Divider sx={{ marginBottom: 2, marginTop: 2 }} />;
              } else if (content.type === "space") {
                view = <br />;
              } else if (content.type === "table") {
                view = (
                  <Box dangerouslySetInnerHTML={{ __html: content.text }}></Box>
                );
              } else if (content.type === "youtu") {
                view = (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <Grid spacing={2} container>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={10}>
                        <Box
                          sx={{
                            width: "100%",
                            paddingTop: "56.25%",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              bottom: 0,
                              left: 0,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <ReactPlayer
                              url={content.link}
                              width="100%"
                              height="100%"
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={1}></Grid>
                    </Grid>
                  </Box>
                );
              }
              return <Box key={"INDEX_CONTENT_POLICY_" + index}>{view}</Box>;
            })}
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <Grid spacing={2} container>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Box
                    sx={{
                      width: "100%",
                      paddingTop: "56.25%",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ReactPlayer
                        url="https://youtu.be/Ujn7WhSymXE"
                        width="100%"
                        height="100%"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={1}></Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Tips;
