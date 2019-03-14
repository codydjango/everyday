import React from 'react'
import { withContext } from '~/hoc'
import { StatusContext } from '~/context'

class Status extends React.Component {
    render() {
        return (<small className="readout">{ this.props.status }</small>)
    }
}

export default withContext(Status, StatusContext)
