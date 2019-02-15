import React from 'react'
import Checkbox from './Checkbox'

export default props => (
    <ul className="taskList">
        { props.list.map(item => (
            <li key={`li-${ item.id }`}>
                <Checkbox action={ props.action } item={ item } />
            </li>)
        ) }
    </ul>)
