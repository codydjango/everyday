import React from 'react'

export default props => (
    <div className="task">
        <span className="ascii-box" style={{marginRight: '0px'}}>
            <input  type="checkbox"
                    id={ `taskId_${ props.item.id }` }
                    data-id={ props.item.id }
                    onChange={ props.action }
                    type="checkbox" checked={ props.item.checked }/>
            <div className="visible">
                <label htmlFor={ `taskId_${ props.item.id }` }>
                    <span style={{ marginRight: '2px' }}>{ props.item.task.text }</span>
                    { (props.item.duration) ? (<sub className="duration">{ props.item.duration }h</sub>) : '' }
                    { (props.item.multiple) ? (<sup className="multiple">{ props.item.multiple }x</sup>) : '' }
                </label>
            </div>
        </span>
    </div>)
