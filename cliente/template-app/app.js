const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const {net} = require('electron')
//const dialog = require('electron').remote.dialog

  // Mantén una referencia global del objeto ventana, si no lo haces, la ventana se
  // cerrará automáticamente cuando el objeto de JavaScript sea basura colleccionada.
  let win
  var tagDoc
  console.log("hi")
  function createWindow () {
    //Crea una conexión
    //doRequest('GET','http:','192.168.1.131',8000,'polls/')
    // Crea la ventana del navegador.
    win = new BrowserWindow({width: 400, height: 300, frame: false })

    // y carga el archivo index.html de la aplicación.

    win.loadURL(url.format({
      pathname: path.join(__dirname, 'login.html'),
      protocol: 'file:',
      slashes: true
    }))

  ipc.on('open-file-dialog', function (event) {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    }, function (files) {
      if (files) event.sender.send('selected-directory', files)
    })
  })

  ipc.on('open-error-dialog', function (event,title,message) {
    dialog.showErrorBox(title, message)
  })

  ipc.on('http-request', function (event,method, protocol, hostname,port,path) {
    doRequest(method, protocol, hostname,port,path)
  })

  ipc.on('do-login', function (event,user,password) {
    doLogin(user,password)
  })

function doLogin(user,password){
  console.log("Attempting to log in...")
  const request = net.request({
    method: 'POST',
    url: 'http://192.168.1.131:8000/login',
  })
  const querystring = require('querystring');
  var postData = querystring.stringify({
    'username': user,
    'password': password
  });
  let body = ''
  request.on('response', (response) => {
    // check response.statusCode to determine if the request succeeded
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    // capture body of response
    // - can be called more than once for large result
    /response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
      body += chunk.toString()
    })
    // when response is complete, print body
    response.on('end', () => {
      console.log(`BODY: ${body}`)
    })
  })
  request.write(postData)
  request.end()
}


  //Makes an HTTP/S request.
  function doRequest(method, protocol, hostname,port,path){
    const request = net.request({
      method: method,
      protocol: protocol,
      hostname: hostname,
      port: port,
      path: path
    })



    request.on('response', (response) => {
      console.log(`STATUS: ${response.statusCode}`)
      response.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`)
      })
      response.on('end', () => {
        console.log('No more data in response.')
      })
    })
    request.end()
  }

  //Save tag corresponding document

  ipc.on('get-tag', function (event, arg) {
    event.sender.send('set-tag-doc', tagDoc)
  })


    // Emitido cuando la ventana es cerrada.
    win.on('closed', () => {
      // Desreferencia el objeto ventana, usualmente tu guardarias ventanas
      // en un arreglo si tu aplicación soporta multi ventanas, este es el momento
      // cuando tu deberías borrar el elemento correspiente.
      win = null
    })
  }





/*  win.webContents.on('crashed', function () {
   const options = {
     type: 'info',
     title: 'Renderer Process Crashed',
     message: 'This process has crashed.',
     buttons: ['Reload', 'Close']
   }
   dialog.showMessageBox(options, function (index) {
     if (index === 0) win.reload()
     else win.close()
   })
 })
*/


  // Este método será llamado cuando Electron haya terminado
  // la inicialización y esté listo para crear ventanas del navegador.
  // Algunas APIs pueden solamente ser usadas despues de que este evento ocurra.

  app.on('ready', createWindow)

  // Salir cuando todas las ventanas estén cerradas.
  app.on('window-all-closed', () => {
    // En macOS es común para las aplicaciones y sus barras de menú
    // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es clickeado y no hay otras ventanas abieras.
    if (win === null) {
      createWindow()
    }
  })

  // En este archivo tu puedes incluir el resto del código del proceso principal de
  // tu aplicación. Tu también puedes ponerlos en archivos separados y requerirlos aquí.
