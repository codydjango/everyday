import React from 'react'
import styled from 'styled-components'
import Button from '~/components/Button'
import FormLine from '~/components/FormLine'
import Stopwatch from '~/components/Stopwatch'
import { StatusContext } from '~/context'
import { withContext } from '~/hoc'

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
`

class Flashcards extends React.Component {
    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
        }

        this.freshCard = this.freshCard.bind(this)
        this.createCard = this.createCard.bind(this)
    }

    createCard(str) {
        this.props.createCard(str)
    }

    freshCard() {
        this.props.randomCard()
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
            <Card children={ this.props.card } />
            <FormLine
                onSubmit={ this.createCard }
                validators={ [] }
                inputPlaceholder="2 + 2 = ?"
                submitText="create">
                <Button className="random" text="random" action={ this.freshCard } />
                <Stopwatch key={ this.props.card } autostart={ false } />
            </FormLine>
        </StyledDiv>)
    }
}

export default withContext(Flashcards, [StatusContext])
