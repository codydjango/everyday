import axios from 'axios'
import { ENDPOINT } from '~/settings'

class Remote {
    constructor(account) {
        this.url = ENDPOINT
        this.account = account
        this.load = this.load.bind(this)
        this.save = this.save.bind(this)
    }

    get name() {
        return 'session storage'
    }

    async save(account, data) {
        const response = await axios.post(`${ this.url }/account/${ account }/data/`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return true
    }

    async load(account) {
        const response = await axios.get(`${ this.url }/account/${ account }/data/`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        return response.data
    }

    async clear(account) {
        console.error('not implemented')
    }
}

export default new Remote()
