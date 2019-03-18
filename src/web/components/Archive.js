import React from 'react'
import styled from 'styled-components'
import FormLine from '~/components/FormLine'
import Button from '~/components/Button'
import Field from '~/components/Field'
import search from '~/services/search'
import debounce from '~/utilities/debounce'


window.search = search


const StyledDiv = styled.div`
    max-height: 300px;
    position: relative;
    display: block;
`

const StyledList = styled.ul`
    padding: 0px;
    list-style-position: inside;
    margin: 0 0 4px 0;
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
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    font-style: normal;

    .title {
        font-style: normal;
    }

    .preview {
        font-style: italic;
        flex: 1;
    }

    .timestamp {
        font-style: normal;
    }

    &.active {
        .title {
            font-weight: 700;
        }
    }
`

const StyledSearchContainer = styled.div`
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    font-style: normal;
    margin-bottom: 6px;

    input {
        flex: 1
    }

    .button {
        margin: 0 0 0 4px;
    }
`

class Search extends React.Component {
    constructor(props) {
        super(props)

        this.ref = React.createRef()

        this.state = { search: false }

        this.doSearch = debounce(this.doSearch.bind(this), 100)
        this.onChange = this.onChange.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.clearSearch = this.clearSearch.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
    }

    onKeyPress(e) {
        if (e.key === 'Enter') this.doSearch()
    }

    onChange() {
        if (this.ref.current.value) {
            this.doSearch(this.ref.current.value)
        } else {
            this.setState(state => {
                state.search = false
                return state
            })
        }
    }

    onBlur() {}

    doSearch(value) {
        const ids = search.for(value).map(r => r.id)

        this.sorted = this.props.notes
            .filter(note => ids.indexOf(note.id) !== -1)
            .sort(note => ids.indexOf(note.id))

        this.setState(state => {
            state.search = true
            return state
        })
    }

    clearSearch() {
        this.ref.current.value = ''
        this.setState(state => {
            state.search = false
            return state
        })
    }

    render() {
        let notes
        if (this.state.search) {
            notes = this.sorted
        } else {
            notes = this.props.notes
        }

        const renderListItem = ({ id, name, markup, active, timestamp, text }, index) => {
            return (<StyledListItem
                key={ `key_${ id }` }>
                <ArchiveLink
                    id={ id }
                    index={ index }
                    timestamp={ timestamp }
                    active={ active || false }
                    onClick={ this.props.onLoad }
                    name={ name }
                    markup={ markup }
                    text={ text } />
            </StyledListItem>)
        }

        return (<div>
            <StyledSearchContainer>
                <Field
                    name="filterInput"
                    ref={ this.ref }
                    onChange={ this.onChange }
                    onKeyPress={ this.onKeyPress }
                    placeholder="search" />
                <Button action={ this.clearSearch } text="clear filter" />
            </StyledSearchContainer>

            { ((notes.length > 0) && (<StyledList children={ notes.map(renderListItem) } />)) }
        </div>)
    }
}

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

        throw new Error('no current')
    }

    render() {
        const notes = this.props.notes
        const visibleNotes = notes.filter(n => n.name)
        const isUpdate = (!!this.active.name)

        return (<StyledDiv>
            { (isUpdate)
            ? (<FormLine
                    onSubmit={ name => {
                        this.props.onUpdate(name)
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

            <Search
                notes={ visibleNotes }
                onLoad={ this.props.onLoad } />
        </StyledDiv>)
    }
}

class ArchiveLink extends React.Component {
    generatePreview(text) {
        text = text || ''
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
                <span className="preview">{ this.generatePreview(this.props.text) }</span>
                <span className="timestamp">{ this.props.timestamp }</span>
            </StyledLink>
        )
    }
}

export default Archive
