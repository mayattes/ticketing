import React from "react";
import "./Ticket.css";
import axios from "axios";
// import { Link } from "react-router-dom";

class Ticket extends React.Component {
  state = {
    ticket: { equipes: [] }
  };
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    axios
      .get("http://localhost:3000/ticket/" + id)
      .then(response => {
        this.setState({ ticket: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    var data = new FormData(event.target);

    console.log(Array.from(data.entries()));
  }

  render() {
    const { ticket } = this.state;
    console.log(ticket);

    return (
      <div className="container">
        <div className="">
          <div className="">
            <dl className="row dl-horizontal dl-bordered">
              <dt className="col-sm-3">ID</dt>
              <dd className="col-sm-9">{ticket.idKoaly}</dd>
            </dl>
            <dl className="row dl-horizontal">
              <dt className="col-sm-3">Type</dt>
              <dd className="col-sm-9">{ticket.type}</dd>
            </dl>
            <dl className="row dl-horizontal">
              <dt className="col-sm-3">Auteur</dt>
              <dd className="col-sm-9">{ticket.auteur}</dd>
            </dl>
            <dl className="row dl-horizontal">
              <dt className="col-sm-3">Message</dt>
              <dd className="col-sm-9 message">{ticket.message}</dd>
            </dl>
          </div>

          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                choix d'équipe 1 :
                <select className="form-control" name="equipe">
                  {ticket.equipes.map((equipe, index) => {
                    return (
                      <option key={index} value={equipe.id}>
                        {equipe.id} - {equipe.name} - {equipe.confidence} %
                      </option>
                    );
                  })}
                </select>
              </label>
              <input
                type="hidden"
                value={this.props.match.params.id}
                name="id"
              />
              {/* <Link to={{ pathname: "/tickets" }}> */}
              <button
                type="submit"
                className="manuel btn-primary"
                value="valider"
              >
                valider
              </button>
              {/* </Link> */}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Ticket;
