import React, { useState } from 'react'
import Button from '~/components/Button'
import getKey from '~/utilities/getKey'

export default props => {
    const [task, setTask] = useState(0)
    const [error, setError] = useState(false)

    const handleClick = (e) => {
        e.preventDefault()

        if (task && task.length > 3 ) {
            props.createNew(task)
        } else {
            setError(true)
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
    <div className="createTask">

        <Button
            className="submitTask"
            text="add"
            action={ handleClick }/>

        <div className={ `field ${ (error) ? "error" : "" }` }>
            <label htmlFor="taskName">task</label>
            <input type="text" id="takeName" placeholder="task" onChange={ handleChange } />
        </div>
    </div>)
}
