const express = require('express');
const app = express();
const route = require('./routes/routing');
const port = 4000;
const errorLogger = require('./utilities/errorlogger');
const cors = require('cors');
app.use(cors())
app.use(express.json())
app.use('/', route);

app.use(errorLogger);
app.listen(port);

