import React from 'react'
import styled from 'styled-components'
import slugify from '~/utilities/slugify'
import FormLine from '~/components/FormLine'

const StyledDiv = styled.div`
    height: 300px;
`

const StyledList = styled.ul`
    padding: 0px;
    list-style-position: inside;
    margin: 0;
    border: 1px dashed $backgroundYellowBorder;
`

const StyledListItem = styled.li`
    border-bottom: 1px dashed $backgroundYellowBorder;
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

    .title {
        font-style: italic;
        border-right: 1px dashed $backgroundYellowBorder;
    }

    .sep {
        font-style: normal;
        padding-right: 3px;
        padding-left: 3px;
    }

    .preview {
        font-style: italic;
    }
`

class Archive extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.loadNote = this.loadNote.bind(this)
    }

    get className() {
        return `archive ${ this.props.className }`
    }

    get date() {
        const now = new Date()
        const day = now.getDate().toString().slice(-2)
        const month = (now.getMonth() + 1).toString().slice(-2)

        return now.getFullYear().toString().slice(2) + '-' + month + "-" + day
    }

    loadNote(name) {
        alert('loading coming soon!')
    }

    render() {
        const archive = this.props.notes.archive

        const renderListItem = ([name, markup]) => {
            return (<StyledListItem
                key={ slugify(name) }>
                <ArchiveLink
                    onClick={ this.loadNote }
                    name={ name }
                    markup={ markup } />
            </StyledListItem>)
        }

        return (<StyledDiv>
                <FormLine
                    onSubmit={ this.props.onSave }
                    validators={ [value => {
                        if (!value) { value = this.date }
                        if (value && value.length < 3) throw FormLine.validationError('needs more characters')
                        if (!(this.props.notes.archive.map(v => v[0]).indexOf(value) == -1))
                            throw FormLine.validationError(`file already exists with name: ${ value }`)
                        return value
                    }] }
                    inputPlaceholder={ this.date }
                    submitText="archive" />

                { ((archive.length > 0) && (
                <StyledList children={ archive.map(renderListItem) } />
                )) }

            </StyledDiv>)
    }
}

class ArchiveLink extends React.Component {
    constructor(props) {
        super(props)
    }

    generatePreview(markup) {
        const doc = new DOMParser().parseFromString(markup, 'text/html')
        const text = doc.body.textContent || ''

        return `${ text.slice(0, 20) }...`
    }

    render() {
        return (
            <StyledLink
                role="button"
                href="#"
                onClick={ e => {
                    e.preventDefault()
                    this.props.onClick(this.props.id)
                } }>
                <span className="title">{ this.props.name }</span>
                <span className="sep">|</span>
                <span className="preview">{ this.generatePreview(this.props.markup) }</span>
            </StyledLink>
        )
    }
}

export default Archive
