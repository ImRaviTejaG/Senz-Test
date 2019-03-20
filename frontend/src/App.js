import React, { Component } from 'react'
import axios from 'axios'
import * as openpgp from 'openpgp'
import './App.css'

let clientKeyObj

let genKeyPairOptions = {
  userIds: [{ name:'client' }],
  curve: "ed25519",
  passphrase: 'client-password'
}
openpgp.generateKey(genKeyPairOptions).then(key => {
  clientKeyObj = key
  console.log(key.publicKeyArmored)
})

class App extends Component {
  fileEncrypt = async(fileName, content) => {
    let uint8Content = new Uint8Array(content)
    let privKeyObj = clientKeyObj.privateKeyArmored
    let serverPgpReq = await axios.get('http://localhost:4000/serverpgpkey')
    let options = {
      message: openpgp.message.fromBinary(uint8Content),
      publicKeys: (await openpgp.key.readArmored(serverPgpReq.data)).keys,
      privatekeys: privKeyObj
    }
    openpgp.encrypt(options).then(ciphertext => {
      this.sendData(fileName, ciphertext)
    }).catch(err => {
      console.log(err)
    })
  }

  fileRead = event => {
    let reader = new FileReader()
    let fileObject = event.target.files[0]
    let filename = fileObject.name
    reader.readAsArrayBuffer(fileObject)
    reader.onloadend = e => {
      this.fileEncrypt(filename, reader.result)
    }
  }

  sendData = (fileName, encryptedData) => {
    let options = { encryptedData: encryptedData, filename: fileName }
    axios.post('http://localhost:4000/postdata', options).then(res => {
      console.log(`Data sent successfully!`)
    }).catch(err => {
      console.log(`Data sending failed! ${err}`)
    })
  }

  render() {
    return (
      <div className="App">
        <input
          style={{display: 'none'}}
          type='file'
          onChange={this.fileRead}
          ref={fileIn => this.fileIn = fileIn}
        />
        <button onClick={() => this.fileIn.click()}>Select a file!</button>
        {/* <button onClick={this.sendData}>Upload</button> */}
      </div>
    );
  }
}

export default App;
