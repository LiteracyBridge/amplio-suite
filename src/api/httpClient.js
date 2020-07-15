import axios from 'axios'

const httpClient = axios.create({
    baseURL: process.env.VUE_APP_BACK_BASE_URL,
    timeout: 10000
})

export default httpClient
