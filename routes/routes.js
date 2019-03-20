let bodyparser = require('body-parser')
let jsonparser = bodyparser.json({limit: '10mb', extended: true})
let express = require('express')
let fs = require('fs')
let openpgp = require('openpgp')
let path = require('path')
let router = express.Router()

openpgp.initWorker({ path:'compat/openpgp.worker.js' })

let decryptData = async (filename, encryptedText) => {
  let serverPrivKey = fs.readFileSync(path.resolve(__dirname, '../keys/', 'server.private'), {flag: 'r'})
  let passphrase = `server-password`
  serverPrivKey = (await openpgp.key.readArmored(serverPrivKey)).keys[0]
  await serverPrivKey.decrypt(passphrase)
  const options = {
    message: await openpgp.message.readArmored(encryptedText),
    privateKeys: serverPrivKey,
    format: 'binary'
  }
  openpgp.decrypt(options).then(decrypted => {
    fs.writeFileSync(filename, decrypted.data, {flag: 'w'})
  }).catch(err => {
    console.log(err)
  })
}


router.get('/serverpgpkey', (req, res) => {
  let content = fs.readFileSync(path.resolve(__dirname, '../keys/', 'server.public'), {flag: 'r'})
  res.status(200).send(content)
})

router.post('/postdata', jsonparser, (req, res) => {
  let encryptedText = req.body.encryptedData.data
  let filename = req.body.filename
  let data = decryptData(filename, encryptedText)
  res.status(200).send(`Success! ${data}`)
})

module.exports = router