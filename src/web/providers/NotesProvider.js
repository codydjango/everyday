import React from 'react'
import produce from 'immer'
import { NotesContext } from '~/context'
import store from '~/services/store'

function activeIndex(list) {
    const index = list.indexOf(list.filter(i => i.active)[0])
    return (index !== -1) ? index : null
}

export default class NotesProvider extends React.Component {
    static get defaultNote () {
        return Object.assign({}, { id: 0, name: '', markup: '', active: true })
    }

    constructor(props) {
        super(props)
        this.state = { notes: [NotesProvider.defaultNote]}
        this.updateNotes = this.updateNotes.bind(this)
    }

    componentDidMount() {
        store.register('notes', this)
    }

    componentWillUnmount() {
        store.register('notes', this, true)
    }

    async updateNotes(notes, save = true) {
        return new Promise((resolve, reject) => {
            this.setState(produce(draft => {
                if (!Array.isArray(notes)) {
                    notes = []
                }

                draft.notes = notes.filter(note => {
                    return (Array.isArray(note) === false)
                })

                if (draft.notes.length === 0) draft.notes.push(NotesProvider.defaultNote)
            }), () => {
                if (save) setTimeout(()=>{ store.save() }, 100)
                resolve(true)
            })
        })
    }

    render() {
        return (
            <NotesContext.Provider
                value={{
                    ...this.state,
                    updateNotes: this.updateNotes
                }}>
            { this.props.children }
            </NotesContext.Provider>
        )
    }
}

