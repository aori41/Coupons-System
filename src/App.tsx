import { useContext } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { Route, Switch } from "wouter";
import { NotFound } from "./pages/NotFound";
import { menuItems } from "./routes";
import { NavBar } from "./components/Navbar";
import Context from "./context/Context";

function App() {
  const { theme, logged } = useContext(Context);

  return <>
    <NextUIProvider className={`${theme} text-foreground bg-background h-full w-full`}>
      <header>
        <NavBar />
      </header>
      <main>
        <Switch>
          {menuItems.map((item, index) => (
            <Route key={index} path={item.link} component={item.loginNeeded && !logged ? NotFound : item.component} />
          ))}
          <Route path="*" component={NotFound} />
        </Switch>
      </main>
    </NextUIProvider>
  </>
}

export default App;
