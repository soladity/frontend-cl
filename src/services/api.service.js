import axios from 'axios';
import { apiConfig } from '../config/api.config';

const API_URL = apiConfig.server + '/';

class ApiService {
    getWarriors(account, status) {
        return axios.get(API_URL + 'mint/getWarriors?account=' + account + '&status=' + status);
    }
    updateWarrior(account) {
        return axios.post(API_URL + 'mint/updateWarrior', { account });
    }
    getBeasts(account, status) {
        return axios.get(API_URL + 'mint/getBeasts?account=' + account + '&status=' + status);
    }
    updateBeast(account) {
        return axios.post(API_URL + 'mint/updateBeast', { account });
    }
    sendWarriorMarket(id, price) {
        return axios.post(API_URL + 'mint/sendWarriorMarket', { id, price });
    }
    executeWarrior(id) {
        return axios.post(API_URL + 'mint/executeWarrior', { id });
    }
    sendBeastMarket(id, price) {
        return axios.post(API_URL + 'mint/sendBeastMarket', { id, price });
    }
    executeBeast(id) {
        return axios.post(API_URL + 'mint/executeBeast', { id });
    }
    createLegion(warriors, beasts) {
        return axios.post(API_URL + 'mint/createLegion', { warriors, beasts });
    }
    updateWarriorPrice(id, price) {
        return axios.post(API_URL + 'mint/updateWarriorPrice', { id, price });
    }
    cancelWarrior(id) {
        return axios.post(API_URL + 'mint/cancelWarrior', { id });
    }
    buyWarrior(id, account) {
        return axios.post(API_URL + 'mint/buyWarrior', { id, account });
    }
    updateBeastPrice(id, price) {
        return axios.post(API_URL + 'mint/updateBeastPrice', { id, price });
    }
    cancelBeast(id) {
        return axios.post(API_URL + 'mint/cancelBeast', { id });
    }
    buyBeast(id, account) {
        return axios.post(API_URL + 'mint/buyBeast', { id, account });
    }
}

export default new ApiService();