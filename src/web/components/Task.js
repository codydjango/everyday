import React from 'react'

export default props => {
    return (
    <div className="task">
        <span className="ascii-box" style={{marginRight: '0px'}}>
            <input  type="checkbox"
                    id={ `taskId_${ props.item.id }` }
                    data-id={ props.item.id }
                    readOnly
                    type="checkbox" checked={ props.item.checked }/>
            <div className="visible">
                <label data-id={ props.item.id } htmlFor={ `taskId_${ props.item.id }`} onClick={ props.handleAction }>
                    <span className={ (props.item.active) ? 'taskText active' : 'taskText' } style={{ marginRight: '2px' }}>{ props.item.task.text }</span>
                    { (props.item.duration) ? (<sub className="duration">{ props.item.duration }</sub>) : '' }
                    { (props.item.multiple) ? (<sup className="multiple">{ props.item.multiple }x</sup>) : '' }
                </label>
            </div>
        </span>
    </div>)
}
