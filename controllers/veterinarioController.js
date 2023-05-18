import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarToken from "../helpers/generarToken.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emailRecuperarPass from "../helpers/emailRecuperarPass.js"

const registrar = async (req,res) => {
    const {email,nombre} = req.body
    //revisar email
    const existeUsuario = await Veterinario.findOne({email})
    
    if(existeUsuario){
        const error = new Error('El correo ya esta registrado')
        return res.status(400).json({msg: error.message})
    }
    
    try {
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        //enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json({msg: 'Usuario registrado'})
    } catch (error) {
        console.log(error);
    }
}

const confirmar = async (req, res) => {
    const {token} =  req.params
    const usuarioConfirmar = await Veterinario.findOne({token})

    if(!usuarioConfirmar){
        const error = new Error('Token no valido')
        return res.status(404).json({msg: error.message})
    }

    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        console.log({msg: 'ususario confirmado'})
    } catch (error) {
        console.log(error);
    }

    res.json({msg:'Confirmando cuenta'})
}

const autenticar = async (req, res) => {
    const{email,password} = req.body

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})

    if(!usuario){
        const error = new Error('El Usuario no existe')
        return res.status(404).json({msg: error.message})
    }
    
    if(!usuario.confirmado){
        const error = new Error('El Usuario no esta confirmado')
        return res.status(403).json({msg: error.message})
    }

    if(await usuario.comprobarPassword(password)){
        
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    }else{
        const error = new Error('Contraseña incorrecta')
        return res.status(403).json({msg: error.message})
    }
}

const perfil = (req,res) =>{
    const {veterinario} = req

    res.json(veterinario)
}

const verificarEmail = async (req,res) => {
    const {email} = req.body

    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error('El usuario no existe')
        return res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarToken()
        await existeVeterinario.save()

        //enviar email
        emailRecuperarPass({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: "Revisa tu correo"})
    } catch (error) {
        console.log(error)
    }

}

const comprobarToken = async (req,res) => {
    const {token} = req.params

    const tokenValido = await Veterinario.findOne({token})

    if(tokenValido){
        res.json({msg: "existe"})
    }else{
        const error = new Error('Token no valido')
        return res.status(400).json({msg: error.message})
    }
}

const nuevoPassword = async (req,res) => {
    const {token} = req.params
    const {password} = req.body
    
    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('hubo un error')
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({msg:"Contraseña modificada"})
    } catch (error) {
        console.log(error)
    }

}

const actualizarPerfil = async (req,res)=>{
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario){
        const error = new Error('Ese correo ya está en uso')
        return res.status(400).json({msg: error.message})
    }
 
    const {nombre, email, web, telefono} = req.body

    if(veterinario.email !== email){
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error('Hubo un error')
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = nombre
        veterinario.email = email
        veterinario.web = web
        veterinario.telefono = telefono

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

const actualizarPassword = async (req,res) => {
    const {current, newPassword} = req.body
    const {id} = req.veterinario

    const veterinario = await Veterinario.findById(id)

    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    if(!await veterinario.comprobarPassword(current)){
        const error = new Error('Contraseña incorrecta')
        return res.status(400).json({msg: error.message})
    }

    veterinario.password = newPassword

    try {
        await veterinario.save()
        res.json({msg: 'Contraseña almacenda correctamente'})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }

}

export {
    registrar,
    confirmar,
    autenticar,
    perfil,
    verificarEmail,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}