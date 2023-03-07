    //Chamando express para uso do parametro Router
        const express = require('express')
        const router = express.Router()
    //Importando models para uso do MongoDB
        const mongoose = require("mongoose")
        require("../models/Categoria")
        const Categoria = mongoose.model("categorias")

        require("../models/Postagens")
        const Postagens = mongoose.model("postagens")


router.get('/', function(req, res){
    res.render("admin/index")
})

router.get('/posts', function(req, res){
    res.send("Pagina de posts")
})


//Crud de categoria
router.get('/categorias', function(req, res){
    Categoria.find().lean().then((categorias) =>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "Erro ao exibir categorias")
        console.log("Erro ao exibir categorias ", err)
    })
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

router.get("/categorias/edit/:id", function(req, res){
    Categoria.findOne({_id:req.params.id}).lean().then((categorias)=>{
        res.render("admin/editCategorias",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Categoria inexistente!")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req, res)=>{
    const { id, nome, slug } = req.body;
    Categoria.findByIdAndUpdate(id, { nome, slug })
      .then(() => {
        req.flash("success_msg", "Sucesso ao editar categoria");
        res.redirect("/admin/categorias");
      })
      .catch((err)=>{
        req.flash("error_msg", "Houve um erro ao editar a categoria");
        console.log("Erro ao editar categoria", err);
        res.redirect("/admin/categorias");
      });
});

router.post("/categorias/deletar", (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).lean().then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req,flash("error_msg", "Erro ao deletar categoria")
        res.redirect("/admin/categoria")
    })

})

router.get("/postagens", (req, res)=>{
    Postagens.find().lean().populate("categoria").sort({data:"desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        console.log(err, " Houve um erro ao listar postagens")
        res.redirect("/admin")
    })
    

})

router.get("/postagens/add", (req, res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/addPostagem", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar o formulario")
        res.redirect("/admin")
    })
  

})

router.post("/postagens/nova", (req,res) => {
    var erros = []

    if (req.body.categorias == "0"){
        erros.push({text0: "Categoria invalida, registre uma categoria"})
    }
    if (erros.length > 0){
        res.render("admin/addCategorias", {erros: erros})
    }else{

        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
       
        new Postagens(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar postagem")
            res.redirect("/admin.postagens")
        })

    }
})

router.get("/postagens/edit/:id", (req, res)=>{

    Postagens.findOne({_id:req.params.id}).lean().then((postagens)=>{

        Categoria.find().lean().then((categorias)=>{
            res.render("admin/editPostagens", {categorias: categorias, postagens: postagens})

        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar formulario de edição")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagem/edit", (req, res)=>{
    const { id, titulo, slug, descricao, conteudo, categoria } = req.body;
    Postagens.findByIdAndUpdate(id, { titulo, slug, descricao, conteudo, categoria })
      .then(() => {
        req.flash("success_msg", "Sucesso ao editar categoria");
        res.redirect("/admin/postagens");
      })
      .catch((err)=>{
        req.flash("error_msg", "Houve um erro ao editar a categoria");
        console.log("Erro ao editar categoria", err);
        res.redirect("/admin/postagens");
      });
})

router.post("/postagens/deletar", (req, res) => {
    Postagens.deleteOne({_id: req.body.id}).lean().then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        req,flash("error_msg", "Erro ao deletar categoria")
        res.redirect("/admin/postagens")
    })
})




module.exports = router