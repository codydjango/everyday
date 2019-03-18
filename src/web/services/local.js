class Local {
    constructor() {
        this.store = window.localStorage
        this.load = this.load.bind(this)
        this.save = this.save.bind(this)
    }

    get name() {
        return 'local storage'
    }

    async save(account, data) {
        this.store.setItem(account, JSON.stringify(data))
    }

    async load(account) {
        const data = JSON.parse(this.store.getItem(account))
        if (data === null || Object.entries(data).length === 0) {
            const err = new Error('nothing to be found in localstorage')
            err.response = {}
            err.response.status = 404
            throw err
        }
        return data
    }

    async clear(account) {
        this.store.removeItem(account)
    }
}

export default new Local()
