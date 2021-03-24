import React from 'react'
import { Container } from '@material-ui/core'
import Footer from '../Footer'
import Header from '../Header'
import './style.sass'

export default function Layout(props) {
	const { children } = props

	return (
		<div>
			<Header />
			
			<Container maxWidth="lg">
				{children}
			</Container>

			<Footer />
		</div>
	)
}