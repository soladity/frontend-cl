import axios from 'axios';

const instance = axios.create({
    // baseURL: '/vivekfin'
    baseURL: '/api'
});

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
instance.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
instance.defaults.headers.common['Accept'] = 'application/json';
instance.interceptors.request.use(function (config) {
    if (config.method == 'get') {
        config.data = true
    }
    config.headers['H-TOKEN'] = '111'
    return config;
}, function (error) {
    return Promise.reject(error);
})

export const http = async (...args) => {
    const [method, url, body, options] = args;

    try {
        if (method !== 'get') {
            try {
                JSON.parse(JSON.stringify(body));
            } catch (e) {
                instance.defaults.headers.common['Content-Type'] = 'multipart/form-data; charset=utf-8';
            }
            instance.defaults.headers.common[CSRF_TOKEN_NAME] = CSRF_TOKEN;
        }
        return await httpCall(method, url, body ? body : {}, options);
    } catch (err) {
        throw new Error(err);
    }
};