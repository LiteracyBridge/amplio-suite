import axios from 'axios'

const httpClient = axios.create({
    // baseURL: process.env.API_BASE_URL,
    // baseURL: 'http://localhost:9000/api',
    baseURL: 'https://s4ypo6iwud.execute-api.us-west-2.amazonaws.com/staging/',
    timeout: 5000, // 5 second
})

export default httpClient