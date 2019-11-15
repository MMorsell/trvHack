import React from "react";
import Map from "./Map";
import AboutPage from "./AboutPage";
import Header from "./common/Header";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

function App() {
  return (
    <div className="container-fluid">
      <BrowserRouter>
      {/* <Header /> */}
      <Switch>
        <Route path="/" exact component={Map} />
        <Route path="/about" component={AboutPage} />
        <Route component={NotFoundPage} />
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;