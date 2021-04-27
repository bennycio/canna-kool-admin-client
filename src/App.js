import { BrowserRouter, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
