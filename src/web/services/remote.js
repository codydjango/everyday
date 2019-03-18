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
        await comms.post(`/account/${ account }/data/`, data)
        return true
    }

    async load(account) {
        const response = await comms.get(`/account/${ account }/data/`)

        if (response.status === 404) {
            const err = new Error()
            err.response = response
            throw err
        }

        return response.data
    }

    async clear(account) {
        console.error('not implemented')
    }
}

export default new Remote()
