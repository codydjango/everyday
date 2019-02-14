import React from 'react'
import Checkbox from './Checkbox'

export default props => <ul className="mylist">{ props.list.map(item => <li key={item.id}><Checkbox item={item} /></li>) }</ul>
