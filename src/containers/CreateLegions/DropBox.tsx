import React, { CSSProperties, FC } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Grid, Box, Typography } from "@mui/material";
import { DragItemBox } from "../../constant/createlegions/createlegions";
import { DropCard } from "../../component/Cards/DropCard";

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
  moveToLeft: (index: number, w5b: boolean) => void;
}

export const DropBox: FC<DropBoxProps> = function DropBox({
  showAnim,
  baseUrl,
  items,
  moveToLeft,
}) {
  return (
    <>
      <Droppable droppableId="right">
        {(
          providedDroppable2: DroppableProvided,
          snapshotDroppable2: DroppableStateSnapshot
        ) => (
          <Grid
            container
            spacing={2}
            // sx={{ p: 4, height: "100%" }}
            sx={{
              p: 4,
              height: "100%",
              background: `${
                snapshotDroppable2.isDraggingOver ? "#051206" : "transparent"
              }`,
            }}
            ref={providedDroppable2.innerRef}
            {...providedDroppable2.droppableProps}
          >
            {items.map((element, index) => (
              <Draggable key={index} draggableId={element.id} index={index}>
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
                    <DropCard
                      toLeft={moveToLeft}
                      w5b={element.w5b}
                      baseIndex={index}
                      image={
                        showAnim === "0"
                          ? baseUrl + element["jpg"]
                          : baseUrl + element["gif"]
                      }
                      type={element["type"]}
                      capacity={element["capacity"]}
                      key={index}
                    />
                  </Grid>
                )}
              </Draggable>
            ))}
            {providedDroppable2.placeholder}
          </Grid>
        )}
      </Droppable>
      <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
        {true ? "Release to drop" : "Drag a box here"}
      </Typography>
    </>
  );
};
