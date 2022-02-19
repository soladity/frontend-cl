import { CSSProperties, FC } from 'react'
import { useDrag } from 'react-dnd'
import { Grid } from '@mui/material';
import { DragItemBox } from '../../constant/createlegions/createlegions';
import BeastCard from '../../component/Cards/BeastCard';
import WarriorCard from '../../component/Cards/WarriorCard';


const style: CSSProperties = {
    cursor: 'move',
}

export interface DragBoxProps {
    item: any,
    baseJpgUrl: string,
    baseGifUrl: string,
    baseIndex: number,
    curIndex: number,
    w5b: boolean,
    showAnimation: string | null,
    dropped: (index: number) => void
}

interface DropResult {
    done: boolean
}

export const DragBox: FC<DragBoxProps> = function DragBox({ item, baseJpgUrl, baseGifUrl, baseIndex, curIndex, w5b, showAnimation, dropped }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragItemBox.Beasts,
        item: { item, id: baseIndex, w5b: w5b },

        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (!dropResult) {
                return;
            }
            if (dropResult && item.id === (dropResult as any).id) {
                dropped(curIndex);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }))
    const opacity = isDragging ? 0.4 : 1;
    const empty = () => {

    }
    return (
        <Grid item xs={3} ref={drag} style={{ ...style, opacity }}>
            {
                !w5b &&
                <BeastCard image={(showAnimation === '0' ? baseJpgUrl + '/' + item['strength'] + '.jpg' : baseGifUrl + '/' + item['strength'] + '.gif')} type={item['type']} capacity={item['capacity']} strength={item['strength']} id={item['id']} handleOpenSupply={empty} />
            }
            {
                w5b &&
                <WarriorCard image={(showAnimation === '0' ? baseJpgUrl + '/' + item['strength'] + '.jpg' : baseGifUrl + '/' + item['strength'] + '.gif')} type={item['type']} power={item['power']} strength={item['strength']} id={item['id']} handleOpenSupply={empty} />
            }
        </Grid>
    )
}
