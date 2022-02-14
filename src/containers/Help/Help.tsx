import * as React from 'react'
import { Button, Box, Card, Grid, Typography, TextField, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'

const Help = () => {
    let fileInput = React.useRef<HTMLInputElement>(null);

    const [attachmentFile, setAttachmentFile] = React.useState(null)
    const [email, setEmail] = React.useState('')
    const [discordID, setDiscordID] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [subject, setSubject] = React.useState('')
    const [submitted, setSubmitted] = React.useState(false)
    const [priority, setPriority] = React.useState('1')


    const uploadSubtitle1 = async () => {
        var API_KEY = "jp0qrj5DTWcgBeg0L4FD";
        var FD_ENDPOINT = "cryptolegions";
        var PATH = "/api/v2/tickets";
        var auth = "Basic " + new Buffer(API_KEY + ":" + 'X').toString('base64');
        var URL = "https://" + FD_ENDPOINT + ".freshdesk.com" + PATH;

        var fields = {
            'email': 'email@yourdomain.com',
            'subject': 'Ticket subject',
            'description': 'Ticket description.',
            'status': '2',
            'priority': '1',
            'tags[]': 'website',
            'attachments[]': attachmentFile
        }

        var formInfo = new FormData()
        formInfo.append('email', 'paul@gmail.com')
        formInfo.append('subject', 'I am paul')
        formInfo.append('description', 'Nice to meet you!')
        formInfo.append('status', '2')
        formInfo.append('priority', '1')
        formInfo.append('tags[]', 'WEBSITE')
        formInfo.append('custom_fields[cf_discord]', 'welcome')
        if (attachmentFile) {
            formInfo.append('attachments[]', attachmentFile)
        }


        var headers = {
            'Authorization': auth,
            'Content-Type': 'multipart/form-data',
        }

        axios.post(URL, formInfo, {
            headers: headers
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

    }

    const setFile = (e: any) => {
        setAttachmentFile(e.target.files[0])
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Card sx={{
                background: '#16161699',
                p: 2
            }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', paddingBottom: 2 }}>
                    If you need help, please feel free to ask for help!
                </Typography>
                <Box sx={{ p: 4 }}>
                    <ValidatorForm
                        onSubmit={() => {

                        }}
                    >
                        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                            <Grid item xs={6}>
                                <TextValidator
                                    label="Email"
                                    onChange={(e: any) => setEmail(e.target.value)}
                                    name="email"
                                    value={email}
                                    validators={['required', 'isEmail']}
                                    errorMessages={['this field is required', 'Email is not valid']}
                                    sx={{ width: '100%' }}
                                    id="outlined-required"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="outlined-basic"
                                    label="DiscordID"
                                    value={discordID}
                                    type={'email'}
                                    sx={{ width: '100%' }}
                                    onChange={e => setDiscordID(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                            <Grid item xs={12}>
                                <TextValidator
                                    label="Subject"
                                    onChange={(e: any) => setSubject(e.target.value)}
                                    name="subject"
                                    value={subject}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    sx={{ width: '100%' }}
                                    id="outlined-required"
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                            <Grid item xs={12}>
                                <TextValidator
                                    label="Description"
                                    onChange={(e: any) => setDescription(e.target.value)}
                                    name="description"
                                    value={description}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    sx={{ width: '100%' }}
                                    id="outlined-required"
                                    required
                                    multiline
                                    rows={7}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                            <Grid item xs={6}>
                                <TextValidator
                                    label="Email"
                                    onChange={(e: any) => setEmail(e.target.value)}
                                    name="email"
                                    value={email}
                                    validators={['required', 'isEmail']}
                                    errorMessages={['this field is required', 'Email is not valid']}
                                    sx={{ width: '100%' }}
                                    id="outlined-required"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="outlined-select"
                                    select
                                    label="Priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    helperText="Please select priority"
                                    sx={{ width: '100%' }}
                                >
                                    <MenuItem value={'1'}>Low</MenuItem>
                                    <MenuItem value={'2'}>Medium</MenuItem>
                                    <MenuItem value={'3'}>High</MenuItem>
                                    <MenuItem value={'4'}>Urgent</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </Box>
                <input type='file' name='subtitle' ref={fileInput} onChange={(e) => setFile(e)} />
                <button onClick={() => uploadSubtitle1()}>Upload</button>
            </Card>
        </Box>
    )
}

export default Help;