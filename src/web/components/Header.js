import React from 'react'
import styled from 'styled-components'

export default styled.header`
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    padding-top: 8px;
    margin-bottom: 20px;

    .logo {
        flex: 0;
        display: block;
    }

    .auth {
        text-align: right;
        flex: 1;
    }
`
