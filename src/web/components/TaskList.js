import React from 'react'
import Task from '~/components/Task'
import getKey from '~/utilities/getKey'

export default props => (
    <ul className="list taskList">
        { props.list.map(item => (
            <li key={ getKey(item) }>
                <Task action={ props.action } item={ item } />
            </li>)
        ) }
    </ul>)
