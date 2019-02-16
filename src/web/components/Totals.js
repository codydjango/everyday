import React from 'react'
import Task from '~/components/Task'

const percentage = totals => (totals.done/totals.total * 100)
const isHalfway = totals => (percentage(totals) > 40)
const isAlmostDone = totals => (percentage(totals) > 80)
const randomFromList = list => list[Math.floor(Math.random() * list.length)]

const almostDone = ['Oh wow, you\'re almost done!', 'I believe in you!', 'You\'re almost there!', 'Let\'s do this.']
const halfway = ['You are so focused!', 'Have you had a break lately?', 'Can I interest you in a nice cup of water?', 'You\'re a beast!']
const beginning = ['Wow, so many tasks... You are very ambitious!', 'You look so smart today!', 'What a good day to get a thing done :D']

const memoizedGetMessageFor = totalsHaveChangedDecorator(getMessageFor)

let previousTotals = null
let previousMsg = null

// <div><span>{ `${props.totals.done}/${props.totals.total}` }</span></div>
export default props => (
    <div className="totals">
        <p><small>{ memoizedGetMessageFor(props.totals) }</small></p>
    </div>)


function getMessageFor(totals) {
    if (totals == previousTotals)
    if (isAlmostDone(totals)) return randomFromList(almostDone)
    if (isHalfway(totals)) return randomFromList(halfway)
    return randomFromList(beginning)
}

function totalsHaveChangedDecorator(fn) {
    return function(totals, ...args) {
        if (previousMsg && (previousTotals.done == totals.done)) return previousMsg
        previousTotals = totals
        previousMsg = fn(totals, ...args)
        return previousMsg
    }
}
