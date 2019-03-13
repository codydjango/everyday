import React, { useState, useEffect } from 'react'
import TaskList from '~/components/TaskList'
import Link from '~/components/Link'
import FormLine from '~/components/FormLine'
import uniqueId from '~/utilities/uniqueId'

class Mine extends React.Component {
    constructor(props) {
        super(props)

        this.state = { list: props.list, edit: false, dragged: null, help: false }
        this.onUpdate = this.onUpdate.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.startEdit = this.startEdit.bind(this)
        this.stopEdit = this.stopEdit.bind(this)
        this.createNewTask = this.createNewTask.bind(this)
        this.toggleHelp = this.toggleHelp.bind(this)
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
            state.help = false
            return state
        }

        return null
    }

    createNewTask(task) {
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
            state.help = false
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

    toggleEdit(e) {
        if (this.state.edit) {
            this.stopEdit()
        } else {
            this.startEdit()
        }
    }

    toggleHelp() {
        this.setState(state => {
            if (state.help == false && state.edit == true) state.edit = false
            state.help = !state.help
            return state
        })
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
            <FormLine
                onSubmit={ value => this.createNewTask(value) }
                validators={ [value => {
                    const validLength = (value && value.length > 3)
                    if (!validLength) throw FormLine.validationError('needs more characters')
                    return value
                }] }
                inputPlaceholder="task"
                submitText="add" />
            <footer>
                <div>
                    <Link text={ (this.state.edit) ? 'done edit' : 'edit' }
                        onClick={ e => {
                            e.preventDefault()
                            this.toggleEdit()
                        } } />
                    <Link text={ (this.state.help) ? 'done help' : 'help' }
                        onClick={ e => {
                            e.preventDefault()
                            this.toggleHelp()
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
