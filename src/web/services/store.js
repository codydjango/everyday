import React from 'react'
import remote from '~/services/remote'
import local from '~/services/local'
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

    updateActivity(data, daysMissing) {
        // process last day
        if (data.list.every(a => a)) {
            data.activity.log += '1'
        } else if (data.list.reduce((a, b) => a ^ b)) {
            data.activity.log += 's'
        } else {
            data.activity.log += '0'
        }

        // subtract last days from remaining days
        daysMissing -= 1

        // backfill remaining days
        ;[...Array(daysMissing).keys()].forEach(i => {
            data.activity.log += '0'
        })

        // timestamp today
        data.activity.today = +new Date()

        // reset for today
        data.list.forEach(item => {
            item.checked = false
            item.active = false
        })

        if (data.list.length > 0) data.list[0].active = true
    }

    normalizeDay(data) {
        if (!data.activity) data.activity = {
            log: '',
            timestamp: +new Date()
        }

        const date1 = new Date()
        const date2 = new Date(data.activity.timestamp)
        const differentDay = (date1.getDay() !== date2.getDay())
        const difference = date1.getTime() - date2.getTime()
        const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)

        if (differentDay && daysDifference) this.updateActivity(data, daysDifference)
    }

    seed(data) {
        this.normalizeDay(data)

        if (data && data.notes) this.notes.updateNotes(data.notes, false)
        if (data && data.list) this.list.updateList(data.list, false)
        if (data) this.status.updateActivity(data.activity, false)
        if (data && data.notes) search.addAll(data.notes)
    }

    /**
     * Throws error if attempt to load from remote with invalid token (response 400)
     */
    async load() {
        if (this.auth.state.verified) {
            this.status.updateStatus(`loading from session storage...`)
            this.seed(await remote.load(this.auth.state.account))
        } else {
            this.status.updateStatus(`Loading from local storage...`)
            this.seed(await local.load(this.auth.state.account))
        }

        setTimeout(() => {
            this.status.updateStatus(randomFromList(messages.working))
        }, 1000 * 10)
    }

    create() {
        this.seed({ notes: [], list: [] })
        this.status.updateStatus('nice to have you with us.')
    }

    allData() {
        return {
            list: this.list.state.list,
            notes: this.notes.state.notes,
            activity: {
                timestamp: this.status.state.timestamp,
                log: this.status.state.log
            }
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
            await local.save(this.auth.state.account, this.allData())

            if (this.auth.state.verified) {
                await remote.save(this.auth.state.account, this.allData())
                this.status.updateStatus(`Saved to session storage.`)
            } else {
                this.status.updateStatus(`Saved to local storage.`)
            }
        } catch (err) {
            console.log('error saving', err)
            this.status.updateStatus(`Error saving data.`)
        } finally {
            setTimeout(()=> {
                this.status.updateStatus(randomFromList(messages.working))
            }, 1000 * 5)
        }
    }
}

export default window.store = new Store()
