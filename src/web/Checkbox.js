import React from 'react'

export default props => (
    <label htmlFor={ props.item.id }>
        <input  id={ props.item.id }
                onChange={ props.action }
                type="checkbox" checked={ props.item.checked } />
        { props.item.task.text }
        { (props.item.duration) ? (<strong className="duration">{ props.item.duration }h</strong>) : '' }
        { (props.item.multiple) ? (<sup className="multiple">{ props.item.multiple }x</sup>) : '' }
    </label>)
