import axios from 'axios'
import { ENDPOINT } from '~/settings'

class Remote {
    constructor(account) {
        this.url = ENDPOINT
        this.account = account
        this.load = this.load.bind(this)
        this.save = this.save.bind(this)
    }

    async save(account, data) {
        const response = await axios.post(`${ this.url }/account/${ account }/data/`)
        return response.data.status
    }

    async load(account) {
        const response = await axios.get(`${ this.url }/account/${ account }/data/`)
        return JSON.parse(response.data.state)
    }
}

export default new Remote()
