import React, { useState } from 'react'
import Button from '~/components/Button'


class Archive extends React.Component {
    constructor(props) {
        super(props)
        this.nameRef = React.createRef()

        this.state = {}

        this.saveNote = this.saveNote.bind(this)
        this.loadNote = this.loadNote.bind(this)
    }

    setError(error) {
        const resetError = () => {
            this.setState(state => {
                delete state.error
                return state
            })
        }

        this.setState(state => {
            setTimeout(resetError, 3000)
            state.error = error
            return state
        })
    }

    saveNote() {
        const name = this.nameRef.current.value
        const validLength = (name.length > 3)
        const availableName = (this.props.notes.archive.map(v => v[0]).indexOf(name) == -1)

        if (!validLength) return this.setError('needs more characters')
        if (!availableName) return this.setError('name already exists')

        this.props.onSave(name)
        this.nameRef.current.value = ''
    }

    loadNote(e) {
        alert('loading coming soon!')
    }

    render() {
        const archive = this.props.notes.archive

        const generatePreview = html => {
            const doc = new DOMParser().parseFromString(html, 'text/html')
            const text = doc.body.textContent || ''

            return `${ text.slice(0, 20) }...`
        }
        const listLink = v => (
            <li key={`key_${ v[0] }`}>
                <a
                    role="button"
                    href="#"
                    onClick={ e => {
                        e.preventDefault()
                        this.loadNote(v)
                    }}>
                    <span className="title">{ v[0] }</span>
                    <span className="preview">{ generatePreview(v[1]) }</span>
                </a>
            </li>)

        return (
            <div className="archive">
                <div className="formLine">
                    <div className={ `field ${ (this.state.error) ? "error" : "" }` }>
                        <label htmlFor="noteName"></label>
                        <input
                            ref={ this.nameRef }
                            type="text"
                            name="noteName"
                            onKeyPress={ ({ key }) => { if (key === 'Enter') this.saveNote() }}
                            placeholder="name" />
                    </div>
                    <Button
                            text="archive"
                            className="button"
                            action={ this.saveNote } />
                </div>

                {
                    (archive.length > 0)
                    ? (<ul>
                        { archive.map(listLink) }
                    </ul>)
                    : ''
                }

            </div>)



    }
}

export default Archive
