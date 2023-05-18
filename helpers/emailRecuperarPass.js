import nodemailer from 'nodemailer'

const emailRecuperarPass = async (datos)=>{
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
      subject: 'Reestablece tu contraseña en APV',
      text: 'Reestablece tu contraseña en APV',
      html: `
        <p>Hola: ${nombre}, Reestablece tu contraseña en APV</p>
        <p>Para reestablecer tu contraseña, sigue el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/reestablecer-password/${token}">Reestablecer contraseña</a>
        `
    })

  console.log('Mensaje enviado: %s',info.messageId);
}

export default emailRecuperarPass