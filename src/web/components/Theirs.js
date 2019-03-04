import React from 'react'
import List from '~/components/List'
import { EARLY } from '~/settings'

export default props => (
    <div className="theirs">
        <h2>everyone else</h2>
        <List list={ props.list } />
    </div>)
