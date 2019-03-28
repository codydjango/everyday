import React from 'react'
import produce from 'immer'
import styled from 'styled-components'
import Button from '~/components/Button'
// import FormLine from '~/components/FormLine'

import { StatusContext } from '~/context'
import { withContext } from '~/hoc'

const randomFromList = list => list[Math.floor(Math.random() * list.length)]

const cards = [
    'Tell me about a time when you made a decision for the customer',
    'What does ownership mean to you? Do you have an example where you were faced with ownership?',
    'Invent and simplify',
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

const Card = styled.div`
    position: relative;
    height: auto;
    margin-bottom: 8px;
    font-size: 18px;
    text-align: center;
    background-color: ${ props => props.theme.primary };
    color: ${ props => props.theme.text };
    padding: 24px;
    border: 1px solid ${ props => props.theme.border };
`

const StyledDiv = styled.div`
    position: relative;
    height: auto;
    margin-bottom: 14px;

    h4 {
        font-style: italic;
        text-transform: lowercase;
    }

    .more {
        margin-right: 0px;
        margin-left: auto;
        display: block;
    }
`

class Flashcards extends React.Component {
    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    constructor(props) {
        super(props)

        this.state = {
            hasError: false,
            card: randomFromList(cards)
        }

        this.freshCard = this.freshCard.bind(this)
    }

    freshCard() {
        this.setState(produce(draft => {
            draft.card = randomFromList(cards)
        }))
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
                <span className="flexLeft"><h4 children={ `flashcards` } /></span>
            </div>
            <Card children={ this.state.card } />
            <Button className="more" text="more" action={ this.freshCard } />
        </StyledDiv>)
    }
}

export default withContext(Flashcards, [StatusContext])
