var express = require('express');
var router = express.Router();
var PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()

/* GET users listing. */
router.get('/', async (req, res) => {
  const notes = await prisma.note.findMany({
    take: 50,
    orderBy: { date_created: 'desc' },
  })
  res.json(notes)
})

router.post(`/`, async (req, res) => {
  try{
    const result = await prisma.note.create({
      data: { title: req.body.title, content: req.body.content, date_created: req.body.date_created || new Date() },
    })
    res.json(result)  
  }
  catch(err){
    res.status(500).json(err)
  }
})

router.delete(`/:id`, async (req, res) => {
  try{
    const id = parseInt(req.params.id)
    if (typeof id == 'number' && id > 0) {
      const post = await prisma.note.delete({
        where: { id: Number(id) },
      })
      res.json(post)
    }
    else {
      return res.status(400).json({ error: 'Invalid id' })
    }
  }
  catch(err){
    res.status(500).json(err)
  }
})

module.exports = router;
