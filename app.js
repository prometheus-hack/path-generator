const express = require('express');
const {typeGuard, generate} = require("./pathGenerator");
const app = express();
const port = 3000;


app.use(express.json());
app.post('/generatePath', async (req, res) => {
    const guard = typeGuard.safeParse(req.body);
    if (!guard.success) return res.status(500).send(guard.error);
    const result = await generate(guard.data);
    console.log(result)
    return res.send(result);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})