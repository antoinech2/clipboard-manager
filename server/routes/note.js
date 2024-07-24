var express = require('express');
var router = express.Router();
var PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const notes = await prisma.note.findMany({
    take: 50,
    orderBy: { date_created: 'desc' },
  })
  res.json(notes)
})

router.post(`/`, async (req, res) => {
  try {
    const result = await prisma.note.create({
      data: { title: req.body.title, content: req.body.content, date_created: req.body.date_created || new Date() },
    })
    updateNotesAllClients()
    res.json(result)
  }
  catch (err) {
    res.status(500).json(err)
  }
})

router.put(`/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (typeof id == 'number' && id > 0) {
      const post = await prisma.note.update({
        where: { id: Number(id) },
        data: { title: req.body.title, content: req.body.content, date_modified: new Date() },
      })
      updateNotesAllClients()
      res.json(post)
    }
    else {
      return res.status(400).json({ error: 'Invalid id' })
    }
  }
  catch (err) {
    res.status(500).json(err)
  }
}
)

router.delete(`/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (typeof id == 'number' && id > 0) {
      const post = await prisma.note.delete({
        where: { id: Number(id) },
      })
      updateNotesAllClients()
      res.json(post)
    }
    else {
      return res.status(400).json({ error: 'Invalid id' })
    }
  }
  catch (err) {
    res.status(500).json(err)
  }
})


var wsClients = [];

router.ws("/", (ws, req) => {
  ws.send("Hello, welcome to the websocket")
  wsClients.push(ws);

  ws.on('close', () => {
    // Retirer le client de la liste des connexions
    wsClients = wsClients.filter(client => client !== ws);
  });
})

function sendToAllClients(type, message) {
  wsClients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type, data: message }));
    }
  });
}

function updateNotesAllClients() {
  prisma.note.findMany({
    take: 50,
    orderBy: { date_created: 'desc' },
  }).then(notes => {
    sendToAllClients("notes", notes)
  })
}

module.exports = router;
