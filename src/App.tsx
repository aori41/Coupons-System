import { useContext, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { Route, Switch } from "wouter";
import { NotFound } from "./pages/NotFound";
import { routesHandler } from "./routes";
import { NavBar } from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { userController } from "./controllers/user";
import Context from "./context/Context";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { theme, logged, setLogged } = useContext(Context);

  useEffect(() => {
    const init = async () => {
      const res = await userController.status();

      setLogged(res.status);
    }

    init();
  }, []);

  return <>
    <NextUIProvider className={`${theme} text-foreground bg-background h-full w-full`}>
      <header>
        <NavBar />
      </header>
      <main>
        <Switch>
          {routesHandler.map((route, index) => (
            <Route key={index} path={route.link} component={route.loginNeeded && !logged ? NotFound : route.component} />
          ))}
          <Route path="*" component={NotFound} />
        </Switch>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={true}
          pauseOnHover={true}
          limit={3}
        />
      </main>
    </NextUIProvider>
  </>
}

export default App;
