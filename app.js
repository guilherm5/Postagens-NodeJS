//Carregando modulos

  //Chamando express e definindo "app" como instancia do express
    const express = require ('express')
    const app = express()
  //Chamando o express-handlebars (template html) 
    const handlerbars = require ('express-handlebars')
  //Chamando body parser (para criacao de de usuarios no MongoDB a partir de formularios HTML)
    const bodyParser = require ('body-parser')
    const mongoose = require ('mongoose')
  //Chamando modulo admin para usar como rota
    const admin = require('./routes/admin')
    const path = require ('path')
  //Definindo sessions e flash (para usar como middleware)
    const session = require('express-session')
    const flash = require('connect-flash')

//Configuracoes

    //Session 
        app.use(session({
            secret: "qualquercoisa",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware 
        app.use(function(req, res, next){
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })


    //Configurando body parser (para criacao de de usuarios no MongoDB a partir de formularios HTML) e configurando o MongoDB
        app.use(express.json())    
        app.use(express.urlencoded({ extended: true}))  

        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp").then(()=>{
            console.log("Sucesso ao realizar conexão com o mongoDB")
        }).catch((err)=>{
            console.log("Erro ao se conectar com o mongoDB"+err)
        })

    //Configurando Handlebars
        app.engine('handlebars', handlerbars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')

    //Carregando arquivos publicos
        app.use(express.static(path.join(__dirname, "public")))

    //Conexão com o MongoDB
   


//Rotas
    app.use('/admin', admin)

//Outros
const PORT = 8081
app.listen(PORT, function(){
    console.log("Servidor rodando na port: "+ PORT)
})