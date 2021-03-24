import React from 'react'
import { Link } from "react-router-dom";
import './style.sass'

export default function Header(props) {
  return (
    <header className="header">
      <h1>Agenda de Churras</h1>
      <div className="logout">
        <Link to="/">Sair ➦</Link>
      </div>
    </header>
  )
}