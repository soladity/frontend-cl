import React from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

import BeastCard from "./BeastCard";
import WarriorCard from "./WarriorCard";

const DraggableCard: React.FC<{
  w5b: boolean;
  image: string;
  key: number;
  draggableId: string;
  index: number;
  item: any;
}> = ({ w5b, image, draggableId, index, item }) => {
  const theme = useTheme();
  const isSmallThanSM = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(
        providedDraggable: DraggableProvided,
        snapshotDraggable: DraggableStateSnapshot
      ) => (
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          {...providedDraggable.dragHandleProps}
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
            />
          )}
        </Grid>
      )}
    </Draggable>
  );
};

export default DraggableCard;
