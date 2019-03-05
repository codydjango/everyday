import React, { useState, useEffect } from 'react'
import TaskList from '~/components/TaskList'
import Link from '~/components/Link'
import CreateTask from '~/components/CreateTask'

class Mine extends React.Component {
    constructor(props) {
        super(props)

        this.state = { list: props.list, edit: false, dragged: null }
        this.onUpdate = this.onUpdate.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.startEdit = this.startEdit.bind(this)
        this.stopEdit = this.stopEdit.bind(this)
        this.createNew = this.createNew.bind(this)

        this.handleAction = props.handleAction
        this.handleClearDone = props.handleClearDone
        this.updateList = props.updateList
    }

    static getDerivedStateFromProps(props, state) {
        if (state.edit) return null

        if (props.list !== state.list) {
            state.list = props.list
            state.edit = false
            state.dragged = null
            return state
        }

        return null
    }

    createNew(task) {
        console.log('new', task)
        alert('create new')
    }

    startEdit() {
        this.setState(state => {
            state.edit = true
            state.dragged = null
            return state
        })
    }

    stopEdit() {
        this.updateList(this.state.list)
        this.setState(state => {
            state.edit = false
            state.dragged = null
            return state
        })
    }

    toggleEdit() {
        if (this.state.edit) {
            this.stopEdit()
        } else {
            this.startEdit()
        }
    }

    onUpdate({ list, dragged }) {
        this.setState(state => {
            state.list = list
            state.dragged = dragged
            return state
        })
    }

    render() {
        const getEditInstruction = () => {
            return (<ul className="instruction">
                <li><small>drag item to reorder</small></li>
                <li><small>click item to delete</small></li>
                <li><small>click "done" to exit editing mode</small></li>
            </ul>)
        }

        return (<div className="mine">
            <h2>routine</h2>
            <TaskList
                list={ this.state.list }
                edit={ this.state.edit }
                dragged={ this.state.dragged }
                onUpdate={ this.onUpdate }
                onClick={ this.handleAction } />
            <CreateTask createNew={ this.createNew } />
            <footer>
                <div>
                    <Link text={ (this.state.edit) ? 'done' : 'edit' } action={ this.toggleEdit } />
                    <Link text="reset" action={ this.handleClearDone } />
                </div>
                { (this.state.edit) ? getEditInstruction() : '' }
            </footer>
        </div>)
    }
}

export default Mine
