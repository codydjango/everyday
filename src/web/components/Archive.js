import React from 'react'
import styled from 'styled-components'
import FormLine from '~/components/FormLine'
import Button from '~/components/Button'
import ArchiveList from '~/components/ArchiveList'

const StyledDiv = styled.div`
    position: relative;
    display: block;
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

            { (visibleNotes.length > 0) && (<ArchiveList
                notes={ visibleNotes }
                onLoad={ this.props.onLoad } />) }

        </StyledDiv>)
    }
}

export default Archive
