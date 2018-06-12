import React from "react";
import Index from "../src/ticket/Index";
import Navbar from "../src/navbar/Navbar";
import Ticket from "../src/ticket/Ticket";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route
            path="/tickets"
            component={() => <Index inputs={this.props.inputs} />}
          />
          <Route path="/ticket/:id" component={Ticket} />
        </div>
      </Router>
    );
  }
}

export default App;
