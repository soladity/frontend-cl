import React, { useEffect, useState } from 'react'
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Typography, Card, CardMedia } from '@mui/material'
import { MonsterCard } from '../../component/Cards/MonsterCard'
import Helmet from 'react-helmet';
import { meta_constant, createlegions } from '../../config/meta.config';
import { useWeb3React } from '@web3-react/core';
import { useBeast, useLegion, useWarrior, useMonster, useWeb3 } from '../../hooks/useContract';
import { getBeastBalance, getLegionTokenIds, getLegionToken, getWarriorBalance, getMonsterInfo, getBaseUrl } from '../../hooks/contractFunction';
import { getTranslation } from '../../utils/translation';

interface MonsterInterface {
    base: string
    ap: number
    reward: string
    image: string
    imageAlt: string
}

interface LegionInterface {
    name: string
    beasts: string
    warriors: string
    supplies: string
    attackPower: number
}

const Monsters = () => {
    const { account } = useWeb3React()
    const web3 = useWeb3()
    const legionContract = useLegion()
    const beastContract = useBeast()
    const warriorContract = useWarrior()
    const monsterContract = useMonster()

    const [loading, setLoading] = useState(true)
    const [showAnimation, setShowAnimation] = React.useState<string | null>('0');
    const [baseUrl, setBaseUrl] = useState('')
    const [curComboLegionValue, setCurComboLegionValue] = useState('0')
    const [legions, setLegions] = useState(Array)
    const [legionIDs, setLegionIDs] = useState(Array)
    const [beasts, setBeasts] = useState(Array)
    const [warriors, setWarriors] = useState(Array)
    const [mintedWarriorCnt, setMintedWarriorCnt] = useState(0)
    const [curLegion, setCurLegion] = useState<LegionInterface | null>()
    const [monsters, setMonsters] = useState(Array)

    useEffect(() => {
        if (account) {
            initialize()
        }
        setShowAnimation(localStorage.getItem('showAnimation') ? localStorage.getItem('showAnimation') : '0');
    }, [])

    const handleCurLegionValue = (e: SelectChangeEvent) => {
        const selectedIndex = parseInt(e.target.value)
        setCurComboLegionValue(e.target.value as string)
        setCurLegion((legions as any)[selectedIndex])
    }

    const initMonster = async () => {
        let monsterTmp
        let monsterArraryTmp = []
        for (let i = 1; i < 23; i++) {
            monsterTmp = await getMonsterInfo(web3, monsterContract, i)
            monsterArraryTmp.push({ ...monsterTmp, id: i })
        }
        setMonsters(monsterArraryTmp)
    }

    const initialize = async () => {
        setLoading(true)
        const legionIDS = await getLegionTokenIds(web3, legionContract, account)
        let legionTmp
        let legionArrayTmp = []
        let warriorCnt = 0
        for (let i = 0; i < legionIDS.length; i++) {
            // if (legionIDS[i] != 1) {
            legionTmp = await getLegionToken(web3, legionContract, legionIDS[i])
            legionArrayTmp.push({ ...legionTmp, id: legionIDS[i] })
            warriorCnt += legionTmp.warriors.length
            // }
        }
        await initMonster()
        setBaseUrl(await getBaseUrl())
        setBeasts(await getBeastBalance(web3, beastContract, account))
        setWarriors(await getWarriorBalance(web3, warriorContract, account))
        setLegionIDs(legionIDS)
        setLegions(legionArrayTmp)
        setMintedWarriorCnt(warriorCnt)
        setCurLegion(legionArrayTmp[0])
        setLoading(false)
    }
    console.log(monsters)

    console.log(legions, curLegion)
    return (
        <Box>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{meta_constant.monster.title}</title>
                <meta name="description" content={meta_constant.monster.description} />
                {meta_constant.monster.keywords && <meta name="keywords" content={meta_constant.monster.keywords.join(',')} />}
            </Helmet>
            {
                loading === false && legions.length > 0 &&
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
                            <Typography variant='h5'>{(curLegion as LegionInterface).attackPower} AP</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5'>{(curLegion as LegionInterface).beasts.length}/{createlegions.main.maxAvailableDragCount}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5'>{(curLegion as LegionInterface).warriors.length}/{warriors.length + mintedWarriorCnt}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5'>{(curLegion as LegionInterface).supplies} dS</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                        {
                            monsters.map((monster: any | MonsterInterface, index) => (
                                <Grid item sx={{ width: '50%' }} key={index}>
                                    <MonsterCard
                                        image={baseUrl + (showAnimation === '0' ? monster.imageAlt : monster.image)}
                                        base={monster.base}
                                        minAP={monster.ap}
                                        bouns={monster.ap < (curLegion as LegionInterface).attackPower ? '' + ((curLegion as LegionInterface).attackPower - monster.ap) / 2000 : '0'}
                                        price={monster.reward}
                                        isHuntable={monster.ap <= (curLegion as LegionInterface).attackPower}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                </>
            }
            {
                loading === false && legions.length === 0 &&
                <Grid container justifyContent='center'>
                    <Grid item><Typography variant='h4'>No minted Legion yet</Typography></Grid>
                </Grid>
            }
            {
                loading === true &&
                <>
                    <Grid item xs={12} sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant='h4' >{getTranslation('loadingMonsters')}</Typography>
                    </Grid>
                    <Grid container sx={{ justifyContent: 'center' }}>
                        <Grid item xs={1}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    image="/assets/images/loading.gif"
                                    alt="Loading"
                                    loading="lazy"
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </>
            }
        </Box>
    )
}

export default Monsters
