module.exports = {
  before: `<!DOCTYPE html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reinitialize password</title>
</head>
<body>
  <h1>TOPIC(S)</h1>
  <p>Hello `,

  after_name: `</p>
  
  <p>Votre nouveau mot de passe est :</p>
  <p>`,

  after_mdp: `</p>
</body>
</html>`
}
