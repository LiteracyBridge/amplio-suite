import axios from 'axios'

const httpClient = axios.create({
    // baseURL: process.env.API_BASE_URL,
    // baseURL: 'http://localhost:9000/api',
    baseURL: 'https://s4ypo6iwud.execute-api.us-west-2.amazonaws.com/staging/',
    timeout: 10000
})

export default httpClient
