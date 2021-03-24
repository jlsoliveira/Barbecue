import React from 'react'
import './style.sass'
import logo from '../../assets/images/footer/logo.svg'

export default function Header(props) {
  return (
    <footer className="footer">
      <img src={logo} className="img-responsive center-block" alt="Trinca"></img>
    </footer>
  )
}