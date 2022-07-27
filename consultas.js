const { Pool } = require('pg')

const config = {
  user: 'postgres',
  host: 'localhost',
  password: 'postgres',
  database: 'bancosolar',
  port: 5432
}

const pool = new Pool(config)

const nuevoUsuario = async(user)=>{
  const values = Object.values(user)
  const consulta = {
    text: 'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2)',
    values: [values[0], Number(values[1])]
  } 
  const result = await pool.query(consulta)
  return result
}

const consultarUsuario = async ()=>{
  const {rows} = await pool.query('SELECT * FROM usuarios')
  return rows
}

const editarUsuario = async(user, id)=>{
  const values = Object.values(user)
  const update = {
    text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = '${id}'`,
    values
  }
  const result = await pool.query(update)
  return result
}

const eliminarUsuario = async(id)=>{
  const result = await pool.query(`DELETE FROM usuarios WHERE id = '${id}'`)
  return result
}

const consultaTransfe = async()=>{
  const consulta = {
    text: 'SELECT fecha, emisor.nombre emisor, receptor.nombre receptor, monto FROM transferencias t JOIN usuarios emisor ON t.emisor= emisor.id JOIN usuarios receptor ON t.receptor = receptor.id;',
    rowMode: 'array'
  }
  const { rows } = await pool.query(consulta)
  return rows
}

const nuevaTransfe = async(user)=>{
  (async ()=>{
    const client = await pool.connect()
    const values = Object.values(user)
    
    try {
      await client.query('BEGIN');
      await client.query(`INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ((select id from usuarios where nombre = '${values[0]}'), (select id from usuarios where nombre = '${values[1]}'), '${Number(values[2])}', current_timestamp)`);
      await client.query(`UPDATE usuarios SET balance = balance - '${Number(values[2])}' WHERE id = (select id from usuarios where nombre = '${values[0]}')`);
      await client.query(`UPDATE usuarios SET balance = balance + '${Number(values[2])}' WHERE id = (select id from usuarios where nombre = '${values[1]}')`);
      await client.query('COMMIT');
      return true
    } catch (error) {
      await client.query('ROLLBACK');
      client.release()
      throw error
    }
  })().catch(e=> console.log(e.stack));
}

module.exports = { nuevoUsuario, consultarUsuario, editarUsuario, eliminarUsuario, consultaTransfe, nuevaTransfe }