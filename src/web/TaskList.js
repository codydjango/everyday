import React from 'react'
import Task from './Task'

export default props => (
    <ul className="taskList">
        { props.list.map(item => (
            <li key={`li-${ item.id }`}>
                <Task action={ props.action } item={ item } />
            </li>)
        ) }
    </ul>)
