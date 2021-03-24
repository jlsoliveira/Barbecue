import React, { useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

import './style.sass'

export default function Event(props) {
  const [barbecue] = useState(props.data)
  const total = barbecue.participants.reduce((prev, cur) => prev + parseFloat(cur.contribution), 0)
  return (
    <React.Fragment>
      <div className="event-item">
       <Link to={`/churrasco/${barbecue.id}`}>
          <div>
            <p className="date">{moment(barbecue.date).format('DD/MM')}</p>
            <p className="title">{barbecue.title}</p>
            <p className="description">{barbecue.description}</p>
            <p className="observation">{barbecue.observation}</p>
          </div>
          <div className="event-item-flex">
            <p className="people">{barbecue.participants.length}</p>
            <p className="money">{total.toLocaleString()}</p>
          </div>
       </Link>
      </div>

    </React.Fragment>

  )
}