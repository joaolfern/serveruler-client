import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Snackbar,
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

function User({ data, user, selectedEnv }: IUserProps) {
  const [status, setStatus] = useState<Record<string, boolean>>()
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const address = useMemo(() => {
    return data[selectedEnv]
  }, [data, selectedEnv])

  async function updateStatus() {
    setStatus(undefined)
    const isOnlineByAddress = await getIsOnline(address)
    setStatus(isOnlineByAddress)
  }

  useEffect(() => {
    if (address) updateStatus()
  }, [selectedEnv, data, address])

  function copy(selectedServer: string) {
    const ip = getCompleteAddress(address, selectedServer)

    const formattedIp = Array.isArray(ip) ? ip.join(', ') : ip

    copyToClipboard(formattedIp)
    setSnackbarOpen(true)
  }

  function statusColor(currentConnectionStatus: boolean | undefined) {
    if (currentConnectionStatus) return 'success'
    return 'error'
  }

  const [chipVariants, setChipVariants] = useState<
    Record<string, 'filled' | 'outlined'>
  >({})

  function handleVariant(label: string, isFilled: boolean) {
    setChipVariants((prev) => ({
      ...prev,
      [label]: isFilled ? 'filled' : 'outlined'
    }))
  }

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='success' sx={{ width: '100%' }}>
          URL copiada com sucesso!
        </Alert>
      </Snackbar>
      <Card sx={{ maxWidth: 275, pb: 1 }}>
        <CardContent>
          <Stack
            direction='row'
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{user}</span>
            <span onClick={() => copy(address)}>{address}</span>
          </Stack>
        </CardContent>
        <CardActions>
          <Grid
            container
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              gridAutoColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 1
            }}
          >
            {SERVER_OPTIONS.map(({ label, value }) => {
              const currentConnectionStatus = status
                ? Object.entries(status).find(([addr]) =>
                    addr.endsWith(`:${value}`)
                  )?.[1]
                : undefined

              return (
                <LoadingWrapper status={currentConnectionStatus} key={label}>
                  <Chip
                    label={chipVariants[label] === 'filled' ? value : label}
                    variant={chipVariants[label] || 'outlined'}
                    color={statusColor(currentConnectionStatus)}
                    onClick={() => copy(value)}
                    onMouseEnter={() => handleVariant(label, true)}
                    onMouseLeave={() => handleVariant(label, false)}
                    sx={{
                      width: '100%',
                      maxWidth: 120
                    }}
                  />
                </LoadingWrapper>
              )
            })}
          </Grid>
        </CardActions>
      </Card>
    </>
  )
}

async function getIsOnline(address: string) {
  const completeAddress = getCompleteAddress(address)
  const addresses = Array.isArray(completeAddress)
    ? completeAddress
    : [completeAddress]

  const results = await Promise.allSettled(
    addresses.map(async (ip) => {
      const res = await fetch(ip, { signal: AbortSignal.timeout(5000) })
      return res.ok
    })
  )

  const statusByAddress: Record<string, boolean> = {}
  results.forEach((result, idx) => {
    const ip = addresses[idx]
    if (result.status === 'fulfilled' && result.value === true) {
      statusByAddress[ip] = true
    } else {
      statusByAddress[ip] = false
    }
  })

  return statusByAddress
}

function getCompleteAddress(address: string, selectedPort?: string) {
  if (selectedPort) {
    return `http://${address}:${selectedPort}`
  }

  const ips: string[] = []
  SERVER_OPTIONS.map((option) => {
    const port = option.value
    const ip = `http://${address}:${port}`
    ips.push(ip)
  })

  return ips
}

function LoadingWrapper({
  status,
  children
}: {
  status: boolean | undefined
  children: React.ReactNode
}) {
  if (status === undefined) {
    return (
      <Skeleton
        variant='rectangular'
        width={120}
        height={30}
        sx={{ borderRadius: 16 }}
      />
    )
  }
  return children
}
