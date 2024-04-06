const express = require('express');
const cors = require('cors');
const {typeGuard, generate} = require("./pathGenerator");
const app = express();
const port = 82;

app.use(cors())
app.use(express.json());
app.post('/generatePath', async (req, res) => {
    const guard = typeGuard.safeParse(req.body);
    if (!guard.success) return res.status(500).send(guard.error);
    try {
        const result = await generate(guard.data);
        console.log(result)
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})