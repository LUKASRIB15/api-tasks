export async function json(request, response){
  const buffers = []

  for await(const chunk of request){
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers).toString()

  try{
    request.body = JSON.parse(fullStreamContent)
  }catch{
    request.body = null
  }

  return response.setHeader('Content-Type', 'application/json')
}