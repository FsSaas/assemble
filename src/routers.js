import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import { getComponent } from './components';

export default pages => {
  return (
    <Router>
      <Switch>
        {
          pages.map(page => {
            return <Route path={page.path} render={props => {
              debugger
              let PageComponent = getComponent(page.layout);
              let children = page.components.map(cmp => {
                let { name, slot, resources, } = cmp;
                let ElementComponent = getComponent(name);
                return <ElementComponent slot={slot} resources={resources} />
              })
              return (<PageComponent {...props} >{children}</PageComponent>)
            }} />
          })
        }
      </Switch>
    </Router>
  )
}
