import * as React from 'react'
import { Button } from '@mui/material';

var unirest = require('unirest');
var fs = require('fs')

const Help = () => {

    const [attachmentFile, setAttachmentFile] = React.useState(null)

    const createFresh = () => {
        var API_KEY = "jp0qrj5DTWcgBeg0L4FD";
        var FD_ENDPOINT = "cryptolegions";

        var PATH = "/api/v2/tickets";
        var enocoding_method = "base64";
        var auth = "Basic " + new Buffer(API_KEY + ":" + 'X').toString('base64');
        var URL = "https://" + FD_ENDPOINT + ".freshdesk.com" + PATH;

        var fields = {
            'email': 'email@yourdomain.com',
            'subject': 'Ticket subject',
            'description': 'Ticket description.',
            'status': 2,
            'priority': 1,
        }

        var headers = {
            'Authorization': auth
        }

        unirest.post(URL)
            .headers(headers)
            .field(fields)
            .attach('attachments[]', fs.createReadStream('/assets/images/logo.png'))
            .end(function (response: any) {
                console.log(response.body)
                console.log("Response Status : " + response.status)
                if (response.status == 201) {
                    console.log("Location Header : " + response.headers['location'])
                }
                else {
                    console.log("X-Request-Id :" + response.headers['x-request-id']);
                }
            });
    }

    const setAttachment = (e: any) => {
        console.log(e.target.value)
        console.log(e.target.files[0].mozFullPath)
        console.log(e.target.files)

        setAttachmentFile(e.target.files[0])
    }

    const retrieveFresh = () => {
        var unirest = require('unirest');

        var API_KEY = "jp0qrj5DTWcgBeg0L4FD";
        var FD_ENDPOINT = "cryptolegions";

        var PATH = "/api/v2/tickets";
        var URL = "https://" + FD_ENDPOINT + ".freshdesk.com" + PATH;

        var Request = unirest.get(URL);

        Request.auth({
            user: API_KEY,
            pass: "X",
            sendImmediately: true
        })
            .end(function (response: any) {
                console.log(response.body)
                console.log("Response Status : ", response.status)
                if (response.status != 200) {
                    console.log("X-Request-Id :" + response.headers['x-request-id']);
                }
            });
    }

    return (
        <div>
            <Button variant='contained' onClick={() => createFresh()}>Create</Button>
            <Button variant='contained' onClick={() => retrieveFresh()}>retrieve</Button>
            <input type={'file'} onChange={(e) => setAttachment(e)} />
        </div>
    )
}

export default Help;