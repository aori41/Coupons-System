import { Route } from "wouter";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Panel } from "./pages/Panel";
import { Reports } from "./pages/Reports";

function App() {

  return <>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/panel" component={Panel} />
    <Route path="/reports" component={Reports} />
  </>
}

export default App
