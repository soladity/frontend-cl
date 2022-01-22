import React, { CSSProperties, FC, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles';
import { DragItemBox } from '../../constant/createlegions/createlegions'
import DropCard from '../../component/Cards/DropCard'

const useStyles = makeStyles({
    card: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '180px',
        height: '100%',
        justifyContent: 'flex-start'
    }
});

const style: CSSProperties = {
    color: 'white',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
}

interface DropBoxProps {
    baseUrl: string
}

export const DropBox: FC<DropBoxProps> = function DropBox({ baseUrl }) {
    const classes = useStyles();
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
    let backgroundColor = '#222'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    return (
        <Box className={classes.card} sx={{ p: 4, justifyContent: 'center', alignItems: 'center' }} ref={drop} style={{ ...style, backgroundColor }}>
            {items.map((element: any, index) => <DropCard image={baseUrl + element.item['image']} type={element.item['type']} capacity={element.item['capacity']} key={index} />)}
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                {isActive ? 'Release to drop' : 'Drag a box here'}
            </Typography>
        </Box>
    )
}
