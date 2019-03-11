import React, { useState } from 'react'
import Button from '~/components/Button'

export default props => {
    const [task, setTask] = useState(0)
    const [error, setError] = useState(false)
    const [input, setInput] = useState(false)

    const handleClick = () => {
        if (task && task.length > 3 ) {
            setTask('')
            input.value = ''
            props.createNew(task)
        } else {
            setError(true)
            input.focus()
            setTimeout(() => {
                setError(false)
            }, 3000)
        }

    }

    const handleChange = (e) => {
        setTask(e.target.value)
        setError(false)
    }

    return (
    <div className="formLine">
        <div className={ `field ${ (error) ? "error" : "" }` }>
            <label htmlFor="taskName">task</label>
            <input
                type="text"
                id="takeName"
                placeholder="task"
                ref={(input) => { setInput(input) }}
                onKeyPress={ ({ key }) => { if (key === 'Enter') handleClick() }}
                onChange={ handleChange } />
        </div>

        <Button
            className="button"
            text="add"
            action={ handleClick }/>

    </div>)
}
