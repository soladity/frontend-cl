import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import { getBloodstoneAddress } from '../utils/addressHelpers';
import bloodstone from '../config/abis/bloodstone.json';
import getRpcUrl from '../utils/getRpcUrl';

const RPC_URL = getRpcUrl();
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 });

export const useWeb3 = () => {
    const {
        provider
    } = useWeb3React();
    return new Web3(provider || httpProvider);
}

const useContract = (abi, address) => {
    const {
        provider
    } = useWeb3React();
    const web3 = new Web3(provider || httpProvider);
    return new web3.eth.Contract(abi, address);
}

export const useBloodstone = () => {
    const abi = bloodstone.abi;
    return useContract(abi, getBloodstoneAddress());
}