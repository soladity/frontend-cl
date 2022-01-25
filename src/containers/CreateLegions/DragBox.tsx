import { CSSProperties, FC } from 'react'
import { useDrag } from 'react-dnd'
import { Grid } from '@mui/material';
import { DragItemBox } from '../../constant/createlegions/createlegions';
import MintCard from '../../component/Cards/MintCard';


const style: CSSProperties = {
    cursor: 'move',
}

export interface DragBoxProps {
    item: any,
    baseUrl: string,
    baseIndex: number,
    curIndex: number,
    w5b: boolean,
    dropped: (index: number) => void
}

interface DropResult {
    done: boolean
}

export const DragBox: FC<DragBoxProps> = function DragBox({ item, baseUrl, baseIndex, curIndex, w5b, dropped }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragItemBox.Beasts,
        item: { item, id: baseIndex, w5b: w5b },

        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                dropped(curIndex);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }))
    const opacity = isDragging ? 0.4 : 1
    return (
        <Grid item xs={3} ref={drag} style={{ ...style, opacity }}>
            <MintCard image={baseUrl + item['image']} type={item['type']} capacity={item['capacity']} strength={item['strength']} />
        </Grid>
    )
}
