import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "../pages/Login";
import ListBarbecue from "../pages/ListBarbecue";
import Barbecue from "../pages/Barbecue";
import NewBarbecue from "../pages/NewBarbecue";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/churrasco/:id">
        {" "}
        <Barbecue />{" "}
      </Route>
      <Route path="/churrascos">
        {" "}
        <ListBarbecue />{" "}
      </Route>
      <Route path="/novo-churrasco">
        {" "}
        <NewBarbecue />{" "}
      </Route>
      <Route path="/">
        {" "}
        <Login />{" "}
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Router;
