import React, { useState, useEffect } from 'react'
import TaskList from '~/components/TaskList'
import Link from '~/components/Link'
import CreateTask from '~/components/CreateTask'
import uniqueId from '~/utilities/uniqueId'

class Mine extends React.Component {
    constructor(props) {
        super(props)

        this.state = { list: props.list, edit: false, dragged: null, help: false }
        this.onUpdate = this.onUpdate.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.startEdit = this.startEdit.bind(this)
        this.stopEdit = this.stopEdit.bind(this)
        this.createNew = this.createNew.bind(this)
        this.pressHelp = this.pressHelp.bind(this)
        this.depressHelp = this.depressHelp.bind(this)
        this.leaveHelp = this.leaveHelp.bind(this)
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
        let list = this.state.list.slice(0)

        list.push({
            text: task,
            checked: false,
            id: uniqueId()
        })

        this.updateList(list)
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

    pressHelp() {
        this.setState({ help: true })
    }

    depressHelp() {
        this.setState({ help: false})
    }

    leaveHelp() {
        if (this.state.help) {
            this.setState({ help: false})
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

        const getHelpInstruction = () => {
            return (<ul className="instruction">
                <li><small>green subscript indicates <strong>minimum time</strong> for task</small></li>
                <li><small>purple subscript indicates <strong>maximum time</strong> for task</small></li>
                <li><small>red superscript indicates multiple of task</small></li>
                <li><small>click "order" to order your list</small></li>
                <li><small>click "add" to add a new item to your list</small></li>
                <li><small>click "reset" to reset your list</small></li>
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
                    <Link text={ (this.state.edit) ? 'done' : 'edit' }
                        onClick={ (e) => {
                            e.preventDefault()
                            this.toggleEdit()
                        } } />
                    <Link text={ (this.state.help) ? 'ahh!' : 'help' }
                        onMouseLeave={ e => {
                            e.preventDefault()
                            this.leaveHelp()
                        } }
                        onMouseUp={ e => {
                            e.preventDefault()
                            this.depressHelp()
                        } }
                        onMouseDown={ e => {
                            e.preventDefault()
                            this.pressHelp()
                        } }
                        onClick={ e => {
                            e.preventDefault()
                        } } />
                    <Link text="reset"
                        onClick={ e => {
                            e.preventDefault()
                            this.handleClearDone()
                        } } />
                </div>
                { (this.state.edit) ? getEditInstruction() : '' }
                { (this.state.help) ? getHelpInstruction() : '' }
            </footer>
        </div>)
    }
}

export default Mine
