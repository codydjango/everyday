import comms from '~/services/comms'

class Remote {
    constructor(account) {
        this.account = account
        this.load = this.load.bind(this)
        this.save = this.save.bind(this)
    }

    get name() {
        return 'session storage'
    }

    async save(account, data) {
        const response = await comms.post(`/account/${ account }/data/`, data)
        return true
    }

    async load(account) {
        const response = await comms.get(`/account/${ account }/data/`)
        return response.data
    }

    async clear(account) {
        console.error('not implemented')
    }
}

export default new Remote()
