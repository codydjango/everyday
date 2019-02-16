import React from 'react'
import TaskList from '~/components/TaskList'

export default props => (
    <div className="myTasks">
        <h2>mine</h2>
        <TaskList list={ props.list } action={ props.action } />
    </div>)
