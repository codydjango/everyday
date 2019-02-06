import React from 'react'
import Checkbox from './Checkbox'

class MyList extends React.Component {
    render() {
        const listItems = this.props.list.map(item => <li key={item.id}><Checkbox item={item} /></li>)

        return (
            <ul>{ listItems }</ul>
        )
    }
}

export default MyList
