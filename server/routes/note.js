var express = require('express');
var router = express.Router();
var PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()
const multer = require('multer');
const fileSizeLimitMiddleware = require('../middleware/fileSizeLimit')
const auth = require('../middleware/auth')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage, limits: {
  fileSize: 1024 * 1024 * 10, // 10MB,
  fieldSize: 1024 * 1024 * 10, // 10MB
} })

const objectForClient = { id: true, title: true, content: true, date_created: true, date_modified: true, file_name: true, file_size: true }

// READ
router.get('/', auth, async (req, res) => {
  try{
    const notes = await prisma.note.findMany({
      take: 50,
      orderBy: { date_created: 'desc' },
      select: objectForClient
    })
    res.json(notes)  
  }
  catch(err){
    res.status(500).json(err)
    console.error(err)
  }
})

// READ FILE
router.get('/:id/file', auth, async (req, res) => {
  const id = parseInt(req.params.id)
  if (typeof id == 'number' && id > 0) {
    const note = await prisma.note.findUnique({
      where: { id: Number(id) },
      select: { file: true, file_name: true }
    })
    if (note) {
      res.setHeader('Content-Disposition', `attachment; filename="${note.file_name}"`)
      res.setHeader('Content-Type', 'application/octet-stream')
      res.send(note.file)
    }
    else {
      return res.status(404).json({ error: "Note don't have file" })
    }
  }
  else {
    return res.status(400).json({ error: 'Invalid id' })
  }
})

// CREATE
router.post(`/`, fileSizeLimitMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!(req?.file?.buffer || req.body.content)) {
      return res.status(400).json({ error: 'Content or file is required' })
    }
    const result = await prisma.note.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        file: req?.file?.buffer,
        file_name: req?.file?.originalname,
        file_size: req?.file?.size,
        date_created: req.body.date_created || new Date(),
        date_modified: req.body.date_modified,
      },
      select: objectForClient
    })
    updateNotesAllClients()
    res.json(result)
  }
  catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

// UPDATE
router.put(`/:id`, auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (typeof id == 'number' && id > 0) {
      const post = await prisma.note.update({
        where: { id: Number(id) },
        data: { title: req.body.title, content: req.body.content, date_modified: new Date() },
        select: objectForClient
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

// DELETE
router.delete(`/:id`, auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (typeof id == 'number' && id > 0) {
      const post = await prisma.note.delete({
        where: { id: Number(id) },
        select: objectForClient
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

// WEB SOCKET
var wsClients = [];

router.ws("/", (ws, req) => {
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
    select: objectForClient
  }).then(notes => {
    sendToAllClients("notes", notes)
  })
}

module.exports = router;
