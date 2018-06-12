const fs = require("fs");
const parse = require("csv-parse");
const mongoose = require("mongoose");

const csvSource = "./data/ticket_header.csv";
const csvPredict = "./data/ticket_header_pred.csv";

function getProbilitiesFromLine(line) {
  const item = {
    idKoaly: line[0],
    probability_of_value_TE: line[2],
    probability_of_value_WINDOWS: line[3],
    probability_of_value_SUPPORT_QUICK_EDD: line[4],
    probability_of_value_SAUVEGARDE: line[5],
    probability_of_value_RESEAUX: line[6],
    probability_of_value_NETAPP: line[7],
    probability_of_value_BT_TOOLS: line[8],
    probability_of_value_COBICOM: line[9],
    probability_of_value_DBA: line[10],
    probability_of_value_PROD_APPLICATIVE: line[11],
    probability_of_value_SDM: line[12],
    probability_of_value_MANAGEMENT: line[13],
    probability_of_value_OPENINFO: line[14]
  };

  return item;
}

function probabilityToConfidence(probability) {
  return Math.round(parseFloat(probability).toFixed(2) * 100);
}

function generateEquipes(ticket) {
  const equipes = [
    {
      id: 1,
      name: "BT_TE",
      confidence: probabilityToConfidence(ticket.probability_of_value_TE)
    },
    {
      id: 2,
      name: "BT_WINDOWS",
      confidence: probabilityToConfidence(ticket.probability_of_value_WINDOWS)
    },
    {
      id: 3,
      name: "BT_SUPPORT_QUICK_EDD",
      confidence: probabilityToConfidence(ticket.probability_of_value_SUPPORT_QUICK_EDD)
    },
    {
      id: 4,
      name: "SAUVEGARDE",
      confidence: probabilityToConfidence(ticket.probability_of_value_SAUVEGARDE)
    },
    {
      id: 5,
      name: "BT_RESEAUX",
      confidence: probabilityToConfidence(ticket.probability_of_value_RESEAUX)
    },
    {
      id: 6,
      name: "BT_NETAPP",
      confidence: probabilityToConfidence(ticket.probability_of_value_NETAPP)
    },
    {
      id: 7,
      name: "BT_TOOLS",
      confidence: probabilityToConfidence(ticket.probability_of_value_BT_TOOLS)
    },
    {
      id: 8,
      name: "BT_COBICOM",
      confidence: probabilityToConfidence(ticket.probability_of_value_COBICOM)
    },
    {
      id: 9,
      name: "BT_DBA",
      confidence: probabilityToConfidence(ticket.probability_of_value_DBA)
    },
    {
      id: 10,
      name: "BT_PROD_APPLICATIVE",
      confidence: probabilityToConfidence(ticket.probability_of_value_PROD_APPLICATIVE)
    },
    {
      id: 11,
      name: "BT_SDM",
      confidence: probabilityToConfidence(ticket.probability_of_value_SDM)
    },
    {
      id: 12,
      name: "BT_MANAGEMENT",
      confidence: probabilityToConfidence(ticket.probability_of_value_MANAGEMENT)
    },
    {
      id: 13,
      name: "BT_OPENINFO",
      confidence: probabilityToConfidence(ticket.probability_of_value_OPENINFO)
    }
  ];

  return equipes;
}

mongoose.connect("mongodb://localhost:27017/ma_db");

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
  equipeValide: String,
  equipes: [{}]
});

const Ticket = mongoose.model("ticket", ticketSchema);

const parserSource = parse({ delimiter: "," }, (err, data) => {
  let isFirst = true;
  data.forEach(line => {
    if (isFirst) {
      isFirst = false;
      return;
    }

    const ticketFromCsv = {
      idKoaly: line[1],
      equipeValide: null,
      structure: line[0],
      type: line[3],
      statut: line[56],
      titre: line[4],
      message: line[5],
      auteur: line[31],
      sla: line[15],
      creation: line[35]
    };

    Ticket.findOne({ idKoaly: ticketFromCsv.idKoaly }, (err, ticket) => {
      if (ticket !== null) {
        console.log("exiting ticket");
      } else {
        const ticketMongo = new Ticket(ticketFromCsv);
        ticketMongo.save((err, newTicket) => {
          if (err) {
            console.log("something went wrong");
          } else {
            console.log(`we just saved the new ticket: ${newTicket.idKoaly}`);
          }
        });
      }
    });
  });
});

const parserPredict = parse({ delimiter: "," }, (err, data) => {
  let isFirst = true;
  data.forEach(line => {
    if (isFirst) {
      isFirst = false;
      return;
    }

    const probabilities = getProbilitiesFromLine(line);

    Ticket.findOne({ idKoaly: probabilities.idKoaly }, (err, ticket) => {
      if (ticket === null) {
        console.log("Not existing ticket");
      } else {
        console.log(`Existing ticket: ${ticket.idKoaly}`);

        const equipes = generateEquipes(probabilities);

        Ticket.update(
          { idKoaly: probabilities.idKoaly },
          { equipes: equipes },
          (err, result) => {
            if (err) {
              console.log("error");
            } else {
              console.log(`Updating: ${result.nModified}`);
            }
          }
        );
      }
    });
  });
});

if (process.argv[2] === '1') {
  console.log('Recuperation des tickets Koaoly');
  fs.createReadStream(csvSource).pipe(parserSource);
} else if(process.argv[2] === '2') {
  console.log('Traitement des tickets par AI Box');
  fs.createReadStream(csvPredict).pipe(parserPredict);
} else {
  console.log('Usage: npm start STEP');
  console.log('  STEP:');
  console.log('    1:  Recuperation des tickets non traités à partir de Koaly');
  console.log('    2:  Traitement des tickets par AI Box');
}
