import React from "react";
import axios from "axios";
import "./Index.css";
import { Link } from "react-router-dom";

class Index extends React.Component {
  state = {
    tickets: []
  };
  componentDidMount() {
    axios
      .get("http://localhost:3000/tickets")
      .then(response => {
        console.log(response.data);
        this.setState({ tickets: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { tickets } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="row bloc">
            <div className="col-lg-4" />
            {/* <div class="col-sm-8">Largeur 8</div> */}
          </div>
        </div>
        <div>
          <table className="table table-bordered table-striped table-condensed">
            <thead>
              <tr>
                <th scope="col-lg">IdKoualy</th>
                <th scope="col-lg">Message</th>
                <th scope="col-lg">Type</th>
                <th scope="col-lg">Structure</th>
                <th scope="col-lg">Auteur</th>
                <th scope="col-lg">SLA</th>
                <th scope="col-lg">Création</th>
                <th scope="col-lg">Equipe Affecté</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => {
                console.log(ticket);
                return (
                  <tr key={index}>
                    <td>{ticket.idKoaly}</td>
                    <td>
                      <Link to={{ pathname: `/ticket/${ticket.idKoaly}` }}>
                        {ticket.message}
                      </Link>
                    </td>
                    <td>{ticket.structure}</td>

                    <td>{ticket.type}</td>
                    <td>{ticket.auteur}</td>
                    <td>{ticket.sla}</td>
                    <td>{ticket.creation}</td>
                    <td>{ticket.equipeValide}----</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Index;
