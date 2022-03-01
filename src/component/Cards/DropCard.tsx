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
  isMobile?: boolean;
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
  isMobile,
}) {
  const [loaded, setLoaded] = React.useState(false);

  const handleImageLoaded = () => {
    setLoaded(true);
  };
  return (
    <Card
      sx={{ position: "relative", width: "100%", fontSize: isMobile ? 10 : 14 }}
    >
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              position: "absolute",
              top: "2%",
              justifyContent: "space-between",
              width: "96%",
              paddingLeft: "2%",
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? 8 : 10,
                fontWeight: "bold",
              }}
            >
              {type}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              alignItems: "center",
              bottom: "2%",
              width: "100%",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: isMobile ? 10 : 14,
                textShadow:
                  "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
              }}
            >
              {formatNumber(power)}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: isMobile ? 8 : 10,
              position: "absolute",
              bottom: "2%",
              left: "2%",
              color: "darkgrey",
            }}
          >
            #{id}
          </Typography>
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              position: "absolute",
              top: "2%",
              justifyContent: "space-between",
              width: "96%",
              paddingLeft: "2%",
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? 8 : 10,
                fontWeight: "bold",
              }}
            >
              {type}
            </Typography>
            <Box
              sx={{
                display: "flex",
                fontWeight: "bold",
              }}
            >
              <img
                src="/assets/images/sword.png"
                style={{
                  height: `${isMobile ? "8px" : "10px"}`,
                  marginRight: "1%",
                  alignSelf: "center",
                }}
                alt="Sword"
              />
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? 10 : 14,
                  textShadow:
                    "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                }}
              >
                {capacity}
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: isMobile ? 8 : 10,
              position: "absolute",
              bottom: "2%",
              left: "2%",
              color: "darkgrey",
            }}
          >
            #{id}
          </Typography>
        </>
      )}
    </Card>
  );
};
