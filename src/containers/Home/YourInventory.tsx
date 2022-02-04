import * as React from 'react'
import { Grid, Card, Box, Button, Popover, Checkbox, Dialog, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useWeb3React } from '@web3-react/core';
import { getBeastBalance, getWarriorBalance, getUnclaimedUSD } from '../../hooks/contractFunction';
import { useBeast, useWarrior, useRewardPool, useWeb3 } from '../../hooks/useContract';

const YourInventory = () => {
    const [beastBalance, setBeastBalance] = React.useState(0)
    const [warriorBalance, setWarriorBalance] = React.useState(0)
    const [unclaimedBalance, setUnclaimedBalance] = React.useState(0)


    //account
    const { account } = useWeb3React()
    const web3 = useWeb3()

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
    }

    React.useEffect(() => {
        getBalance()
    }, [])

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '180px',
            height: '100%'
        }}>
            <Box sx={{ p: 4, justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', marginBottom: 3 }}>
                    YOUR INVENTORIY
                </Typography>
                <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                    BEASTS : {beastBalance}
                </Typography>
                <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                    WARRORS : {warriorBalance}
                </Typography>
                <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                    LEGIONS : 8 / 12
                </Typography>
                <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                    YOUR MAX AP : 60000
                </Typography>
                <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                    UNCLAIMED $ : {unclaimedBalance}
                </Typography>
                <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 'bold' }}>
                    TAX DAYS LEFT : 3
                </Typography>
            </Box>
        </Card>
    )
}

export default YourInventory