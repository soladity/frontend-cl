export const RELOAD_CONTRACT_STATUS = 'RELOAD_CONTRACT_STATUS'

export const setReloadStatus = (payload) => {
    return {
        type: RELOAD_CONTRACT_STATUS,
        payload: payload
    }
}