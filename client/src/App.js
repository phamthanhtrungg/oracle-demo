import { NotificationContainer } from "react-notifications";
import { Link, Route, Switch } from "react-router-dom";
import Privilege from "./components/privilege";
import Role from "./components/role/role";

function App() {
  return (
    <>
      <header>
        <h1 className="text-4xl text-center">Welcome to my App</h1>
        <div className="mt-4 flex justify-center">
          <Link
            to="/privileges"
            className="text-blue-500 hover:underline text-xl mx-2"
          >
            Privilege
          </Link>
          <Link
            to="/roles"
            className="text-blue-500 hover:underline text-xl mx-2"
          >
            Roles
          </Link>{" "}
        </div>
      </header>
      <Switch>
        <Route path="/privileges" exact>
          <Privilege />
        </Route>
        <Route path="/roles" exact>
          <Role />
        </Route>
      </Switch>
      <NotificationContainer />
    </>
  );
}

export default App;
