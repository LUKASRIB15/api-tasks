import {parse} from "csv-parse"
import fs from "node:fs"

const csvUrl = new URL('./tasks.csv', import.meta.url) // Gerando formato de URL

const stream = fs.createReadStream(csvUrl) // Criando leitor de arquivos (READ STREAM)

const csvParse = parse({
  delimiter: ',',
  skip_empty_lines: true,
  from_line: 2
}) // Criando tranformador de arquivos (TRANSFORM STREAM)

async function execute(){
  const lineParse = stream.pipe(csvParse) // Recebendo os dados de leitura transformadas

  for await (const line of lineParse){
    const [title, description] = line // A chegada de cada chunk vai ser tratada no await do for

    fetch("http://localhost:3333/tasks", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    }) // Enviando os dados para o banco de dados

    await wait(1000)
  }
}

execute()

async function wait(ms){
  return new Promise(resolve=>setTimeout(resolve, ms))
} 