import { CSSProperties, FC } from "react";
import { useDrag } from "react-dnd";
import { Grid } from "@mui/material";
import { DragItemBox } from "../../constant/createlegions/createlegions";
import BeastCard from "../../component/Cards/BeastCard";

const style: CSSProperties = {
  cursor: "move",
};

export interface DragBoxProps {
  item: any;
  baseJpgUrl: string;
  baseGifUrl: string;
  baseIndex: number;
  curIndex: number;
  showAnimation: string | null;
  dropped: (index: number) => void;
}

interface DropResult {
  done: boolean;
}

export const BeastsDragBox: FC<DragBoxProps> = function DragBox({
  item,
  baseJpgUrl,
  baseGifUrl,
  baseIndex,
  showAnimation,
  dropped,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragItemBox.Beasts,
    item: { item, id: baseIndex, w5b: false },

    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (!dropResult) {
        return;
      }
      if (dropResult && item.id === (dropResult as any).id) {
        dropped(item.id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  const opacity = isDragging ? 0.4 : 1;
  return (
    <Grid item xs={3} ref={drag} style={{ ...style, opacity }}>
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
        handleOpenSupply={Function}
      />
    </Grid>
  );
};
