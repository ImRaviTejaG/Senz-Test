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
  fileEncrypt = async (fileName, content) => {
    document.getElementById("uploadStatus").innerHTML = "Encrypting file contents"
    document.getElementById("uploadStatus").style.color = "orange"
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
    let fileObject = event.target.files[0]
    console.log(fileObject) 
    if ((fileObject.size / 1048576) > 10) {
      document.getElementById("uploadStatus").innerHTML = "File size too large (> 10 MB)"
      document.getElementById("uploadStatus").style.color = "red"
    } else {
      if (fileObject.type.substr(0, fileObject.type.indexOf('/')) !== 'image') {
        document.getElementById("uploadStatus").innerHTML = "Selected file is not an image"
        document.getElementById("uploadStatus").style.color = "red"
      } else {
        document.getElementById("uploadStatus").innerHTML = "Reading file"
        document.getElementById("uploadStatus").style.color = "blue"
        let reader = new FileReader()
        let filename = fileObject.name
        reader.readAsArrayBuffer(fileObject)
        reader.onloadend = e => {
          this.fileEncrypt(filename, reader.result)
        }
      }
    }
  }

  sendData = (fileName, encryptedData) => {
    document.getElementById("uploadStatus").innerHTML = "Sending content across!"
    let options = { encryptedData: encryptedData, filename: fileName }
    axios.post('http://localhost:4000/postdata', options).then(res => {
      document.getElementById("uploadStatus").innerHTML = "Upload successful!"
      document.getElementById("uploadStatus").style.color = "green"
      console.log(`Data sent successfully!`)
    }).catch(err => {
      document.getElementById("uploadStatus").innerHTML = "Upload failed! Please try again."
      document.getElementById("uploadStatus").style.color = "red"
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
        <button onClick={() => this.fileIn.click()}>Pick a file to upload instantly!</button>
        <p id='uploadStatus'></p>
        {/* <button onClick={this.sendData}>Upload</button> */}
      </div>
    );
  }
}

export default App;
