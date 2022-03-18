import axios from 'axios';
import { apiConfig } from '../config/api.config';

const API_URL = apiConfig.server + '/';

class ApiService {
    getWarriors(account) {
        return axios.get(API_URL + 'mint/getWarriors?account=' + account);
    }
    updateWarrior(account) {
        return axios.post(API_URL + 'mint/updateWarrior', { account });
    }
    getBeasts(account) {
        return axios.get(API_URL + 'mint/getBeasts?account=' + account);
    }
    updateBeast(account) {
        return axios.post(API_URL + 'mint/updateBeast', { account });
    }
}

export default new ApiService();