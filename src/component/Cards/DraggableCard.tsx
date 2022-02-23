import React from "react";
import { Grid } from "@mui/material";
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
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(
        providedDraggable: DraggableProvided,
        snapshotDraggable: DraggableStateSnapshot
      ) => (
        <Grid
          item
          sm={12}
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
              handleExecute={Function}
            />
          )}
        </Grid>
      )}
    </Draggable>
  );
};

export default DraggableCard;
