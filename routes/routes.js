let bodyparser = require('body-parser')
let jsonparser = bodyparser.json({limit: '10mb', extended: true})
import {fileOps} from '../config/fileops'

export let routes = router => {
  router.route('/serverpgpkey')
    .get(fileOps.getServerPgpKey)

  router.route('/postdata')
    .post(jsonparser, fileOps.postDataHandler)
}