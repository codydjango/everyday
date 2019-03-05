import React, { useState } from 'react'
import Button from '~/components/Button'
import getKey from '~/utilities/getKey'

export default props => {
    const [task, setTask] = useState(0);

    const handleClick = (e) => {
        e.preventDefault()
        props.createNew(task)
    }

    const handleChange = (e) => {
        setTask(e.target.value)
    }

    return (
    <div className="createTask">

        <Button
            className="submitTask"
            text="add"
            action={ handleClick }/>

        <div className="field">
            <label htmlFor="taskName">task</label>
            <input type="text" id="takeName" placeholder="task" onChange={ handleChange } />
        </div>
    </div>)
}
