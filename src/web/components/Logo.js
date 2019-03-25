import React from 'react'
import getOrdinal from '~/utilities/getOrdinal'
import styled from 'styled-components'

const StyledSmall = styled.small`
    display: block;
    white-space: nowrap;
    width: 100%;
`

const StyledH1 = styled.h1`
    display: block;
    font-style: italic;
    padding: 0;
    margin: 0 0 0 0;
    line-height: 1em;
    font-size: 32px;
    height: 32px;
    line-height: 32px;
`

export default () => {
    const today = new Date()
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const day = weekday[today.getDay()]
    const date = today.getDate()
    const ordinal = getOrdinal(day)
    const month = months[today.getMonth()]
	const year = today.getFullYear()

    return (<div className="logo">
        <StyledSmall>{ `${ day } ${ month } ${ date }${ ordinal }, ${ year }` }</StyledSmall>
        <StyledH1>everyday</StyledH1>
    </div>)
}
