const app = require('express')();
const http = require("http").createServer(app);;
const fs = require('fs');
const path = require("path");
const dir = './Cache';
const hostname = '127.0.0.1';
const port = 3000;

//
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:4200']
    }
  });
  
  app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
  });
  
  io.on('connection', (socket) => {
   console.log('a user connected');
        
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
        
    socket.on("message", message => {
    console.log("Message Received: " + message);
    io.emit("message", { type: "new-message", text: message });
    });
  });

  function intervalFunc() {
      fs.readdir(dir, (err, files) => {
          if(files.length>0){
              console.log (files);
              let msg=files.length+" Files Detected";
              io.emit("message", { type: "new-message", text: msg });
            console.log(msg);
            files.forEach(element => {
                moveReadFile(element);
                io.emit("message", { type: "new-message", text: element+" moved successfully" });
            });
            
          }
      });
  }
  function moveReadFile(fileName,callback){
   
    const currentPath = path.join(dir,fileName  );
    const destinationPath = path.join("./History", fileName);
    var readStream = fs.createReadStream(currentPath);
    var writeStream = fs.createWriteStream(destinationPath);
    readStream.on('close', function () {
        fs.unlinkSync(currentPath);
    });
    readStream.pipe(writeStream);
  }
  
  setInterval(intervalFunc, 1500);


  http.listen(3000, () => {
    console.log('listening on *:3000');
  });