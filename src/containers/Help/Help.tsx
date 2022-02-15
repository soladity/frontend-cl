import * as React from 'react'
import { Button, Box, Card, Grid, Typography, TextField, MenuItem, styled, IconButton, Snackbar, Alert } from '@mui/material';
import Slide, { SlideProps } from '@mui/material/Slide';
import axios from 'axios'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

const Input = styled('input')({
    display: 'none',
});


type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
    return <Slide {...props} direction="up" />;
}

const Help = () => {
    let fileInput = React.useRef<HTMLInputElement>(null);

    const [attachmentFile, setAttachmentFile] = React.useState(null)
    const [email, setEmail] = React.useState('')
    const [discordID, setDiscordID] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [subject, setSubject] = React.useState('')
    const [submitted, setSubmitted] = React.useState(false)
    const [priority, setPriority] = React.useState('1')
    const [openSnackBar, setOpenSnackBar] = React.useState(false)
    const [snackBarMessage, setSnackBarMessage] = React.useState('')
    const [snackbarType, setSnackbarType] = React.useState<string>('error')

    const uploadSubtitle1 = async (event: any) => {
        event.preventDefault()
        var API_KEY = "jp0qrj5DTWcgBeg0L4FD";
        var FD_ENDPOINT = "cryptolegions";
        var PATH = "/api/v2/tickets";
        var auth = "Basic " + new Buffer(API_KEY + ":" + 'X').toString('base64');
        var URL = "https://" + FD_ENDPOINT + ".freshdesk.com" + PATH;

        var formInfo = new FormData()
        formInfo.append('email', email)
        formInfo.append('subject', subject)
        formInfo.append('description', description.replaceAll('\n', '<br/>'))
        formInfo.append('status', '2')
        formInfo.append('priority', priority)
        formInfo.append('tags[]', 'WEBSITE')
        formInfo.append('custom_fields[cf_discord]', discordID)

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
            if (res.status === 201) {
                setSnackbarType('success')
                setSnackBarMessage('Created ticket successfully!')
                setOpenSnackBar(true)
            }
            setEmail('')
            setSubject('')
            setDescription('')
            setDiscordID('')
            setAttachmentFile(null)
            setPriority('1')
        }).catch(err => {
            console.log(err)
        })

    }

    const setFile = (e: any) => {
        if (e.target.files[0]) {
            if (e.target.files[0].size / 1024 / 1024 > 15) {
                setSnackBarMessage('Attachment file must be smaller than 15 MB!')
                setSnackbarType('error')
                setOpenSnackBar(true)
            } else {
                setAttachmentFile(e.target.files[0])
            }
        }
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Card sx={{
                background: '#16161699',
                p: 2
            }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fff', paddingBottom: 2 }}>
                    Need help from our team? Send us a messages with the form below, and we’ll get back to you within 24 hours if your request relates to a bug/issue in the game.
                </Typography>
                <Box sx={{ p: 4 }}>
                    <form
                        onSubmit={(event: any) => {
                            uploadSubtitle1(event)
                        }}
                    >
                        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Email"
                                    placeholder='Your Email'
                                    onChange={(e: any) => setEmail(e.target.value)}
                                    name="email"
                                    value={email}
                                    // validators={['required', 'isEmail']}
                                    // errorMessages={['this field is required', 'Email is not valid']}
                                    sx={{ width: '100%' }}
                                    type="email"
                                    id="outlined-required"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="outlined-basic"
                                    label="DiscordID"
                                    placeholder='Your Discord(optional)'
                                    value={discordID}
                                    sx={{ width: '100%' }}
                                    onChange={e => setDiscordID(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Title"
                                    placeholder='Title of your issue'
                                    onChange={(e: any) => setSubject(e.target.value)}
                                    name="subject"
                                    value={subject}
                                    // validators={['required']}
                                    // errorMessages={['this field is required']}
                                    sx={{ width: '100%' }}
                                    id="outlined-required"
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    placeholder='Please describe your issue with as many details as possible. '
                                    onChange={(e: any) => setDescription(e.target.value)}
                                    name="description"
                                    value={description}
                                    // validators={['required']}
                                    // errorMessages={['this field is required']}
                                    sx={{ width: '100%' }}
                                    id="outlined-required"
                                    required
                                    multiline
                                    rows={7}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="contained-button-file">
                                    <Input accept="*" id="contained-button-file" multiple type="file" onChange={e => setFile(e)} />
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                        <AttachFileRoundedIcon />
                                    </IconButton>
                                    {
                                        attachmentFile ? (attachmentFile['name'] + ' / ' + (attachmentFile['size'] / 1024 / 1024).toFixed(3) + 'MB') : 'Attachment File (optional)'
                                    }
                                </label>
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
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                sx={{ marginLeft: 'auto' }}
                                color="primary"
                                variant="contained"
                                type="submit"
                            >
                                Create ticket
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Card>
            <Snackbar
                open={openSnackBar}
                TransitionComponent={TransitionUp}
                autoHideDuration={6000}
                onClose={() => setOpenSnackBar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                key={TransitionUp ? TransitionUp.name : ''}
            >
                {
                    snackbarType === 'success' ? (
                        <Alert onClose={() => setOpenSnackBar(false)} variant='filled' severity={'success'} sx={{ width: '100%' }}>
                            <Box sx={{ cursor: 'pointer' }} onClick={() => setOpenSnackBar(false)}>
                                {snackBarMessage}
                            </Box>
                        </Alert>
                    ) : (
                        <Alert onClose={() => setOpenSnackBar(false)} variant='filled' severity={'error'} sx={{ width: '100%' }}>
                            <Box sx={{ cursor: 'pointer' }} onClick={() => setOpenSnackBar(false)}>
                                {snackBarMessage}
                            </Box>
                        </Alert>
                    )
                }

            </Snackbar>
        </Box >
    )
}

export default Help;