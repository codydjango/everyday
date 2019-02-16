import React from 'react'
import getKey from '~/utilities/getKey'

export default props => (
    <ul className="list">
        { props.list.map(item => (
            <li key={ getKey(item) }>
                <div><span>{ item.text }</span></div>
            </li>)
        ) }
    </ul>)
