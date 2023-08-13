const winston = require("winston");
const { SeqTransport } = require("@datalust/winston-seq");

const logger = winston.createLogger({
  transports: [
    new SeqTransport({
      serverUrl: "http://localhost:5341",
      apiKey: "GJH1sNgCqKxASQjSeoYc",
      onError: (e) => {
        console.error(e);
      },
    }),
  ],
});

module.exports = logger;
