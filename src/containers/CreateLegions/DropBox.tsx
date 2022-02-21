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
  baseBeastJpgUrl: string;
  baseWarriorJpgUrl: string;
  baseBeastGifUrl: string;
  baseWarriorGifUrl: string;
  items: Array<any>;
  moveToLeft: (index: number, w5b: boolean) => void;
}

export const DropBox: FC<DropBoxProps> = function DropBox({
  showAnim,
  baseBeastJpgUrl,
  baseWarriorJpgUrl,
  baseBeastGifUrl,
  baseWarriorGifUrl,
  items,
  moveToLeft,
}) {
  // const [{ canDropFlag, isOverFlag }, drop] = useDrop(() => ({
  //   accept: DragItemBox.Beasts,
  //   drop: (item, monitor) => {
  //     moveToRight(item);
  //     return item;
  //   },
  //   collect: (monitor) => ({
  //     isOverFlag: monitor.isOver(),
  //     canDropFlag: monitor.canDrop(),
  //   }),
  // }));
  // const isActive = canDropFlag && isOverFlag;
  // let backgroundColor = "transparent";
  // if (isActive) {
  //   backgroundColor = "darkgreen";
  // } else if (canDropFlag) {
  //   backgroundColor = "darkkhaki";
  // }

  return (
    <Box sx={{ p: 4 }}>
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
                    xs={3}
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
                          ? element.w5b
                            ? baseWarriorJpgUrl +
                              "/" +
                              element["strength"] +
                              ".jpg"
                            : baseBeastJpgUrl +
                              "/" +
                              element["strength"] +
                              ".jpg"
                          : element.w5b
                          ? baseWarriorGifUrl +
                            "/" +
                            element["strength"] +
                            ".gif"
                          : baseBeastGifUrl + "/" + element["strength"] + ".gif"
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
    </Box>
  );
};
