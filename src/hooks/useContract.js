import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'

import { getBloodstoneAddress, getBeastAddress, getWarriorAddress, getLegionAddress, getRewardPoolAddress } from '../utils/addressHelpers'
import bloodstone from '../config/abis/bloodstone.json'
import beast from '../config/abis/beast.json'
import warrior from '../config/abis/warrior.json'
import legion from '../config/abis/legion.json'
import rewardpool from '../config/abis/rewardpool.json'
import getRpcUrl from '../utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })

export const useWeb3 = () => {
    const {
        library
    } = useWeb3React()
    return new Web3(library.currentProvider || httpProvider)
}

const useContract = (abi, address) => {
    const {
        library
    } = useWeb3React()
    const web3 = new Web3(library.currentProvider || httpProvider)
    return new web3.eth.Contract(abi, address)
}

export const useBloodstone = () => {
    const abi = bloodstone.abi
    return useContract(abi, getBloodstoneAddress())
}

export const useBeast = () => {
    const abi = beast.abi
    return useContract(abi, getBeastAddress())
}

export const useWarrior = _ => {
    const abi = warrior.abi
    return useContract(abi, getWarriorAddress())
}

export const useLegion = _ => {
    const abi = legion.abi
    return useContract(abi, getLegionAddress())
}

export const useRewardPool = _ => {
    const abi = rewardpool.abi
    return useContract(abi, getRewardPoolAddress())
}