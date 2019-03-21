import React from 'react'
import styled from 'styled-components'
import Button from '~/components/Button'
import Field from '~/components/Field'
import uniqueId from '~/utilities/uniqueId'

import { StatusContext } from '~/context'

let validationErr = new Error()

const StyledDiv = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    margin-bottom: 6px;

    .button {
        margin: 0 0 0 4px;
    }
`

class FormLine extends React.Component {
    static validationError(message) {
        validationErr.message = message
        return validationErr
    }

    constructor(props) {
        super(props)
        this.id = uniqueId()

        this.inputName = `_${ this.id }`
        this.inputRef = React.createRef()

        this.state = {}
        this.state.error = false

        this.onClick = this.onClick.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
    }

    get className() {
        return `formLine ${ this.props.className }`
    }

    setError(error) {
        this.context.updateStatus(error)

        const resetError = () => {
            this.setState(state => {
                delete state.error
                return state
            }, () => {
                this.inputRef.current.focus()
            })
        }

        this.setState(state => {
            setTimeout(resetError, 3000)
            state.error = error
            return state
        })
    }

    onClick(e) {
        const validators = this.props.validators || []
        const value = this.inputRef.current.value || this.inputRef.current.placeholder

        try {
            this.props.onSubmit(validators.reduce((acc, fn) => fn(acc), value))
            this.inputRef.current.value = ''
        } catch (err) {
            console.log('err', err)
            if (err === validationErr) {
                this.setError(err.message)
            } else {
                throw err
            }
        }
    }

    onKeyPress(e) {
        if (e.key === 'Enter') this.onClick(e)
    }

    render() {
        return (
            <StyledDiv>
                <Field
                    error={ this.state.error }
                    name={ this.inputName }
                    label={ this.inputName }
                    ref={ this.inputRef }
                    onKeyPress={ this.onKeyPress }
                    placeholder={ this.props.inputPlaceholder || '' } />
                <Button
                    text={ this.props.submitText || 'submit' }
                    action={ this.onClick } />
                { this.props.children }
            </StyledDiv>
        )
    }
}

FormLine.contextType = StatusContext

export default FormLine
