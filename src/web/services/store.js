import React from 'react'
import remote from '~/services/remote'
import { messages, randomFromList } from '~/services/messages'
import search from '~/services/search'

class Store {
    register(name, context, deregister = false) {
        if (deregister) {
            delete this[name]
        } else {
            this[name] = context
        }
    }

    seed(data) {
        if (data && data.notes) this.notes.updateNotes(data.notes, false)
        if (data && data.list) this.list.updateList(data.list, false)

        if (data && data.notes) search.addAll(data.notes)
    }

    /**
     * Throws error if attempt to load from remote with invalid token (response 400)
     */
    async load() {
        if (this.auth.state.verified) {
            this.status.updateStatus(`Loading from session account...`)
            this.seed(await remote.load(this.auth.state.account))
        } else {
            this.seed({ notes: [], list: []})
        }

        setTimeout(() => {
            this.status.updateStatus(randomFromList(messages.working))
        }, 1000 * 10)
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
            this.status.updateStatus('Saving...')
            await remote.save(this.auth.state.account, this.allData())
            this.status.updateStatus(`Saved to session storage.`)
        } catch (err) {
            console.log('error saving', err)
            this.status.updateStatus(`Error retrieving from session storage.`)
        } finally {
            setTimeout(()=> {
                this.status.updateStatus(randomFromList(messages.working))
            }, 1000 * 5)
        }
    }
}

export default window.store = new Store()
