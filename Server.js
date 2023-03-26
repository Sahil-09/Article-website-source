
const http=require('http');
const app=require('./Backend/app')

const server=http.createServer(app)


app.set('port',4005);
server.listen(4005,()=>{
    console.log("Server is listening at 4005")
})
