import React, { CSSProperties, FC } from "react";
import { Grid, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { DragItemBox } from "../../constant/createlegions/createlegions";
import { DropCard } from "./DropCard";

const style: CSSProperties = {
  color: "white",
  textAlign: "center",
  fontSize: "1rem",
  lineHeight: "normal",
};

interface DropBoxProps {
  showAnim: string | null;
  baseUrl: string;
  items: Array<any>;
  moveToLeft: Function;
}

export const DropBox: FC<DropBoxProps> = function DropBox({
  showAnim,
  baseUrl,
  items,
  moveToLeft,
}) {
  const theme = useTheme();
  const isSmallThanSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box component="div" sx={{ height: "100%", p: isSmallThanSM ? 2 : 4 }}>
      <Grid container spacing={2}>
        {items.map((element, index) => (
          <Grid item xs={12} md={6} lg={3}>
            <Box
              style={{ width: "100%", cursor: "pointer" }}
              onClick={() => moveToLeft(index, element.w5b)}
            >
              <DropCard
                id={element["id"]}
                w5b={element.w5b}
                baseIndex={index}
                image={
                  showAnim === "0"
                    ? baseUrl + element["jpg"]
                    : baseUrl + element["gif"]
                }
                type={element["type"]}
                strength={element["strength"]}
                power={element["power"]}
                capacity={element["capacity"]}
                key={index}
                isMobile={isSmallThanSM}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
