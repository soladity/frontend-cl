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
    toLeft: (index: number) => void
}

export const DropBox: FC<DropBoxProps> = function DropBox({ baseUrl, toLeft }) {
    const [items, setItems] = React.useState(Array);
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: DragItemBox.Beasts,
        drop: (item) => {
            let tmpItems = items;
            tmpItems.push(item);
            setItems([...tmpItems]);
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
        <Grid container spacing={2} sx={{ p: 4, height: '100%' }} ref={drop} style={{ ...style, backgroundColor }}>
            {items.map((element: any, index) => <DropCard toLeft={toLeft} baseIndex={element.id} image={baseUrl + element.item['image']} type={element.item['type']} capacity={element.item['capacity']} key={index} />)}
        </Grid>
    )
}
