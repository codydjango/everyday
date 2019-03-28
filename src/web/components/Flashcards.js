import React from 'react'

import styled from 'styled-components'
import FormLine from '~/components/FormLine'


import { StatusContext, NotesContext, AuthContext } from '~/context'
import { withContext } from '~/hoc'


const cards = [
    'Tell me about a time when you made a decision for the customer',
    'What does ownership mean to you? Do you have an example where you were faced with ownership?',
    'When do you create? When do you reduce? Invent and simplify',
    'Are right, a lot',
    'Learn and be curious',
    'Hire and develop the best',
    'Insist on the highest standards',
    'Think big',
    'Bias for action',
    'Frugality',
    'Earn trust',
    'Dive deep',
    'Have backbone, disagree and commit',
    'Deliver results',
]


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

class Flashcards extends React.Component {
    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    constructor(props) {
        super(props)

        this.state = {
            hasError: false
        }

        this.inputRef = React.createRef()
        this.onInput = this.onInput.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    async handleSave() {
        if (!this.state.dirty) return
        this.setState({ dirty: false })
    }

    renderError() {
        return (<div className="notes">
            <h1>Something is wrong</h1>
        </div>)
    }

    render() {
        if (this.state.hasError) return this.renderError()

        const randomFromList = list => list[Math.floor(Math.random() * list.length)]
        const getCard = () => randomFromList(cards)

        return (
        <StyledDiv>
            <div className="flex">
                <span className="flexLeft"><h4 children={ `flashcards` } /></span>
            </div>

            <Card children={ getCard() } />
            <Button text="more" action={ getCard() } />
        </StyledDiv>)
    }
}

export default withContext(Flashcards, [StatusContext])
