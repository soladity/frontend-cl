import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Typography, Card, CardMedia } from '@mui/material'
import { MonsterCard } from '../../component/Cards/MonsterCard'
import Helmet from 'react-helmet'
import { meta_constant, createlegions, allConstants } from '../../config/meta.config'
import { useWeb3React } from '@web3-react/core'
import { useBeast, useLegion, useWarrior, useMonster, useWeb3 } from '../../hooks/useContract'
import { getBeastBalance, getLegionTokenIds, getLegionToken, getWarriorBalance, getMonsterInfo, getBaseJpgURL, getBaseGifURL, canHunt } from '../../hooks/contractFunction'
import { getTranslation } from '../../utils/translation'

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
    const [showAnimation, setShowAnimation] = useState<string | null>('0')
    const [baseJpgUrl, setBaseJpgUrl] = useState('')
    const [baseGifUrl, setBaseGifUrl] = useState('')
    const [curComboLegionValue, setCurComboLegionValue] = useState('0')
    const [legions, setLegions] = useState(Array)
    const [legionIDs, setLegionIDs] = useState(Array)
    const [beasts, setBeasts] = useState(Array)
    const [warriors, setWarriors] = useState(Array)
    const [mintedWarriorCnt, setMintedWarriorCnt] = useState(0)
    const [curLegion, setCurLegion] = useState<LegionInterface | null>()
    const [monsters, setMonsters] = useState(Array)
    const [scrollMaxHeight, setScrollMaxHeight] = useState(0)
    const scrollArea = useCallback(node => {
        if (node != null) {
            setScrollMaxHeight(node.scrollHeight)
        }
    }, [])

    useEffect(() => {
        if (account) {
            initialize()
        }
        setShowAnimation(localStorage.getItem('showAnimation') ? localStorage.getItem('showAnimation') : '0');
    }, [])

    const handleCurLegionValue = (e: SelectChangeEvent) => {
        const selectedIndex = parseInt(e.target.value)
        const curLegionTmp = (legions as any)[selectedIndex] as LegionInterface
        let indexOfCurMonster = 0
        for (let i = 0; i < allConstants.listOfMonsterAP.length; i++) {
            if (allConstants.listOfMonsterAP[i] < curLegionTmp.attackPower &&
                curLegionTmp.attackPower < allConstants.listOfMonsterAP[i + 1])
                indexOfCurMonster = i;
        }
        const scrollPosition = (scrollMaxHeight / 22 * indexOfCurMonster)
        setCurComboLegionValue(e.target.value as string)
        setCurLegion(curLegionTmp)
        window.scrollTo({ top: scrollPosition, left: 0, behavior: 'smooth' })
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
        let legionStatus = ''
        let warriorCnt = 0
        for (let i = 0; i < legionIDS.length; i++) {
            // if (legionIDS[i] != 1) {
            legionStatus = await canHunt(web3, legionContract, legionIDS[i])
            legionTmp = await getLegionToken(web3, legionContract, legionIDS[i])
            legionArrayTmp.push({ ...legionTmp, id: legionIDS[i], status: legionStatus })
            warriorCnt += legionTmp.warriors.length
            // }
        }
        await initMonster()
        setBaseJpgUrl(await getBaseJpgURL(web3, monsterContract))
        setBaseGifUrl(await getBaseGifURL(web3, monsterContract))
        setBeasts(await getBeastBalance(web3, beastContract, account))
        setWarriors(await getWarriorBalance(web3, warriorContract, account))
        setLegionIDs(legionIDS)
        setLegions(legionArrayTmp)
        setMintedWarriorCnt(warriorCnt)
        setCurLegion(legionArrayTmp[0])
        setLoading(false)
    }

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
                <Box component='div' sx={{ position: 'relative' }} ref={scrollArea}>
                    <Card sx={{ position: 'sticky', top: '100px', zIndex: 100, my: 2, py: 2 }}>
                        <Grid container spacing={2} sx={{ justifyContent: 'space-evenly' }} alignItems="center">
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
                                            legions.map((legion: any, index) => (
                                                <MenuItem
                                                    value={index}
                                                    key={index}
                                                    sx={{ background: legion.status === 1 ? 'green' : legion.status === 2 ? 'orange' : 'red' }}
                                                >
                                                    Legion #{legion.id} {legion.name}
                                                </MenuItem>
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
                    </Card>
                    <Grid container spacing={2} columns={60} justifyContent="center" alignItems="center">
                        {
                            monsters.map((monster: any | MonsterInterface, index) => (
                                <Box component='div' sx={{ width: '100%', my: 1 }} key={index}>
                                    <Grid item xs={60} sm={30} md={20} lg={15} xl={12} sx={{ maxWidth: '500px', margin: 'auto' }}>
                                        <MonsterCard
                                            image={(showAnimation === '0' ? baseJpgUrl + '/' + (index + 1) + '.jpg' : baseGifUrl + '/' + (index + 1) + '.gif')}
                                            base={monster.base}
                                            minAP={monster.ap}
                                            bouns={monster.ap < (curLegion as LegionInterface).attackPower ? '' + ((curLegion as LegionInterface).attackPower - monster.ap) / 2000 : '0'}
                                            price={monster.reward}
                                            isHuntable={monster.ap <= (curLegion as LegionInterface).attackPower}
                                        />
                                    </Grid>
                                </Box>
                            ))
                        }
                    </Grid>
                </Box>
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
