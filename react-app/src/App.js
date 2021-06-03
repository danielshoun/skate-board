import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import {authenticate} from "./store/session";

function App() {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await dispatch(authenticate())
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
                    <Route path="/login" exact={true}>
                        <LoginForm/>
                    </Route>
                    <Route path="/sign-up" exact={true}>
                        <SignUpForm/>
                    </Route>
                    <ProtectedRoute path="/users" exact={true}>
                        <UsersList/>
                    </ProtectedRoute>
                    <ProtectedRoute path="/users/:userId" exact={true}>
                        <User/>
                    </ProtectedRoute>
                    <ProtectedRoute path="/" exact={true}>
                        <h1>My Home Page</h1>
                    </ProtectedRoute>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
