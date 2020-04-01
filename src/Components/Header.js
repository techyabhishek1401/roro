import React from 'react';
import { NavLink } from 'react-router-dom'

export default function Header(props) {
    return (
        <div className="header card px-3 py-2 mb-5 flex-row">
            {props.items.map((item, index) => {
                if (index === 0)
                    return <NavLink to={`/`} className="mr-3" key={index}>{item} /</NavLink>
                return <span key={index}>{item}</span>
            })}
        </div>
    )
}
