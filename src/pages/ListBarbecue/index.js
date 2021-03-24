import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout";
import Event from "../../components/Event";
import addEvent from "../../assets/images/event/add.png";
import "./style.sass";

const ListBarbecue = (props) => {
  const [API] = useState(process.env.REACT_APP_API_ADDRESS);
  const [barbecues, setBarbecues] = useState(null);

  const loadBarbecues = async () => {
    const response = await fetch(`${API}/barbecues`);
    const data = await response.json();

    setBarbecues(data);
  };

  useEffect(() => {
    (async () => {
      if (!barbecues) loadBarbecues();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barbecues]);

  return (
    <Layout>
      <main>
        <div className="barbecue-list">
          {barbecues &&
            barbecues.map((item, index) => <Event data={item} key={index} />)}
          <div className="event-item-add">
            <Link to="/novo-churrasco">
              <img
                src={addEvent}
                className="img-responsive center-block"
                alt="Adicionar Churras"
              ></img>
              <p>Adicionar Churras</p>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ListBarbecue;
