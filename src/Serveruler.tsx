import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Box,
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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getIsCompanyDay } from "./utils/getIsCompanyDay";
import { ButtonBase } from "@mui/material";

export default function Serveruler() {
  const { data, envOptions } = useUserData();
  const [selectedEnv, setSelectedEnv] = useState<string>(
    () => envOptions[getInitialEnvOptionIndex()]
  );
  const [selectedServer, setSelectedServer] = useState<string>(
    SERVER_OPTIONS[0].value
  );
  function handleEnv(env: string) {
    setSelectedEnv(env);
  }

  useEffect(() => {
    const initialEnvOptionIndex = getInitialEnvOptionIndex();
    if (!selectedEnv && envOptions[initialEnvOptionIndex])
      setSelectedEnv(envOptions[initialEnvOptionIndex]);
  }, [envOptions]);

  return (
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
                  key={option}
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
          <Fragment key={user + selectedServer + selectedEnv}>
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
  );
}

function useUserData() {
  const [data, setData] = useState<Data>({});
  const [envOptions, setEnvOptions] = useState<string[]>([]);

  useEffect(() => {
    async function updateData() {
      const data = await fetchData();
      setData(data);
    }

    if (data) updateData();
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

const SERVER_OPTIONS = [
  { label: "Core", value: "3000" },
  { label: "Indiky Server", value: "3001" },
  { label: "Shorten", value: "3002" },
  { label: "Indiky Web", value: "4000" },
  { label: "Auto X", value: "4010" },
];

async function fetchData() {
  const response = await fetch("data.json");

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
    if (address) updateStatus();
  }, [selectedEnv, selectedServer, data, address]);

  function copy() {
    const ip = getCompleteAddress(address, selectedServer);
    copyToClipboard(ip);
  }

  function openInNewWindow() {
    const ip = getCompleteAddress(address, selectedServer);

    window.open(ip, "_target");
  }

  return (
    <ListItem
      secondaryAction={
        <Stack direction="row" spacing=".5em">
          <IconButton onClick={openInNewWindow}>
            <OpenInNewIcon />
          </IconButton>
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
      <ListItemText
        primary={user}
        secondary={
          <ButtonBase onClick={() => copyToClipboard(data[selectedEnv])}>
            {data[selectedEnv]}
          </ButtonBase>
        }
      />
    </ListItem>
  );
}

async function getIsOnline(address: string, port: string) {
  try {
    await fetch(getCompleteAddress(address, port), {
      signal: AbortSignal.timeout(80000),
      mode: "no-cors",
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

function getInitialEnvOptionIndex() {
  const isCompanyDay = getIsCompanyDay();
  const intialOptionIndex = isCompanyDay ? 0 : 1;

  return intialOptionIndex;
}

function getCompleteAddress(address: string, port: string) {
  const ip = `http://${address}:${port}`;

  return ip;
}
