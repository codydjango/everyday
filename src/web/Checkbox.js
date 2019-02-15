import React from 'react'

export default props => (
    <div className="task">
        <span className="pretty p-fill p-has-focus" style={{marginRight: '0px'}}>
            <input  type="checkbox"
                    id={ props.item.id }
                    onChange={ props.action }
                    type="checkbox" checked={ props.item.checked }/>
            <div className="state p-success">
                <label htmlFor={ props.item.id }>
                    { props.item.task.text }
                    { (props.item.duration) ? (<strong className="duration">{ props.item.duration }h</strong>) : '' }
                    { (props.item.multiple) ? (<sup className="multiple">{ props.item.multiple }x</sup>) : '' }
                </label>
            </div>
        </span>
    </div>)
