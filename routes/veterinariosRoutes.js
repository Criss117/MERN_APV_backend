import express from "express"
import checkAuth from "../middleware/authMiddleware.js"
import { 
    registrar, 
    confirmar,
    autenticar,
    perfil, 
    verificarEmail,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from "../controllers/veterinarioController.js"

const router = express.Router()

//area publica
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)

router.post('/verificar-email', verificarEmail)
router.route('/verificar/:token').get(comprobarToken).post(nuevoPassword)

//area privada
router.get("/perfil", checkAuth, perfil)
router.put("/perfil/:id", checkAuth, actualizarPerfil)
router.put("/actualizar-password", checkAuth, actualizarPassword)



export default router