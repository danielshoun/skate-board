import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Board from "./components/Board";
import Directory from "./components/Directory";
import NavBar from "./components/NavBar";
import NewBoard from "./components/NewBoard";
import NewReply from "./components/NewReply";
import NewThread from "./components/NewThread";
import Thread from "./components/Thread";
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
                    <Route path="/directory" exact={true}>
                        <Directory/>
                    </Route>
                    <Route path="/board/new" exact={true}>
                        <NewBoard/>
                    </Route>
                    <Route path="/board/:boardId/edit">
                        <NewBoard/>
                    </Route>
                    <Route path="/board/:boardId/new">
                        <NewThread/>
                    </Route>
                    <Route path="/board/:boardId/thread/:threadId/edit">
                        <NewThread/>
                    </Route>
                    <Route path="/board/:boardId/thread/:threadId/post/:postId/edit">
                        <NewReply/>
                    </Route>
                    <Route path="/board/:boardId/thread/:threadId/post">
                        <NewReply/>
                    </Route>
                    <Route path="/board/:boardId/thread/:threadId">
                        <Thread/>
                    </Route>
                    <Route path="/board/:boardId">
                        <Board/>
                    </Route>
                    <Route path="/" exact={true}>
                        <Redirect to="/directory"/>
                    </Route>
                </Switch>
            </div>
            <div className='about-info'>
                <div>
                    Created by Danny Shoun.
                    <a href='https://github.com/danielshoun/cast-cloud'><i className="fab fa-github about-icon"/></a>
                    <a href='https://www.linkedin.com/in/daniel-shoun/'><i className="fab fa-linkedin about-icon"/></a>
                </div>
                <div>
                </div>
                <div><a href='mailto:danielshoun@protonmail.com' className='email-link'>danielshoun@protonmail.com</a></div>
            </div>
        </BrowserRouter>
    );
}

export default App;
