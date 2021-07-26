const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'})
const { validationResult } = require('express-validator');

exports.autentificarUsuario = async (req, res, next) =>{
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }
    //Buscar el usuario para ver si está registrado
    const {email, password} = req.body;
    const usuario = await Usuario.findOne({email});

    if(!usuario){
        res.status(401).json({msg: 'El usuario no existe'});
        return next();
    }

    //Verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password, usuario.password)){
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        }, process.env.SECRETA,{
            expiresIn:'8h'
        })

        res.json({token})
    }else{
        res.status(401).json({msg: "Password incorrecto"})
        return next();
    }
}

exports.usuarioAutenticado = (req, res, next) =>{
    const authHeader = req.get('Authorization');
    
    if(authHeader){ 
        const token = authHeader.split(' ')[1];
        try{
            const usuario = jwt.verify(token, process.env.SECRETA);
            res.json({usuario});
        } catch(error){
            console.log(error)
            console.log('JWT no válido')
        }
       
    }
    return next();
}