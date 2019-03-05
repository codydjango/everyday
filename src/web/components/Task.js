import React from 'react'

export default ({ handleAction, item, ...props }) => (
    <div className="task"
        role="button"
        aria-pressed={ item.active ? 'true' : 'false' }
        onClick={ (e) => { e.preventDefault(); handleAction(item.id) }}
        onKeyPress={ ({ key }) => { if (key === 'Enter') handleAction(item.id) }}
        { ...props } >
        <span className="ascii-box" style={{ marginRight: '0px' }}>
            <input  type="checkbox"
                    id={ `taskId_${ item.id }` }
                    data-id={ item.id }
                    readOnly
                    type="checkbox" checked={ item.checked }/>
            <span className="visible">
                <label
                    htmlFor={ `taskId_${ item.id }`}
                    onClick={ (e) => { e.preventDefault() } }>
                    <span className={ (item.active) ? 'taskText active' : 'taskText' } style={{ marginRight: '2px' }}>{ item.text }</span>
                    { (item.duration) ? (<sub className="duration" title="minute duration">{ item.duration }</sub>) : '' }
                    { (item.limit) ? (<sub className="limit" title="minute limit">{ item.limit }</sub>) : '' }
                    { (item.multiple) ? (<sup className="multiple">x{ item.multiple }</sup>) : '' }
                </label>
            </span>
        </span>
    </div>)
