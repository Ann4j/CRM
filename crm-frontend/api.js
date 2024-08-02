
// функция добавления клиента  на сервер
async function addClientServer(client) {
  let responseAddClients = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  })
}

// получаем данные из сервера
async function serverClientsList() {
  let respons = await fetch('http://localhost:3000/api/clients');
  return await respons.json();
}

//  Удаляем клиента с сервера
async function serverDeletClient(id) {
  let responsDeletclient = await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'DELETE'
  })
}

//Изменяем аднные клиента на сервер
async function changeClientServer(id,client) {
  let responsChangeClient = await fetch (`http://localhost:3000/api/clients/${id}`, {
    method:'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  })
}

// получаем данные 1 клиента
async function clientServer(id) {
  let responsClient = await fetch (`http://localhost:3000/api/clients/${id}`)
  return await responsClient.json();
}


const api = {addClientServer,serverClientsList,serverDeletClient, changeClientServer, clientServer }

export default api
