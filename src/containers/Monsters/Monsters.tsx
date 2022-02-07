import React, { useEffect, useState } from 'react'
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Typography } from '@mui/material'
import FilterCards from '../../component/UI/FilterCards/FilterCards'
import MonsterCard from '../../component/Cards/MonsterCard'
import Helmet from 'react-helmet';
import { meta_constant, createlegions } from '../../config/meta.config';
import { useWeb3React } from '@web3-react/core';
import { useBeast, useLegion, useWarrior, useWeb3 } from '../../hooks/useContract';
// import { getBeastBalance, getLegionDetails, getLegionTokenIds, getWarriorBalance } from '../../hooks/contractFunction';

const Monsters = () => {
    // const { account } = useWeb3React()
    // const web3 = useWeb3()
    // const legionContract = useLegion()
    // const beastContract = useBeast()
    // const warriorContract = useWarrior()

    // const [loading, setLoading] = useState(true)
    // const [curComboLegionValue, setCurComboLegionValue] = useState('0')
    // const [legions, setLegions] = useState(Array)
    // const [legionIDs, setLegionIDs] = useState(Array)
    // const [beasts, setBeasts] = useState(Array)
    // const [warriors, setWarriors] = useState(Array)
    // const [mintedWarriorCnt, setMintedWarriorCnt] = useState(0)
    // const [curLegion, setCurLegion] = useState<any | null>()

    // useEffect(() => {
    //     if (account) {
    //         initialize()
    //     }
    // }, [])

    // const handleCurLegionValue = (e: SelectChangeEvent) => {
    //     const selectedIndex = parseInt(e.target.value)
    //     setCurComboLegionValue(e.target.value as string)
    //     setCurLegion((legions as any)[selectedIndex])
    // }

    // const initialize = async () => {
    //     setLoading(true)
    //     const legionIDS = await getLegionTokenIds(web3, legionContract, account)
    //     let amount = 0;
    //     let legionTmp;
    //     let tempLegions = []
    //     let warriorCnt = 0
    //     for (let i = 0; i < legionIDS.length; i++) {
    //         if (legionIDS[i] != 1) {
    //             legionTmp = await getLegionDetails(web3, legionContract, legionIDS[i])
    //             tempLegions.push({ ...legionTmp, id: legionIDS[i] })
    //             warriorCnt += legionTmp.warriorIDs.length
    //         }
    //     }

    //     setBeasts(await getBeastBalance(web3, beastContract, account))
    //     setWarriors(await getWarriorBalance(web3, warriorContract, account))
    //     setLegionIDs(legionIDS)
    //     setLegions(tempLegions)
    //     setMintedWarriorCnt(warriorCnt)
    //     setCurLegion(tempLegions[0])
    //     setLoading(false)
    // }
    // console.log(loading, curLegion)
    return (
        <Box>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta_constant.monster.title}</title>
                <meta name="description" content={meta_constant.monster.description} />
                {meta_constant.monster.keywords && <meta name="keywords" content={meta_constant.monster.keywords.join(',')} />}
            </Helmet>
            {/* {
                loading === false &&
                <>
                    <Grid container spacing={2} sx={{ justifyContent: 'space-evenly', my: 2 }}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Legions</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={curComboLegionValue}
                                    label="Current Legion"
                                    onChange={handleCurLegionValue}
                                >
                                    {
                                        legions.map((value: any, index) => (
                                            <MenuItem value={index} key={index}>Legion #{value.id} {value.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5'>{(curLegion as any).ap} AP</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5'>{(curLegion as any).beastIDs.length}/{createlegions.main.maxAvailableDragCount}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5'>{(curLegion as any).warriorIDs.length}/{warriors.length + mintedWarriorCnt}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5'>{(curLegion as any).supplies} dS</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={3}><MonsterCard></MonsterCard></Grid>
                        <Grid item xs={3}><MonsterCard></MonsterCard></Grid>
                        <Grid item xs={3}><MonsterCard></MonsterCard></Grid>
                        <Grid item xs={3}><MonsterCard></MonsterCard></Grid>
                    </Grid>
                </>
            } */}
        </Box>
    )
}

export default Monsters
