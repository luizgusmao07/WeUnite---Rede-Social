export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifique seu email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verifique seu email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Olá,</p>
    <p>Obrigado por se cadastrar! Seu código de verificação é:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Insira este código na pagina de verificação para concluir seu cadastro.</p>
    <p>Este código irá expirar em 15 minutos por questões de segurança.</p>
    <p>Se você não criou uma conta conosco, por favor ignore este email.</p>
    <p>Atenciosamente,<br>WeUnite Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>>Essa é uma mensagem automática, por favor não responda.</p>
  </div>
</body>
</html>
`;

export const VERIFICATION_EMAIL_TEMPLATE_COMPANY = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Você solicitou um cadastro de empresa na WeUnite</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f9;
    }
    .header {
      background: linear-gradient(to right, #4CAF50, #45a049);
      padding: 20px;
      text-align: center;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
    }
    .content {
      background-color: #fff;
      padding: 20px;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .info-box {
      margin: 20px 0;
      text-align: center;
      background-color: #e8f5e9;
      padding: 10px;
      border-radius: 5px;
      color: #388e3c;
      font-weight: bold;
    }
    .info-box span {
      display: block;
      font-size: 14px;
      margin: 5px 0;
    }
    a {
      color: #4CAF50;
      text-decoration: none;
    }
    a:hover {
      text-decoration: none;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Confirme seu cadastro</h1>
  </div>
  <div class="content">
    <p>Olá,</p>
    <p>Obrigado por solicitar o cadastro de sua empresa na WeUnite!</p>
    <p>Segue abaixo os dados fornecidos durante a solicitação:</p>
    <div class="info-box">
      <span>CNPJ: {username}</span>
      <span>Nome: {name}</span>
      <span>E-mail: {email}</span>
      <span>Nome de usuário: {cnpj}</span>
    </div>
    <p>Para validar seu cadastro, solicitamos que envie documentos que comprovem sua identidade. Este é um procedimento necessário para a segurança e integridade da nossa plataforma.</p>
    <p>Se você não realizou esta solicitação, desconsidere este e-mail.</p>
    <p>Atenciosamente,<br>Equipe WeUnite</p>
  </div>
</body>
</html>
`;



export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reinicialização de senha completa</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Reinicialização de senha completa</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Olá,</p>
    <p>Estamos te enviando este email para confirmar que sua senha foi reiniciado com sucesso.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Se não foi você que reiniciou sua senha, por favor entre em contato com nossa equipe de suporte imediatamente.</p>
    <p>Por razões de segurança, nós recondamos que você: </p>
    <ul>
      <li>Use uma senha forte</li>
      <li>Evite usar a mesma senha em vários sites</li>
    </ul>
    <p>Obrigado por nos ajudar a manter sua conta segura!</p>
    <p>Atenciosamente,<br>WeUnite Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Essa é uma mensagem automática, por favor não responda.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reiniciar senha</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verifique seu email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Olá,</p>
    <p>O código de verificação para reiniciar sua senha:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Essa é uma mensagem automática, por favor não responda.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem vindo a WeUnite</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Olá {name}</p>
    <p>Estamos muito felizes em te receber em nosso site.</p>
    <p>Esperamos que você possa tirar proveito de todas nossas funcionalidades!</p>
    <p>Nossa boas vindas,<br>Equipe WeUnite</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Essa é uma mensagem automática, por favor não responda.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE_COMPANY = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à WeUnite, {name}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
    .header {
      background: linear-gradient(to right, #4CAF50, #45a049);
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      color: white;
      font-size: 24px;
      margin: 0;
    }
    .content {
      padding: 20px;
      font-size: 16px;
      line-height: 1.5;
    }
    .content p {
      margin-bottom: 15px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
    .footer p {
      margin: 5px 0;
    }
    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo à WeUnite!</h1>
    </div>
    <div class="content">
      <p>Olá,</p>
      <p>Estamos muito felizes em informar que sua solicitação de cadastro foi aprovada! Bem-vindo à WeUnite, a plataforma que conecta atletas, clubes, empresários e personalidades do futebol.</p>
      <p>Para acessar sua conta, use as seguintes informações:</p>
      <ul>
        <li><strong>Nome de usuário:</strong> {username}</li>
        <li><strong>Senha:</strong> {password}</li>
      </ul>
      <p>Essa é uma senha gerada automaticamente. Recomendamos que você altere a senha assim que acessar a plataforma utilizando a função de redefinição de senha.</p>
      <p>Estamos ansiosos para que você aproveite todos os recursos da WeUnite e tenha uma ótima experiência conosco.</p>
    </div>
    <div class="footer">
      <p>Essa é uma mensagem automática, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
`;