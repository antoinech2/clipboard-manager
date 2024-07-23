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
  const result = await prisma.note.create({
    data: { ...req.body },
  })
  res.json(result)
})

module.exports = router;
