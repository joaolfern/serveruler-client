import { Fragment, useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CopyIcon from "@mui/icons-material/ContentCopy";

const SERVER_OPTIONS = [
  { label: "Core", value: "3000" },
  { label: "Indiky", value: "3001" },
  { label: "Shorten", value: "3002" },
];

const isProduction = import.meta.env.VITE_IS_PRODUCTION;

function App() {
  const { data, envOptions } = useUserData();
  const [selectedEnv, setSelectedEnv] = useState<string>(envOptions[0]);
  const [selectedServer, setSelectedServer] = useState<string>(
    SERVER_OPTIONS[0].value
  );

  function handleEnv(env: string) {
    setSelectedEnv(env);
  }

  useEffect(() => {
    if (!selectedEnv && envOptions[0]) setSelectedEnv(envOptions[0]);
  }, [envOptions]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        marginBottom=".5em"
        gap=".5em"
      >
        <img src="https://i.imgur.com/EXY2Msb.png" height={50} width={50} />
        <Typography variant="h3" component="h1">
          Serveruler
        </Typography>
      </Box>
      {isProduction ? (
        <ProductionRedirect />
      ) : (
        <>
          <Box>
            <Stack spacing="1em">
              <div>
                <Typography variant="h4" component="h2">
                  Environment
                </Typography>
                <Stack direction="row" spacing=".5em">
                  {envOptions.map((option) => (
                    <Chip
                      label={option}
                      variant={option === selectedEnv ? "filled" : "outlined"}
                      onClick={() => handleEnv(option)}
                    />
                  ))}
                </Stack>
              </div>
              <div>
                <Typography variant="h4" component="h2">
                  Servers
                </Typography>
                <Stack direction="row" spacing=".5em">
                  {SERVER_OPTIONS.map(({ label, value }) => (
                    <Chip
                      label={label}
                      variant={value === selectedServer ? "filled" : "outlined"}
                      onClick={() => setSelectedServer(value)}
                    />
                  ))}
                </Stack>
              </div>
            </Stack>
          </Box>
          <List>
            {Object.entries(data).map(([user, data]) => (
              <Fragment key={user}>
                <User
                  user={user}
                  data={data}
                  selectedEnv={selectedEnv}
                  selectedServer={selectedServer}
                />
                <Divider variant="inset" component="li" />
              </Fragment>
            ))}
          </List>
        </>
      )}
    </Container>
  );
}

export default App;

function useUserData() {
  const [data, setData] = useState<Data>({});
  const [envOptions, setEnvOptions] = useState<string[]>([]);

  useEffect(() => {
    async function updateData() {
      const data = await fetchData();
      setData(data);
    }

    updateData();
  }, []);

  useEffect(() => {
    if (!data) return;

    const envOptions = getAvailableEnvs(data);
    setEnvOptions(envOptions);
  }, [data]);

  return {
    data,
    envOptions,
  };
}

async function fetchData() {
  const response = await fetch("data4fbfb2e144a02b8d1347.json");

  const data = await response.json();

  return data;
}

function getAvailableEnvs(data: Data): string[] {
  const envs: string[] = [];

  for (const user in data) {
    for (const env in data[user]) {
      const isNewEnv = !envs.includes(env);

      if (isNewEnv) envs.push(env);
    }
  }

  return envs;
}

type Data = Record<string, Record<string, string>>;

interface IUserProps {
  user: string;
  data: Record<string, string>;
  selectedEnv: string;
  selectedServer: string;
}

enum Status {
  "on" = "on",
  "off" = "off",
  "loading" = "loading",
}

function User({ data, user, selectedEnv, selectedServer }: IUserProps) {
  const [status, setStatus] = useState<Status>(Status.loading);
  const address = useMemo(() => {
    return data[selectedEnv];
  }, [data, selectedEnv]);

  async function updateStatus() {
    setStatus(Status.loading);
    const isOnline = await getIsOnline(address, selectedServer);
    setStatus(isOnline ? Status.on : Status.off);
  }

  useEffect(() => {
    updateStatus();
  }, [selectedEnv, selectedServer, data]);

  function copy() {
    const ip = `http://${address}:${selectedServer}`;
    copyToClipboard(ip);
  }

  return (
    <ListItem
      secondaryAction={
        <Stack direction="row" spacing=".5em">
          <IconButton onClick={copy}>
            <CopyIcon />
          </IconButton>
          <IconButton onClick={updateStatus}>
            {status === Status.loading ? (
              <CircularProgress size="1em" />
            ) : status === Status.on ? (
              <CloudIcon color="success" />
            ) : (
              <CloudOffIcon color="error" />
            )}
          </IconButton>
        </Stack>
      }
    >
      <ListItemText primary={user} secondary={data[selectedEnv]} />
    </ListItem>
  );
}

async function getIsOnline(address: string, port: string) {
  try {
    await fetch(`http://${address}:${port}`, {
      signal: AbortSignal.timeout(8000),
    });

    return true;
  } catch (err) {
    return false;
  }
}

function copyToClipboard(data: string | undefined) {
  try {
    if (!data) throw new Error("Erro ao copiar link!");
    if (typeof navigator.clipboard === "undefined") {
      const textArea = document.createElement("textarea");
      textArea.value = data;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    navigator.clipboard.writeText(data);
  } catch (err) {
    console.error(err);
  }
}

function ProductionRedirect() {
  return (
    <Stack direction="row" spacing="1em" justifyContent="center">
      <Button href="http://10.10.0.197:5173/" variant="outlined">
        Presencial
      </Button>
      <Button href="http://172.24.196.14:5173/" variant="outlined">
        Home-office
      </Button>
    </Stack>
  );
}
