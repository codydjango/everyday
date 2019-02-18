import React, { useState } from 'react'
import Task from '~/components/Task'
import getKey from '~/utilities/getKey'
import throttle from '~/utilities/throttle'

export default props => {
    const [state, setState] = useState({
        list: props.list,
        dragged: undefined
    })

    const editTask = item => <Task handleAction={ () => {}} item={ item } />
    const normalTask = item => <Task tabIndex="0" handleAction={ props.handleAction } item={ item } />
    const getTask = item => (props.editMode) ? editTask(item) : normalTask(item)

    const onDragStart = (e, i) => {
        let dragged = state.list[i]

        e.dataTransfer.effectAllowed = 'move'
        e.target.parentNode.classList.add('dragged')
        e.dataTransfer.setData('text/html', e.target.parentNode)
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20)

        setState({
            list: state.list,
            dragged: dragged
        })
    }

    const onDragEnd = (e) => {
        e.target.parentNode.classList.remove('dragged')

        setState({
            list: state.list,
            dragged: undefined
        })

        setTimeout(function() {
            props.onUpdate(state.list)
        }, 1)
    }

    const onDragOver = i => {
        if (state.dragged === state.list[i]) return
        let newlist = state.list.filter(i => i.id != state.dragged.id)
        newlist.splice(i, 0, state.dragged)
        setState({
            dragged: state.dragged,
            list: newlist
        })
    }

    const returnEdit = () => (
        <ul className={'list taskList edit'}>
            { state.list.map((item, i) => {
                return (<li
                    onDragOver={ () => { throttle(onDragOver, 50)(i) } }
                    key={ getKey(item) }>
                    <div className="drag"
                        draggable
                        onDragStart={ (e) => { onDragStart(e, i) }}
                        onDragEnd={ (e) => { onDragEnd(e) }}>
                        { editTask(item) }
                    </div>
                </li>)
            })}
        </ul>)

    const returnNormal = () => (
        <ul className={'list taskList'}>
            { state.list.map((item, i) => (<li
                className={ (props.editMode) ? 'drag': '' }
                key={ getKey(item) }>
                { normalTask(item) }
            </li>))}
        </ul>)

    return ((props.editMode) ? returnEdit() : returnNormal())
}
