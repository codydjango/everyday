import React from 'react'
import styled from 'styled-components'
import search from '~/services/search'
import Field from '~/components/Field'
import Button from '~/components/Button'

import debounce from '~/utilities/debounce'

const StyledList = styled.ul`
    padding: 0px;
    list-style-position: inside;
    margin: 0 0 4px 0;
    border: 1px dashed ${ props => props.theme.border };
`

const StyledListItem = styled.li`
    border-bottom: 1px dashed ${ props => props.theme.border };
    margin: 0px;
    padding: 0px;
    font-style: italic;
    display: block;

    &:last-child {
        border-bottom: none;
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
        flex: 1;
        color: ${ props => props.theme.text };
    }

    .button {
        margin: 0 0 0 4px;
    }
`

const StyledLink = styled.a`
    text-decoration: none;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    font-style: normal;
    margin: 0px;
    padding: 0px;
    position: relative;

    .title {
        display: block;
        flex: 0;
        font-style: normal;
        white-space: nowrap;
        margin: 0px;
        padding: 0px;
    }

    .preview {
        display: block;
        flex: 1;
        min-width: 0px;
        position: relative;
        margin: 0px;
        padding: 0px;

        .cell {
            position: absolute;
            top: 0;
            right: 1em;
            bottom: 0;
            left: 0;
            display: block;
        }

        .cell-overflow {
            font-style: italic;
            max-width: 100%;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .timestamp {
        flex: 0;
        display: block;
        white-space: nowrap;
        font-style: normal;
        margin: 0px;
        padding: 0px;
    }

    &.active {
        .title {
            font-weight: 700;
        }
    }
`

class ArchiveLink extends React.Component {
    generatePreview(text) {
        text = text || ''
        return `${ text.slice(0, 80) }...`
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
                <div className="title">{ this.normalizeName(this.props.name) }</div>
                <div className="preview">
                    <div className="cell">
                        <span className="cell-overflow">
                            { this.generatePreview(this.props.text) }
                        </span>
                    </div>
                </div>
                <div className="timestamp">{ this.props.timestamp }</div>
            </StyledLink>
        )
    }
}

export default class ArchiveList extends React.Component {
    constructor(props) {
        super(props)

        this.ref = React.createRef()
        this.state = { search: false }

        this.doSearch = debounce(this.doSearch.bind(this), 100)
        this.onChange = this.onChange.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.clearSearch = this.clearSearch.bind(this)
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

    onBlur() {
        if (!this.ref.current.value) {
            this.setState(state => {
                state.search = false
                return state
            })
        }
    }

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
        }, () => {
            this.ref.current.focus()
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
                    onBlur={ this.onBlur }
                    placeholder="search" />
                <Button action={ this.clearSearch } text="clear filter" />
            </StyledSearchContainer>

            { (notes.length > 0) ? <StyledList children={ notes.map(renderListItem) } /> : '' }
        </div>)
    }
}
