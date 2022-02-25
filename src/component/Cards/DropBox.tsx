import React, { CSSProperties, FC } from "react";
import {
  Draggable,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
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
  moveToLeft: (index: number, w5b: boolean) => void;
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
    <>
      <Droppable droppableId="right">
        {(
          providedDroppable2: DroppableProvided,
          snapshotDroppable2: DroppableStateSnapshot
        ) => (
          <Box
            component="div"
            sx={{
              height: "100%",
              background: `${
                snapshotDroppable2.isDraggingOver ? "#051206" : "transparent"
              }`,
            }}
            ref={providedDroppable2.innerRef}
            {...providedDroppable2.droppableProps}
          >
            <Grid container spacing={2}>
              {items.map((element, index) => (
                <Draggable key={index} draggableId={element.id} index={index}>
                  {(
                    providedDraggable: DraggableProvided,
                    snapshotDraggable: DraggableStateSnapshot
                  ) => (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={3}
                      sx={isSmallThanSM ? { p: 1 } : { p: 4 }}
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                    >
                      <DropCard
                        id={element["id"]}
                        toLeft={moveToLeft}
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
                      />
                    </Grid>
                  )}
                </Draggable>
              ))}
              {providedDroppable2.placeholder}
            </Grid>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              {snapshotDroppable2.isDraggingOver
                ? "Release to drop"
                : "Drag a box here"}
            </Typography>
          </Box>
        )}
      </Droppable>
    </>
  );
};
