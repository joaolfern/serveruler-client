import CloudIcon from '@mui/icons-material/Cloud'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import CopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Box,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Stack
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { SERVER_OPTIONS } from './constants'
import { useUserData } from './hooks/useIps'
import { copyToClipboard } from './utils/copyToClipboard'

export default function Serveruler() {
  const { data, selectedEnv, selectedServer } = useUserData()

  return (
    <Box sx={{ pt: 2 }}>
      <Grid container gap={2}>
        {Object.entries(data).map(([user, data]) => (
          <Grid key={user + selectedServer + selectedEnv}>
            <User
              user={user}
              data={data}
              selectedEnv={selectedEnv}
              selectedServer={selectedServer}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

interface IUserProps {
  user: string
  data: Record<string, string>
  selectedEnv: string
  selectedServer: string | string[]
}

enum Status {
  'on' = 'on',
  'off' = 'off',
  'loading' = 'loading'
}

function User({ data, user, selectedEnv, selectedServer }: IUserProps) {
  const [status, setStatus] = useState<Status>(Status.loading)
  const address = useMemo(() => {
    return data[selectedEnv]
  }, [data, selectedEnv])

  async function updateStatus() {
    setStatus(Status.loading)
    const isOnline = await getIsOnline(address, selectedServer)
    setStatus(isOnline ? Status.on : Status.off)
  }

  useEffect(() => {
    if (address) updateStatus()
  }, [selectedEnv, selectedServer, data, address])

  function copy() {
    const ip = getCompleteAddress(address, selectedServer)

    const formattedIp = Array.isArray(ip) ? ip.join(', ') : ip

    copyToClipboard(formattedIp)
  }

  function openInNewWindow() {
    const ip = getCompleteAddress(address, selectedServer)

    const ipArray = Array.isArray(ip) ? ip : [ip]

    ipArray.forEach((ip) => window.open(ip, '_blank'))
  }

  const isnew = true
  if (isnew)
    return (
      <Card sx={{ maxWidth: 275 }}>
        <CardContent>{user}</CardContent>
        <CardActions>
          <Grid container gap={2}>
            {SERVER_OPTIONS.map(({ label }) => {
              return (
                <Grid spacing={2}>
                  <Chip label={label} variant={'outlined'} />
                </Grid>
              )
            })}
          </Grid>
        </CardActions>
      </Card>
    )

  return (
    <ListItem
      secondaryAction={
        <Stack direction='row' spacing='.5em'>
          <IconButton onClick={openInNewWindow}>
            <OpenInNewIcon />
          </IconButton>
          <IconButton onClick={copy}>
            <CopyIcon />
          </IconButton>
          <IconButton onClick={updateStatus}>
            {status === Status.loading ? (
              <CircularProgress size='1em' />
            ) : status === Status.on ? (
              <CloudIcon color='success' />
            ) : (
              <CloudOffIcon color='error' />
            )}
          </IconButton>
        </Stack>
      }
    >
      <ListItemText
        primary={user}
        secondary={
          <ButtonBase onClick={() => copyToClipboard(data[selectedEnv])}>
            {data[selectedEnv]}
          </ButtonBase>
        }
      />
    </ListItem>
  )
}

async function getIsOnline(address: string, selectedServer: string | string[]) {
  try {
    const completeAddress = getCompleteAddress(address, selectedServer)
    const request = Array.isArray(completeAddress)
      ? completeAddress
      : [completeAddress]

    const promises = request.map((ip) =>
      fetch(ip, {
        signal: AbortSignal.timeout(80000),
        mode: 'no-cors'
      })
    )

    await Promise.all(promises)

    return true
  } catch (err) {
    return false
  }
}

function createCompleteAddressString(address: string, port: string) {
  return `http://${address}:${port}`
}

function getCompleteAddress(address: string, port: string | string[]) {
  if (Array.isArray(port)) {
    const ip = port.map((p) => createCompleteAddressString(address, p))
    return ip
  }

  const ip = createCompleteAddressString(address, port)

  return ip
}
