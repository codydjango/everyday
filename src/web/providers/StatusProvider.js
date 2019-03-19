import React from 'react'
import produce from 'immer'
import { StatusContext } from '~/context'
import store from '~/services/store'

export default class StatusProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            status: "it's so nice to see you!",
            timestamp: +new Date(),
            log: ''
        }

        this.today = +new Date()

        this.updateStatus = this.updateStatus.bind(this)
        this.updateActivity = this.updateActivity.bind(this)
    }

    componentDidMount() {
        store.register('status', this)
    }

    componentWillUnmount() {
        store.register('status', this, true)
    }

    updateStatus(status) {
        this.setState({ status })
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
                updateStatus: this.updateStatus
            }}>
            { this.props.children }
            </StatusContext.Provider>
        )
    }
}
