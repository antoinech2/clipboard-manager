var express = require('express');
var router = express.Router();
var PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()

/* GET users listing. */
router.get('/', async (req, res) => {
  const notes = await prisma.note.findMany({
    take: 50,
  })
  res.json(notes)
})

router.post(`/`, async (req, res) => {
  try{
    const result = await prisma.note.create({
      data: { ...req.body, date_created: new Date() },
    })
    res.json(result)  
  }
  catch(err){
    res.json(err, 500)
  }
})

router.delete(`/:id`, async (req, res) => {
  try{
    const { id } = req.params
    const post = await prisma.note.delete({
      where: { id: Number(id) },
    })
    res.json(post)
  }
  catch(err){
    res.status(500).json(err)
  }
})

module.exports = router;
