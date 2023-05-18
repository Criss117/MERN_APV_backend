import nodemailer from 'nodemailer'

const emailRegistro = async (datos)=>{
    let transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    })

    const {email,nombre,token} = datos

    const info = await transport.sendMail({
      from: "APV - Administrador de pacientes de veterinaria",
      to: email,
      subject: 'Comprueba tu cuenta en APV',
      text: 'Comprueba tu cuenta en APV',
      html: `
        <p>Hola: ${nombre}, comprueba tu cuenta en APV</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarlas en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar cuenta</a>
        `
    })

  console.log('Mensaje enviado: %s',info.messageId);
}

export default emailRegistro