import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.jpg';

export default function Header(props) {
    return (
        <div className="header container-fluid card  mb-5 flex-row">
            <img src={logo} alt="logo" height="40" className="mr-3" />
            {props.items.map((item, index) => {
                if (index === 0)
                    return <NavLink to={`/`} style={{ cursor: "pointer" }} className="mr-3" key={index}><span className="header-item">Vector Agency &nbsp;  /</span></NavLink>
                return <span key={index} className="header-item">{item}</span>
            })}
        </div>
    )
}
