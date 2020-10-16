import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

import './App.css';
import GetStarted from './demos/GetStarted'
import Primitives from './demos/Primitives'
import SceneGraph from './demos/SceneGraph'
import Tank from './demos/Tank'
import Material from './demos/Materials'
import Textures from './demos/textures'
import Lights from './demos/Lights'
import Camera from './demos/Camera'
import AMRAgent from './demos/AMRAgent'
import Pgm from './demos/Pgm'
import MyChart from './charts'


export default () => (
    <Router>
        <Switch>
            <Route exact path='/' component={GetStarted} />
            <Route path='/primitives' component={Primitives} />
            <Route path='/scenegraph' component={SceneGraph} />
            <Route path='/tank' component={Tank} />
            <Route path='/materials' component={Material} />
            <Route path='/textures' component={Textures} />
            <Route path='/lights' component={Lights} />
            <Route path='/camera' component={Camera} />
            <Route path='/amragent' component={AMRAgent} />
            <Route path='/pgm' component={Pgm} />
            <Route path='/chart' component={MyChart} />
        </Switch>
    </Router>
)
