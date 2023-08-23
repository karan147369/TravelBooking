const express = require('express');
const app = express();
const route = require('./routing');
const port = 5000;
const cors = require('cors')
// const errorLogger = require('./utilities/errorlogger');
// const requestLogger = require('./utilities/requestlogger');
app.use(express.json())
app.use(cors());

app.use('/', route);

//app.use(errorLogger);
app.listen(port);

