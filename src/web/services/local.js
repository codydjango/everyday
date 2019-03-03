import { NAMESPACE } from '~/settings'

class Storage {
    constructor() {
        this.store = window.localStorage
        this.load = this.load.bind(this)
        this.save = this.save.bind(this)
    }

    async save(data) {
        this.store.setItem(NAMESPACE, JSON.stringify(data))
    }

    async load() {
        const saved = JSON.parse(this.store.getItem(NAMESPACE))
        if (saved === null || Object.entries(saved).length === 0) throw new Error('nothing saved')
        return saved
    }

    clear() {
        this.store.removeItem(NAMESPACE)
    }
}

export default new Storage()
