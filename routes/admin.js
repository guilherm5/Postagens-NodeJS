    //Chamando express para uso do parametro Router
        const express = require('express')
        const router = express.Router()
    //Importando models para uso do MongoDB
        const mongoose = require("mongoose")
        require("../models/Categoria")
        const Categoria = mongoose.model("categorias")

router.get('/', function(req, res){
    res.render("admin/index")
})

router.get('/posts', function(req, res){
    res.send("Pagina de posts")
})


router.get('/categorias', function(req, res){
    res.render("admin/categorias")
})

router.get('/categorias/add', function(req, res){
    res.render("admin/addCategorias")
})

router.post('/caterogias/nova', function(req, res){
    //Tratamento de formulario
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug invalido"})
    }

    if (erros.length > 0) {
        res.render("admin/addCategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso!")
           res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao cadastrar categoria.")
            res.redirect("/admin")
        })
    }


})

module.exports = router