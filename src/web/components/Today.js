import React from 'react'
import styled from 'styled-components'
import produce from 'immer'
import TaskList from '~/components/TaskList'
import Link from '~/components/Link'
import FormLine from '~/components/FormLine'
import uniqueId from '~/utilities/uniqueId'
import { StatusContext, ListContext } from '~/context'
import { withContext } from '~/hoc'

const StyledDiv = styled.div`
    margin-bottom: 14px;
`

export default withContext(class Today extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            edit: false,
            dragged: null,
            help: false,
            list: props.list
        }

        this.createTaskRef = React.createRef()

        this.onUpdate = this.onUpdate.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.startEdit = this.startEdit.bind(this)
        this.stopEdit = this.stopEdit.bind(this)
        this.createNewTask = this.createNewTask.bind(this)
        this.toggleHelp = this.toggleHelp.bind(this)
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

    componentDidMount() {
        setTimeout(() => {
            if (this.createTaskRef && this.createTaskRef.current) {
                this.createTaskRef.current.focus()
            }
        }, 1000)
    }

    getList() {
        // return JSON.parse(JSON.stringify(this.state.list))

        return this.state.list
    }

    createNewTask(task) {
        this.props.addToList({
            text: task,
            checked: false,
            id: uniqueId()
        })
    }

    startEdit() {
        this.setState(produce(draft => {
            draft.help = false
            draft.edit = true
            draft.dragged = null
        }))
    }

    stopEdit() {
        this.props.updateList(this.state.list)
        this.setState(produce(draft => {
            draft.edit = false
            draft.dragged = null
        }))
    }

    toggleEdit() {
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
        this.setState(produce(draft => {
            draft.list = list
            draft.dragged = dragged
        }))
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

        return (<StyledDiv className={ this.props.className }>
            <h2>routine</h2>

            <TaskList
                list={ this.getList() }
                edit={ this.state.edit }
                dragged={ this.state.dragged }
                onUpdate={ this.onUpdate }
                onClick={ this.props.setActiveListItem } />

            <FormLine
                ref={ this.createTaskRef }
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
                    <Link children={ (this.state.edit) ? 'close' : 'edit' }
                        onClick={ this.toggleEdit } />
                    <Link children={ (this.state.help) ? 'close' : 'help' }
                        onClick={ this.toggleHelp } />
                    <Link children="reset"
                        onClick={ this.props.clearList } />
                </div>
                { (this.state.edit) ? getEditInstruction() : '' }
                { (this.state.help) ? getHelpInstruction() : '' }
            </footer>
        </StyledDiv>)
    }
}, [ListContext, StatusContext])
