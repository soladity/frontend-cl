import React from "react";
import { Grid, useTheme, useMediaQuery, Box } from "@mui/material";

import BeastCard from "./BeastCard";
import WarriorCard from "./WarriorCard";

const DraggableCard: React.FC<{
  w5b: boolean;
  image: string;
  key: number;
  index: number;
  item: any;
  handleClick: Function;
}> = ({ w5b, image, index, item, handleClick }) => {
  const theme = useTheme();
  const isSmallThanSM = useMediaQuery(theme.breakpoints.down("sm"));
  const handleBtnClick = () => {
    handleClick(index, 0, true);
  };
  return (
    <Grid item xs={12} md={6} lg={3}>
      <Box
        style={{ cursor: "pointer" }}
        onClick={() => {
          handleBtnClick();
        }}
      >
        {!w5b && (
          <BeastCard
            image={image}
            type={item["type"]}
            capacity={item["capacity"]}
            strength={item["strength"]}
            id={item["id"]}
            handleOpenSupply={Function}
            isMobile={isSmallThanSM}
            handleExecute={Function}
            needButton={false}
          />
        )}
        {w5b && (
          <WarriorCard
            image={image}
            type={item["type"]}
            power={item["power"]}
            strength={item["strength"]}
            id={item["id"]}
            handleOpenSupply={Function}
            isMobile={isSmallThanSM}
            handleExecute={Function}
            needButton={false}
          />
        )}
      </Box>
    </Grid>
  );
};

export default DraggableCard;
