import React from 'react'
import Task from '~/components/Task'
import getKey from '~/utilities/getKey'

export default props => (
    <ul className="list taskList">
        { props.list.map(item => (
            <li key={ getKey(item) }>
                <Task handleAction={ props.handleAction } item={ item } />
            </li>)
        ) }
    </ul>)
