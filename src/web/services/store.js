import React from 'react'
import remote from '~/services/remote'
import { messages, randomFromList } from '~/services/messages'

class Store {
    register(name, context, deregister = false) {
        if (deregister) {
            delete this[name]
        } else {
            this[name] = context
        }
    }

    async load() {
        try {
            store.status.updateStatus('Loading from session...')
            return await remote.load(this.auth.state.account)
        } catch (err) {
            console.log('err loading', err)
            store.status.updateStatus(`Error retrieving from session storage.`)
            return { notes: [], list: []}
        } finally {
            setTimeout(() => {
                store.status.updateStatus(randomFromList(messages.working))
            }, 1000 * 5)
        }
    }

    allData() {
        return {
            list: this.list.state.list,
            notes: this.notes.state.notes
        }
    }

    hasData() {
        try {
            this.allData()
            return true
        } catch(err) {
            console.log('error loading data', err)
            return false
        }
    }

    async save() {
        try {
            store.status.updateStatus('Saving...')
            await remote.save(this.auth.state.account, this.allData())
            store.status.updateStatus(`Saved to session storage.`)
        } catch (err) {
            console.log('err saving', err)
            store.status.updateStatus(`Error retrieving from session storage.`)
        } finally {
            setTimeout(()=> {
                store.status.updateStatus(randomFromList(messages.working))
            }, 1000 * 5)
        }
    }
}

const store = window.store = new Store()

export default store
