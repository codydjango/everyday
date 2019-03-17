import React from 'react'
import styled from 'styled-components'

export default styled.footer`
    display: flex;
    position: relative;
    align-items: center;
    flex-flow: row nowrap;
    margin-bottom: 4px;

    .messageLeft {
        flex: 1;
        display: block;
        text-align: left;
        font-weight: 700;
    }

    .messageRight {
        display: block;
        text-align: right;
    }
`
