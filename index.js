const express = require('express')
const app = express()
const { nuevoUsuario, consultarUsuario, editarUsuario, eliminarUsuario, consultaTransfe, nuevaTransfe } = require('./consultas')

app.listen(3000, ()=>{
  console.log('Puerto 3000 activado')
})

app.use(express.json())

app.get('/', (req, res)=>{
  try {
    res.sendFile(__dirname + '/index.html')
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get('/usuarios', async(req, res)=>{
  try {
    const result = await consultarUsuario()
    res.json(result)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post('/usuario', async(req, res)=>{
  try {
    const user = req.body
    const result = await nuevoUsuario(user)
    res.json(result)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.put('/usuario', async(req, res)=>{
  try {
    const { id } = req.query
    const user = req.body
    const result = await editarUsuario(user, id)
    res.json(result)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.delete('/usuario', async(req, res)=>{
  try {
    const { id } = req.query
    const result = await eliminarUsuario(id)
    res.json(result)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get('/transferencias', async(req, res)=>{
  try {
    const result = await consultaTransfe()
    res.json(result)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post('/transferencia', async(req,res)=>{
  try {
    const users = req.body
    const result = await nuevaTransfe(users)
    res.json(result)
  } catch (error) {
    res.status(500).send(error)
  }
})