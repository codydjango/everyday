import React, { useState, useEffect } from 'react'
import TaskList from '~/components/TaskList'
import Link from '~/components/Link'

export default props => {
    const [{ list, edit }, setEditState] = useState({ list: props.list, edit: false })
    const toggleEdit = () => { ;(edit) ? endEdit() : startEdit() }
    const onUpdate = newlist => { setEditState({ list: newlist, edit }) }
    const startEdit = () => { setEditState({ list, edit: true }) }

    const endEdit = () => {
        setEditState({ list, edit: false })
        props.updateList(list)
    }

    return (<div className="mine">
        <h2>my routine</h2>
        <TaskList { ...props } editMode={ edit } onUpdate={ onUpdate } />
        <footer>
            <Link text={ (edit) ? 'done' : 'edit' } action={ toggleEdit } />
            <Link text="reset" action={ props.handleClearDone } />
        </footer>
    </div>)
}
