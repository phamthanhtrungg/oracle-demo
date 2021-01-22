import { NotificationContainer } from "react-notifications";
import { Link, Route, Switch } from "react-router-dom";
import Privilege from "./components/privilege";
import Profile from "./components/profile";
import Role from "./components/role";
import User from "./components/user";

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
          </Link>
          <Link
            to="/profiles"
            className="text-blue-500 hover:underline text-xl mx-2"
          >
            Profiles
          </Link>
          <Link
            to="/users"
            className="text-blue-500 hover:underline text-xl mx-2"
          >
            Users
          </Link>
        </div>
      </header>
      <Switch>
        <Route path="/privileges" exact>
          <Privilege />
        </Route>
        <Route path="/roles" exact>
          <Role />
        </Route>
        <Route path="/profiles" exact>
          <Profile />
        </Route>
        <Route path="/users" exact>
          <User />
        </Route>
      </Switch>
      <NotificationContainer />
    </>
  );
}

export default App;
