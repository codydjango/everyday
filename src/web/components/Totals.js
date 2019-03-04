import React from 'react'
import { messages, randomFromList } from '~/services/messages'

const percentage = totals => (totals.done/totals.total * 100)
const isHalfway = totals => (percentage(totals) > 40)
const isAlmostDone = totals => (percentage(totals) > 80)

const memoizedGetMessageFor = totalsHaveChangedDecorator(getMessageFor)

let previousTotals = null
let previousMsg = null

export default props => (
    <div className="totals">
        <p><small>{ memoizedGetMessageFor(props.totals) }</small></p>
    </div>)

function getMessageFor(totals) {
    if (isAlmostDone(totals)) return randomFromList(messages.almostDone)
    if (isHalfway(totals)) return randomFromList(messages.halfway)
    return randomFromList(messages.beginning)
}

function totalsHaveChangedDecorator(fn) {
    return function(totals, ...args) {
        if (previousMsg && (previousTotals.done == totals.done)) return previousMsg
        previousTotals = totals
        previousMsg = fn(totals, ...args)
        return previousMsg
    }
}
