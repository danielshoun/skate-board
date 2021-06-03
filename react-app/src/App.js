import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NavBar from "./components/NavBar";
import {authenticate} from "./store/session";

function App() {
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await dispatch(authenticate());
            setLoaded(true);
        })();
    }, [dispatch]);

    if (!loaded) {
        return null;
    }

    return (
        <BrowserRouter>
            <NavBar/>
            <div className="content-wrapper">
                <Switch>
                    <Route path="/" exact={true}>
                        <h1>My Home Page</h1>
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
