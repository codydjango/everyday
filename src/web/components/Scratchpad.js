import React from 'react'

import styled from 'styled-components'
import sanitize from '~/utilities/sanitize'
import Archive from '~/components/Archive'

import { StatusContext, NotesContext, AuthContext } from '~/context'
import { withContext } from '~/hoc'

const StyledDiv = styled.div`
    position: relative;
    height: auto;
    margin-bottom: 14px;

    h4 {
        font-style: italic;
        text-transform: lowercase;
    }
`

const StyledInput = styled.div`
    -webkit-touch-callout: text;
    -webkit-user-select: text;
     -khtml-user-select: text;
       -moz-user-select: text;
        -ms-user-select: text;
            user-select: text;

    background-color: ${ props => props.theme.secondary };
    border: 1px solid ${ props => props.theme.border };
    padding: 4px;
    width: 100%;
    box-sizing: border-box;
    min-width: 100%;
    min-height: 200px;
    height: 400px;
    max-height: 400px;
    margin: 2px 0 8px 0;
    overflow: scroll;

    ${ props => (props.theme.transition) ? `transition : border ${ props.theme.transition };` : '' }

    &:focus {
        outline: none;
        border: 1px solid ${ props => props.theme.borderActive };
    }

    &.error {
        outline: none;
        border: 1px solid ${ props => props.theme.borderError };
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

    createMarkup() {
        const { markup } = Scratchpad.active(this.notes)
        return { __html: markup }
    }

    get notes() {
        return this.props.notes
    }

    async handleSave() {
        if (!this.state.dirty) return

        this.props.saveNote(sanitize(this.inputRef.current.innerHTML))
        this.setState({ dirty: false })
    }

    handleArchiveUpdate(name) {
        this.props.updateNote(name)
        this.inputRef.current.focus()
        this.props.updateStatus(`updated`)
    }

    handleArchiveDelete() {
        if (window.confirm("Of course you are absolutely sure about this, correct?")) {
            this.props.deleteNote()
        }

        this.inputRef.current.focus()
        this.props.updateStatus(`deleted`)
    }

    handleArchiveSave(name) {
        this.props.archiveNote(name)
        this.inputRef.current.focus()
        this.props.updateStatus(`saved as '${ name }'`)
    }

    handleArchiveClose() {
        this.props.closeNote()
        this.inputRef.current.focus()
    }

    handleArchiveLoad(id) {
        this.props.loadNote(id)
        this.props.updateStatus(`loaded`)
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
                <span className="flexLeft"><h4 children="scratchpad" /></span>
                <span><small children={ (this.state.dirty) ? 'unsaved' : 'saved' } /></span>
            </div>

            <StyledInput
                className={ `field ${ (this.state.error) ? 'error' : '' }` }
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
