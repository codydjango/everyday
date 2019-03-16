import React from 'react'
import styled from 'styled-components'
import FormLine from '~/components/FormLine'
import Button from '~/components/Button'

const StyledDiv = styled.div`
    max-height: 300px;
    position: relative;
    display: block;
`

const StyledList = styled.ul`
    padding: 0px;
    list-style-position: inside;
    margin: 0;
    border: 1px dashed #e5e700;
`

const StyledListItem = styled.li`
    border-bottom: 1px dashed #e5e700;
    margin: 0px;
    padding: 0px;
    font-style: italic;
    display: block;

    &:last-child {
        border-bottom: none;
    }
`

const StyledLink = styled.a`
    text-decoration: none;
    width: 100%;
    display: block;
    font-style: normal;

    .title {
        font-style: normal;
    }

    .sep {
        font-style: normal;
        padding-right: 1px;
        padding-left: 1px;
    }

    .preview {
        font-style: italic;
    }

    &.active {
        .title {
            font-weight: 700;
        }
    }
`

class Archive extends React.Component {
    get date() {
        const now = new Date()
        const day = now.getDate().toString().slice(-2)
        const month = (now.getMonth() + 1).toString().slice(-2)

        return now.getFullYear().toString().slice(2) + '-' + month + "-" + day
    }

    get active() {
        for (let i = 0; i < this.props.notes.length; i += 1) {
            if (this.props.notes[i].active) {
                return this.props.notes[i]
            }
        }

        throw new Error('no current1')
    }

    render() {
        const notes = this.props.notes
        const visibleNotes = notes.filter(n => n.name)
        const isUpdate = (this.active.name)

        const renderListItem = ({ id, name, markup, active }, index) => {
            return (<StyledListItem
                key={ `key_${ id }` }>
                <ArchiveLink
                    id={ id }
                    index={ index }
                    active={ active || false }
                    onClick={ this.props.onLoad }
                    name={ name }
                    markup={ markup } />
            </StyledListItem>)
        }

        return (<StyledDiv>
            { (isUpdate)
            ? (<FormLine
                    onSubmit={ name => {
                        this.props.onUpdate(this.active.id, name)
                    } }
                    validators={ [value => {
                        if (!value) throw FormLine.validationError('Needs a name, please.')

                        if (value === this.active.name) return value // allow it through

                        if (value && value.length < 2) throw FormLine.validationError('Longer name, please.')
                        if (!(visibleNotes.map(note => note.name).indexOf(value) == -1))
                            throw FormLine.validationError(`File already exists with name: ${ value }`)

                        return value
                    }] }
                    inputPlaceholder={ this.active.name }
                    submitText="save">
                    <Button
                        action={ this.props.onDelete }
                        text="delete" />
                    <Button
                        action={ this.props.onClose }
                        text="close" />
                    </FormLine>)
            : (<FormLine
                onSubmit={ this.props.onSave }
                validators={ [value => {
                    if (!value) throw FormLine.validationError('needs a name')
                    if (value && value.length < 3) throw FormLine.validationError('needs more characters')
                    if (!(visibleNotes.map(note => note.name).indexOf(value) == -1))
                        throw FormLine.validationError(`file already exists with name: ${ value }`)

                    return value
                }] }
                inputPlaceholder={ this.date }
                submitText="archive" />)
            }

            { ((visibleNotes.length > 0) && (
            <StyledList children={ visibleNotes.map(renderListItem) } />
            )) }

        </StyledDiv>)
    }
}

class ArchiveLink extends React.Component {
    generatePreview(markup) {
        const doc = new DOMParser().parseFromString(markup, 'text/html')
        const text = doc.body.textContent || ''

        return `${ text.slice(0, 20) }...`
    }

    normalizeName(name) {
        return name.slice(0, 12).padEnd(16, '\u00A0')
    }

    render() {
        return (
            <StyledLink
                role="button"
                href="#"
                className={ this.props.active ? 'active' : '' }
                onClick={ e => {
                    e.preventDefault()
                    this.props.onClick(this.props.id)
                } }>
                <span className="title">{ this.normalizeName(this.props.name) }</span>
                <span className="sep"></span>
                <span className="preview">{ this.generatePreview(this.props.markup) }</span>
            </StyledLink>
        )
    }
}

export default Archive
