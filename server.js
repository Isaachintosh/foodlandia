const express = require('express');
const app = express();
app.use(express.static('Public'));

app.get("/", (Request, response) => {
    response.sendFile(__dirname + '/Public/index.html');
});

app.listen(process.env.PORT || 8080, () => {
    console.log('rodando liso');
});