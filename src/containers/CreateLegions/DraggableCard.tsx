import React from "react";
import { Grid } from "@mui/material";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

import BeastCard from "../../component/Cards/BeastCard";

const DraggableCard: React.FC<{
  showAnimation: string | null;
  baseJpgUrl: string;
  baseGifUrl: string;
  key: number;
  draggableId: string;
  index: number;
  item: any;
}> = ({ showAnimation, baseJpgUrl, baseGifUrl, draggableId, index, item }) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(
        providedDraggable: DraggableProvided,
        snapshotDraggable: DraggableStateSnapshot
      ) => (
        <Grid
          item
          xs={3}
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          {...providedDraggable.dragHandleProps}
        >
          <BeastCard
            image={
              showAnimation === "0"
                ? baseJpgUrl + "/" + item["strength"] + ".jpg"
                : baseGifUrl + "/" + item["strength"] + ".gif"
            }
            type={item["type"]}
            capacity={item["capacity"]}
            strength={item["strength"]}
            id={item["id"]}
          />
        </Grid>
      )}
    </Draggable>
  );
};

export default DraggableCard;
