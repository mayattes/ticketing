// import { Query } from "mongoose";

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/ma_db");

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const ticketSchema = new mongoose.Schema({
  idKoaly: String,
  structure: String,
  type: String,
  statut: String,
  titre: String,
  message: String,
  auteur: String,
  sla: String,
  creation: Date,
  equipeValide: String
});

const Ticket = mongoose.model("ticket", ticketSchema);

app.get("/tickets", function(req, res, next) {
  Ticket.find({}, function(err, tickets) {
    if (!err) {
      res.send(tickets);
    }
  });
});

app.put("/tickets", function(req, res, next) {
  Ticket.find({}, function(err, tickets) {
    if (!err) {
      res.send(tickets);
    }
  });
});

//ticket
app.get("/ticket/:id", function(req, res, next) {
  Ticket.findOne({ idKoaly: req.params.id }, function(err, ticket) {
    if (!err) {
      res.send(ticket);
    }
  });
});

app.post("/ticket/:idKoaly", function(req, res, next) {
  Ticket.findOneAndUpdate(
    { idKoaly: req.params.id },
    { equipeValide: req.params.equipeValide },
    function(err, ticket) {
      if (!err) {
        res.send(ticket);
      } else {
        res.redirect("/tickets");
      }
    }
  );
});

app.put("/ticket/:idKoaly", function(req, res, next) {
  Ticket.findOneAndUpdate(
    { idKoaly: req.params.idKoaly },
    { equipeValide: req.body.equipe },
    function(err, ticket) {
      if (!err) {
        res.send(ticket);
      } else {
        res.redirect("/tickets");
      }
    }
  );
});

app.listen(3000, "localhost", function() {
  console.log("Server has started");
});
