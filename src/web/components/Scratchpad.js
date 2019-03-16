import React from 'react'

import styled from 'styled-components'
import uniqueId from '~/utilities/uniqueId'
import sanitize from '~/utilities/sanitize'
import Archive from '~/components/Archive'

import { StatusContext, NotesContext, AuthContext } from '~/context'
import { withContext } from '~/hoc'

const StyledDiv = styled.div`
    position: relative;
    height: auto;
    margin-bottom: 14px;
`

const StyledInput = styled.div`
    -webkit-touch-callout: text;
    -webkit-user-select: text;
     -khtml-user-select: text;
       -moz-user-select: text;
        -ms-user-select: text;
            user-select: text;
    background-color: rgb(243, 243, 0);
    border: 1px solid rgb(243, 243, 0);
    padding: 4px;
    width: 100%;
    box-sizing: border-box;
    min-width: 100%;
    min-height: 100px;
    transition : border 5500ms ease-out;
    margin: 2px 0 8px 0;
    max-height: 500px;
    overflow: scroll;
    max-height: 200px;

    &:focus {
        outline: none;
        border: 1px solid rgb(209, 209, 3);
    }
`

class Scratchpad extends React.Component {
    static activeIndex(notes) {
        for (let i = 0; i < notes.length; i += 1) {
            if (notes[i].active) {
                return i
            }
        }

        throw new Error('no active')
    }

    static active(notes) {
        for (let i = 0; i < notes.length; i += 1) {
            if (notes[i].active) {
                return notes[i]
            }
        }

        throw new Error('no active')
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    constructor(props) {
        super(props)

        this.state = {
            error: false,
            dirty: false,
            hasError: false
        }

        this.inputRef = React.createRef()

        this.createMarkup = this.createMarkup.bind(this)
        this.onInput = this.onInput.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleArchiveSave = this.handleArchiveSave.bind(this)
        this.handleArchiveLoad = this.handleArchiveLoad.bind(this)
        this.handleArchiveUpdate = this.handleArchiveUpdate.bind(this)
        this.handleArchiveClose = this.handleArchiveClose.bind(this)
        this.handleArchiveDelete = this.handleArchiveDelete.bind(this)
    }

    componentDidCatch(error, info) {
        console.log(this.constructor.name, 'error', error)
        console.log(this.constructor.name, 'info', info)
    }

    createMarkup() {
        const { markup } = Scratchpad.active(this.notes)
        return { __html: markup }
    }

    get notes() {
        return this.props.notes
    }

    notesCopy() {
        return this.notes.slice(0)
    }

    async handleSave() {
        if (!this.state.dirty) return this.notes

        const notes = this.notesCopy()
        notes[Scratchpad.activeIndex(notes)].markup = sanitize(this.inputRef.current.innerHTML)
        await this.props.updateNotes(notes)
        this.setState({ dirty: false })
    }

    async handleArchiveUpdate(id, name) {
        const notes = this.notesCopy()
        const index = notes.map(note => note.id).indexOf(id)

        notes[index].name = name
        notes[index].id = id
        notes[index].timestamp = +new Date()

        await this.props.updateNotes(notes)
        this.inputRef.current.focus()
        this.props.updateStatus(`Updated.`)
    }

    async handleArchiveDelete() {
        const notes = this.notesCopy()
        const index = Scratchpad.activeIndex(notes)
        const note = notes.splice(index, 1)

        if (window.confirm("Of course you are absolutely sure about this, correct?")) {
            await this.props.updateNotes(notes.map(note => {
                note.active = (note.id === 0)
                return note
            }))
        }

        this.inputRef.current.focus()
        this.props.updateStatus(`Deleted ${ note.name }.`)
    }

    async handleArchiveSave(name) {
        const notes = this.notesCopy()

        notes[0].name = name
        notes[0].id = uniqueId()
        notes[0].timestamp = +new Date()
        delete notes[0].active

        notes.unshift({
            id: 0,
            name: '',
            markup: '',
            active: true
        })

        await this.props.updateNotes(notes)

        this.inputRef.current.focus()
        this.props.updateStatus(`Saved new as '${ name }'.`)
    }

    async handleArchiveClose() {
        await this.props.updateNotes(this.notesCopy().map(note => {
            note.active = (note.id === 0)
            return note
        }))
        this.inputRef.current.focus()
        this.props.updateStatus(`Closed.`)
    }

    async handleArchiveLoad(id) {
        await this.props.updateNotes(this.notesCopy().map(note => {
            note.active = (note.id === id)
            return note
        }))
        this.props.updateStatus(`Loaded.`)
    }

    onInput() {
        if (!this.state.dirty) this.setState(state => {
            state.dirty = true
            return state
        })
    }

    renderError() {
        return (<div className="notes">
            <h1>Something is wrong</h1>
        </div>)
    }

    render() {
        if (this.state.hasError) return this.renderError()

        return (
        <StyledDiv>
            <div className="flex">
                <span className="flexLeft"><h4 children="Scratchpad" /></span>
                <span><small children={ (this.state.dirty) ? "Unsaved..." : "Saved." } /></span>
            </div>

            <StyledInput
                className={ `field ${ (this.state.error) ? "error" : "" }` }
                contentEditable
                data-gramm_editor="false"
                ref={ this.inputRef }
                onInput={ this.onInput }
                onBlur={ this.handleSave }
                dangerouslySetInnerHTML={ this.createMarkup() } />

            <Archive
                notes={ this.props.notes }
                onSave={ this.handleArchiveSave }
                onClose={ this.handleArchiveClose }
                onLoad={ this.handleArchiveLoad }
                onUpdate={ this.handleArchiveUpdate }
                onDelete={ this.handleArchiveDelete }/>
        </StyledDiv>)
    }
}

export default withContext(Scratchpad, [NotesContext, StatusContext])
