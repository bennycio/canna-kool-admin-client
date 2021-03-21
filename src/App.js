import ReactAdmin from "./components/ReactAdmin";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact to="/" component={ReactAdmin} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
