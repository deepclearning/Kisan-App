const server = 'http://localhost:3000'

export async function api(url, data){
    const response = await fetch(server+url,{
        method: data ? 'POST' : 'GET',
        headers: new Headers({ 'content-type': 'application/json' }),
        ...(data ? {body: JSON.stringify(data)} : {})
    })
    const result = await response.json()
    return result;
}