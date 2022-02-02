import React, { CSSProperties, FC, useEffect, useState } from 'react'
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
    moveToRight: (item: any) => void,
    toLeft: (index: number, w5b: boolean) => void
}

export const DropBox: FC<DropBoxProps> = function DropBox({ baseUrl, items, moveToRight, toLeft }) {
    const [{ canDropFlag, isOverFlag }, drop] = useDrop(() => ({
        accept: DragItemBox.Beasts,
        drop: (item, monitor) => {
            moveToRight(item)
            return item
        },
        collect: (monitor) => ({
            isOverFlag: monitor.isOver(),
            canDropFlag: monitor.canDrop(),
        }),
    }))
    const isActive = canDropFlag && isOverFlag
    let backgroundColor = 'transparent'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDropFlag) {
        backgroundColor = 'darkkhaki'
    }

    return (
        <Box sx={{ height: '100%', p: 4 }} ref={drop} style={{ ...style, backgroundColor }}>
            <Grid container spacing={2} sx={{ p: 4 }}>
                {items.map((element: any, index) => <DropCard toLeft={toLeft} w5b={element.w5b} baseIndex={element.id} image={baseUrl + element.item['image']} type={element.item['type']} capacity={element.item['capacity']} key={index} />)}
            </Grid>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                {isActive ? 'Release to drop' : 'Drag a box here'}
            </Typography>
        </Box>
    )
}
