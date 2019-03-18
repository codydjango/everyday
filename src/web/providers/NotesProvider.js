import React from 'react'
import produce from 'immer'
import { NotesContext } from '~/context'
import store from '~/services/store'
import search from '~/services/search'
import uniqueId from '~/utilities/uniqueId'
import timestamp from '~/utilities/timestamp'

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
        this.archiveNote = this.archiveNote.bind(this)
        this.closeNote = this.closeNote.bind(this)
        this.deleteNote = this.deleteNote.bind(this)
        this.loadNote = this.loadNote.bind(this)
        this.updateNote = this.updateNote.bind(this)
        this.saveNote = this.saveNote.bind(this)

        this.syncToServer = this.syncToServer.bind(this)
    }

    componentDidMount() {
        store.register('notes', this)
    }

    componentWillUnmount() {
        store.register('notes', this, true)
    }

    syncToServer() {
        setTimeout(() => { store.save() }, 100)
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

    closeNote() {
        this.setState(produce(draft => {
            draft.notes.map(note => {
                note.active = (note.id === 0)
                return note
            })
        }), this.syncToServer)
    }

    archiveNote(name) {
        this.setState(produce(draft => {
            const note = draft.notes[0]

            note.name = name
            note.id = uniqueId()
            note.timestamp = timestamp()
            note.active = false

            search.add(note)

            draft.notes.unshift({
                id: 0,
                name: '',
                markup: '',
                text: '',
                active: true
            })
        }), this.syncToServer)
    }

    deleteNote() {
        this.setState(produce(draft => {
            const index = activeIndex(draft.notes)
            const note = draft.notes.splice(index, 1)

            search.remove(note)

            draft.notes.map(note => {
                note.active = (note.id === 0)
                return note
            })
        }), this.syncToServer)
    }

    loadNote(id) {
        this.setState(produce(draft => {
            draft.notes.map(note => {
                note.active = (note.id === id)
                return note
            })
        }), this.syncToServer)
    }

    updateNote(name) {
        this.setState(produce(draft => {
            const index = activeIndex(draft.notes)
            const note = draft.notes[index]
            const doc = new DOMParser().parseFromString(note.markup, 'text/html')
            const text = doc.body.textContent || ''

            note.name = name
            note.timestamp = timestamp()
            note.text = text
            search.update(note)
        }), this.syncToServer)
    }

    saveNote(markup) {
        this.setState(produce(draft => {
            const index = activeIndex(draft.notes)
            const note = draft.notes[index]
            const doc = new DOMParser().parseFromString(markup, 'text/html')
            const text = doc.body.textContent || ''

            note.markup = markup
            note.timestamp = timestamp()
            note.text = text
            search.update(note)
        }), this.syncToServer)
    }

    render() {
        return (
            <NotesContext.Provider
                value={{
                    ...this.state,
                    updateNotes: this.updateNotes,
                    archiveNote: this.archiveNote,
                    deleteNote: this.deleteNote,
                    closeNote: this.closeNote,
                    loadNote: this.loadNote,
                    saveNote: this.saveNote,
                    updateNote: this.updateNote
                }}>
            { this.props.children }
            </NotesContext.Provider>
        )
    }
}

