import { fileOps } from '../config/fileops'
let bodyparser = require('body-parser')
let jsonparser = bodyparser.json({ limit: '10mb', extended: true })

export let routes = router => {
  /**
   * Returns the server PGP public key to the client
   */
  router.route('/serverpgpkey')
    .get(fileOps.getServerPgpKey)

  /**
   * Receives the encrypted data and stores it into a file
   */
  router.route('/postdata')
    .post(jsonparser, fileOps.postDataHandler)
}
