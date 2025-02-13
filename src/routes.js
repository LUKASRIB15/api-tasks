import { buildRoutePath } from "./utils/build-route-path.js"
import {Database} from "./database.js"
import crypto from "node:crypto"


const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response)=>{
      const {search} = request.query

      const tasks = database.select("tasks", search ? search : null)

      return response.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response)=>{
      const {title, description} = request.body
      database.insert("tasks", {
        id: crypto.randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return response.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response)=>{
      const {id} = request.params
      const {title, description} = request.body

      database.update("tasks", id, {
        title,
        description,
        updated_at: new Date().toISOString()
      })

      return response.end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response)=>{
     const {id} = request.params

     database.delete("tasks", id)

     return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response)=>{
     const {id} = request.params
     
     database.update("tasks", id, {
       completed_at: new Date().toISOString(),
       updated_at: new Date().toISOString()
     })

     return response.end()
    }
  }
]