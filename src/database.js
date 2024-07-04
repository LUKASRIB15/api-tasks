import fs from "node:fs/promises"

const databasePath = new URL('../db.json', import.meta.url)

export class Database{
  #database = {}

  constructor(){
    fs.readFile(databasePath, 'utf8')
    .then((data)=>{
      this.#database = JSON.parse(data)
    })
    .catch(()=>{
      this.#persist()
    })
  }

  #persist(){
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search){
    let data = this.#database[table] ?? []

    if(search){
      data = data.filter(row=>{
        return row.title.includes(search) || row.description.includes(search)
      })
    }
  
    return data
  }
  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    }else{
      this.#database[table] = [data]
    }

    this.#persist()
  }

  delete(table, id){
    const rowIndex = this.#database[table].findIndex(row=>row.id === id)

    if(rowIndex > -1){
      this.#database[table].splice(rowIndex, 1)
    }
  }

  update(table, id, data){
    const rowIndex = this.#database[table].findIndex(row=>row.id === id)

    if(rowIndex > -1){
      this.#database[table][rowIndex] = {
        id,
        title: data.title ?? this.#database[table][rowIndex].title,
        description: data.description ?? this.#database[table][rowIndex].description,
        completed_at: data.completed_at ??this.#database[table][rowIndex].completed_at,
        created_at: this.#database[table][rowIndex].created_at,
        updated_at: data.updated_at
      }
    }
  }


}