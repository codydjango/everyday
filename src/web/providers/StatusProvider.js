import React from 'react'
import produce from 'immer'
import { StatusContext } from '~/context'
import store from '~/services/store'

export default class StatusProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            status: 'default message'
        }

        this.updateStatus = this.updateStatus.bind(this)
    }

    componentDidMount() {
        store.register('status', this)
    }

    componentWillUnmount() {
        store.register('status', this, true)
    }

    async updateStatus(status) {
        this.setState({ status })
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
