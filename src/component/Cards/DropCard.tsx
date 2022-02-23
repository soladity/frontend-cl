import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
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
import { formatNumber } from "../../utils/common";

interface DropCardProps {
  image: string;
  id: number;
  type: string;
  strength?: string;
  capacity: string;
  power?: string;
  baseIndex: number;
  w5b: boolean;
  toLeft: (index: number, w5b: boolean) => void;
}

export const DropCard: React.FC<DropCardProps> = function DropCard({
  image,
  id,
  type,
  strength,
  capacity,
  power,
  baseIndex,
  w5b,
  toLeft,
}) {
  const [loaded, setLoaded] = React.useState(false);

  const handleImageLoaded = () => {
    setLoaded(true);
  };
  return (
    <Card sx={{ position: "relative" }}>
      {loaded === false && (
        <React.Fragment>
          <Skeleton variant="rectangular" width="100%" height="200px" />
          <Skeleton />
          <Skeleton width="60%" />
        </React.Fragment>
      )}
      {w5b ? (
        <>
          <CardMedia
            component="img"
            image={image}
            alt="Warrior Image"
            loading="lazy"
            onLoad={handleImageLoaded}
          />
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: "15px",
              left: "20px",
              fontWeight: "bold",
            }}
          >
            {type}
          </Typography>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              top: "15px",
              right: "20px",
              fontWeight: "bold",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {formatNumber(power)}
            </Typography>
          </Box>
          <Typography
            variant="subtitle2"
            sx={{
              position: "absolute",
              bottom: "15px",
              left: "20px",
              color: "darkgrey",
            }}
          >
            #{id}
          </Typography>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "15px",
              right: "20px",
              cursor: "pointer",
            }}
          >
            <Button color="error" onClick={() => toLeft(baseIndex, w5b)}>
              X
            </Button>
          </Box>
        </>
      ) : (
        <>
          <CardMedia
            component="img"
            image={image}
            alt="Beast Image"
            loading="lazy"
            onLoad={handleImageLoaded}
          />
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: "15px",
              left: "20px",
              fontWeight: "bold",
            }}
          >
            {type}
          </Typography>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              top: "15px",
              right: "20px",
              fontWeight: "bold",
            }}
          >
            <img
              src="/assets/images/sword.png"
              style={{ height: "25px", marginRight: "10px" }}
              alt="Sword"
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {capacity}
            </Typography>
          </Box>
          <Typography
            variant="subtitle2"
            sx={{
              position: "absolute",
              bottom: "15px",
              left: "20px",
              color: "darkgrey",
            }}
          >
            #{id}
          </Typography>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              bottom: "15px",
              right: "20px",
              cursor: "pointer",
            }}
          >
            <Button color="error" onClick={() => toLeft(baseIndex, w5b)}>
              X
            </Button>
          </Box>
        </>
      )}
    </Card>
  );
};
