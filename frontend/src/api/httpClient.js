import axios from 'axios'
import store from '@/store'

const httpClient = () => (
    axios.create({
        baseURL: process.env.VUE_APP_BACK_BASE_URL,
        timeout: 30000,
        headers: {
            'Authorization': store.state.account.user.token.jwtToken
        }
    })
)

export default httpClient
