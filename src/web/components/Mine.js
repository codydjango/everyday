import React from 'react'
import TaskList from '~/components/TaskList'
import Link from '~/components/Link'

export default props => (
    <div className="mine">
        <h2>mine</h2>
        <TaskList { ...props } />
        <Link text="reset" action={ props.handleClearDone } />
    </div>)
