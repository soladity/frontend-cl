import * as React from 'react'
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useWeb3React } from '@web3-react/core';
import { getBeastBalance, getWarriorBalance, getUnclaimedUSD, getAvailableLegionsCount, getTaxLeftDays, getMaxAttackPower, getLegionTokenIds } from '../../hooks/contractFunction';
import { useBeast, useWarrior, useLegion, useRewardPool, useWeb3 } from '../../hooks/useContract';
import { useSelector } from 'react-redux'
import { getTranslation } from '../../utils/translation';

const YourInventory = () => {
    const { reloadContractStatus } = useSelector((state: any) => state.contractReducer)

    const [beastBalance, setBeastBalance] = React.useState(0)
    const [warriorBalance, setWarriorBalance] = React.useState(0)
    const [unclaimedBalance, setUnclaimedBalance] = React.useState(0)
    const [availableLegionCount, setAvailableLegionCount] = React.useState(0)
    const [legionTokenIds, setLegionTokenIds] = React.useState([])
    const [taxLeftDays, setTaxLeftDays] = React.useState(0)
    const [maxAttackPower, setMaxAttackPower] = React.useState(0)



    //account
    const { account } = useWeb3React()
    const web3 = useWeb3()

    //Legion Contract
    const legionContract = useLegion()

    //Beast Contract
    const beastContract = useBeast()

    //Warrior Contract
    const warriorContract = useWarrior()

    //RewardPool Contract
    const rewardPoolContract = useRewardPool()

    //get all balances of your inventory
    const getBalance = async () => {
        const beastBalance = await getBeastBalance(web3, beastContract, account)
        setBeastBalance(beastBalance)

        const warriorBalance = await getWarriorBalance(web3, warriorContract, account)
        setWarriorBalance(warriorBalance)

        const unclaimedBalance = await getUnclaimedUSD(web3, rewardPoolContract, account)
        setUnclaimedBalance(unclaimedBalance)

        const availableLegionCount = await getAvailableLegionsCount(web3, legionContract, account)
        setAvailableLegionCount(availableLegionCount)

        const legionTokenIds = await getLegionTokenIds(web3, legionContract, account)
        setLegionTokenIds(legionTokenIds)

        const taxLeftDays = await getTaxLeftDays(web3, legionContract, account)
        setTaxLeftDays(taxLeftDays)

        const maxAttackPower = await getMaxAttackPower(web3, legionContract, account)
        setMaxAttackPower(maxAttackPower)
    }

    React.useEffect(() => {
        getBalance()
    }, [reloadContractStatus])

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '180px',
            height: '100%',
            background: '#16161699'
        }}>
            <Box sx={{ p: 4, justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                    {getTranslation('yourInventory')}
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('BEASTS')} : {beastBalance}
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('WARRIORS')} : {warriorBalance}
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('LEGIONS')} : {availableLegionCount} / {legionTokenIds.length}
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('yourMaxAp')} : {maxAttackPower}
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('unClaimed')} $ : {unclaimedBalance}
                </Typography>
                <Typography className='legionFontColor' variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {getTranslation('taxDaysLeft')} : {taxLeftDays}
                </Typography>
            </Box>
        </Card>
    )
}

export default YourInventory