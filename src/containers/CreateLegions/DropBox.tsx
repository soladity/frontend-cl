import React, { CSSProperties, FC, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { Grid, Card, Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles';
import { DragItemBox } from '../../constant/createlegions/createlegions'
import { DropCard } from '../../component/Cards/DropCard'

const style: CSSProperties = {
    color: 'white',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
}

interface DropBoxProps {
    baseUrl: string,
    items: Array<any>,
    count: Number,
    itemMove: (item: any) => void,
    toLeft: (index: number, w5b: boolean) => void
}

export const DropBox: FC<DropBoxProps> = function DropBox({ baseUrl, items, count, itemMove, toLeft }) {
    // const [items, setItems] = React.useState(Array);
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: DragItemBox.Beasts,
        drop: (item) => {
            // let tmpItems = items;
            // tmpItems.push(item);
            // setItems([...tmpItems]);
            itemMove(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    const isActive = canDrop && isOver
    let backgroundColor = 'transparent'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    return (
        <Box sx={{ height: '100%' }} ref={drop} style={{ ...style, backgroundColor }}>
            <Grid container spacing={2} sx={{ p: 4 }}>
                {items.map((element: any, index) => <DropCard toLeft={toLeft} w5b={element.w5b} baseIndex={element.id} image={baseUrl + element.item['image']} type={element.item['type']} capacity={element.item['capacity']} key={index} />)}
            </Grid>
        </Box>
    )
}
