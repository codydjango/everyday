import React from 'react'
import styled from 'styled-components'

import { withContext } from '~/hoc'
import { StatusContext } from '~/context'

const StyledDiv = styled.div`
    position: relative;
    height: auto;
    margin-bottom: 14px;

    h4 {
        font-style: italic;
        text-transform: lowercase;
    }
`

const StyledList = styled.ul`
    position: relative;
    padding: 0px;
    margin: 0px;
    list-style: none;
`

const StyledListItem = styled.li`
    padding: 0px;
    margin: 0px;
    display: inline-block;

    &:before {
        content: "☐";
    }

    &.started {
        &:before {
            content: "☑";
        }
    }

    &.done {
        &:before {
            content: "☒";
        }
    }
`

function calculateStreak(log) {
    return log.reduce((acc, current) => {
        if (current === '1') {
            acc.streak += 1
        } else {
            acc.streak = 0
        }

        if (acc.streak > acc.max) {
            acc.max = acc.streak
        }

        return acc
    }, { max: 0, streak: 0})
}


class Activity extends React.Component {
    render() {
        const log = (this.props.log && this.props.log.split) ? this.props.log.split('') : []
        const streak = calculateStreak(log)

        const getClass = v => {
            if (v === '1') {
                return 'done'
            } else if (v === 's') {
                return 'started'
            } else {
                return ''
            }
        }

        if (log.length === 0) return (null)

        return (<StyledDiv>
            <h4 children="activity" title={ `Longest streak: ${ streak.max }` } />
            <StyledList>
                { log.map((v, i) => <StyledListItem key={ i } className={ getClass(v) } />) }
            </StyledList>
        </StyledDiv>)
    }
}

export default withContext(Activity, [StatusContext])
