import React from 'react'
import produce from 'immer'
import { StatusContext } from '~/context'
import store from '~/services/store'
const randomFromList = list => list[Math.floor(Math.random() * list.length)]

export default class StatusProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            status: "it's so nice to see you!",
            timestamp: +new Date(),
            log: '',
            card: "",
            cards: []
        }

        this.today = +new Date()

        this.randomCard = this.randomCard.bind(this)
        this.createCard = this.createCard.bind(this)
        this.updateCards = this.updateCards.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.updateActivity = this.updateActivity.bind(this)
    }

    syncToServer() {
        setTimeout(() => { store.save() }, 100)
    }

    componentDidMount() {
        store.register('status', this)
    }

    componentWillUnmount() {
        store.register('status', this, true)
    }

    updateStatus(status) {
        this.setState(produce(draft => {
            draft.status = status
        }))
    }

    createCard(str) {
        this.setState(produce(draft => {
            draft.cards.push(str)
            draft.card = str
        }), this.syncToServer)
    }

    randomCard() {
        this.setState(produce(draft => {
            let card
            if (draft.cards.length && draft.cards.length > 0) {
                card = randomFromList(draft.cards)
            } else {
                card = "You're doing just great."
            }
            draft.card = card
        }))
    }

    updateCards(data) {
        const cards = data || []
        let card
        if (cards.length && cards.length > 0) {
            card = randomFromList(cards)
        } else {
            card = "You're doing just great."
        }

        this.setState(produce(draft => {
            draft.cards = cards
            draft.card = card
        }))
    }

    updateActivity(data) {
        data = data || {
            log: '',
            timestamp: +new Date()
        }

        this.setState(produce(draft => {
            draft.log = data.log
            draft.timestamp = data.timestamp
        }))
    }

    render() {
        return (
            <StatusContext.Provider value={{
                ...this.state,
                updateStatus: this.updateStatus,
                updateCards: this.updateCards,
                randomCard: this.randomCard,
                createCard: this.createCard
            }}>
            { this.props.children }
            </StatusContext.Provider>
        )
    }
}
