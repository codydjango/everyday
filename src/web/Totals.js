import React from 'react'
import Task from './Task'

const percentage = totals => (totals.done/totals.total * 100)
const isHalfway = totals => (percentage(totals) > 40)
const isAlmostDone = totals => (percentage(totals) > 80)
const randomFromList = list => list[Math.floor(Math.random() * list.length)]

const almostDone = ['Oh wow, you\'re almost done!', 'I believe in you!', 'You\'re almost there!', 'Let\'s do this.']
const halfway = ['You are so focused!', 'Have you had a break lately?', 'Can I interest you in a nice cup of water?', 'You\'re a beast!']
const beginning = ['Wow, so many tasks... You are very ambitious!', 'You look so smart today!', 'What a good day to get a thing done :D']

function getMessageFor(totals) {
    if (isAlmostDone(totals)) return randomFromList(almostDone)
    if (isHalfway(totals)) return randomFromList(halfway)
    return randomFromList(beginning)
}

// <div><span>{ `${props.totals.done}/${props.totals.total}` }</span></div>
export default props => (
    <div className="totals">
        <small>{ getMessageFor(props.totals) }</small>
    </div>)
