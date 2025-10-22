import {
  Alert,
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SERVER_OPTIONS } from "./constants";
import { useUserData } from "./hooks/useIps";
import { copyToClipboard } from "./utils/copyToClipboard";
import { getCompleteAddress } from "./utils/getCompleteAddress";
import { getIsOnline } from "./utils/getIsOnline";

export default function Serveruler() {
  const { data, selectedEnv } = useUserData();

  return (
    <Box sx={{ pt: 2 }}>
      <Grid container gap={2}>
        {Object.entries(data).map(([user, userData]) => {
          const address = userData[selectedEnv];
          if (!address) return;
          return (
            <Grid key={user + selectedEnv}>
              <User address={address} user={user} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

interface IUserProps {
  address: string;
  user: string;
}

function User({ address, user }: IUserProps) {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [chipVariants, setChipVariants] = useState<
    Record<string, "filled" | "outlined">
  >({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const updateItemLoading = useCallback((item: string, loading: boolean) => {
    setIsLoading((prev) => ({
      ...prev,
      [item]: loading,
    }));
  }, []);

  const updateItemStatus = useCallback((item: string, online: boolean) => {
    setStatus((prev) => ({
      ...prev,
      [item]: online,
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function updateStatus() {
      const isOnlineByAddress = await getIsOnline({
        address,
        updateItemLoading,
        updateItemStatus,
      });
      if (!cancelled) {
        setStatus(isOnlineByAddress);
      }
    }
    updateStatus();
    return () => {
      cancelled = true;
    };
  }, [address, updateItemLoading, updateItemStatus]);

  const copy = useCallback(
    (selectedServer?: string) => {
      if (!selectedServer) {
        copyToClipboard(address);
        setSnackbarOpen(true);
        return;
      }

      const ip = getCompleteAddress(address, selectedServer);
      const formattedIp = Array.isArray(ip) ? ip.join(", ") : ip;
      copyToClipboard(formattedIp);
      setSnackbarOpen(true);
    },
    [address]
  );

  function handleVariant(label: string, isFilled: boolean) {
    setChipVariants((prev) => ({
      ...prev,
      [label]: isFilled ? "filled" : "outlined",
    }));
  }

  const statusByPort = useMemo(() => {
    const result: Record<string, boolean> = {};
    Object.entries(status).forEach(([addr, online]) => {
      const port = addr.split(":").pop();
      if (port) result[port] = online;
    });
    return result;
  }, [status]);

  const username = USERNAMES[user];
  const profileImage = username && `https://github.com/${username}.png`;

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={750}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Endereço de IP copiado com sucesso!
        </Alert>
      </Snackbar>

      <Card sx={{ maxWidth: 275, pb: 1 }}>
        <CardContent>
          <Stack
            direction="row"
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={profileImage} sx={{ width: 24, height: 24 }} />
              <Typography>{user}</Typography>
            </Stack>
            <Typography onClick={() => copy()} sx={{ cursor: "pointer" }}>
              {address}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions style={{ paddingTop: 0 }}>
          <Grid
            container
            sx={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gridAutoColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 1,
            }}
          >
            {SERVER_OPTIONS.map(({ label, value }) => {
              const formattedLabel =
                chipVariants[label] === "filled" ? value : label;
              const currentConnectionStatus = statusByPort[value];
              const isLoadingKey = `http://${address}:${value}`;
              const isItemLoading = isLoading[isLoadingKey];

              return (
                <LoadingWrapper key={label} loading={isItemLoading}>
                  <Chip
                    label={formattedLabel}
                    variant={chipVariants[label] || "outlined"}
                    color={currentConnectionStatus ? "success" : "error"}
                    onClick={() => copy(value)}
                    onMouseEnter={() => handleVariant(label, true)}
                    onMouseLeave={() => handleVariant(label, false)}
                    sx={{
                      width: "100%",
                      maxWidth: 120,
                    }}
                  />
                </LoadingWrapper>
              );
            })}
          </Grid>
        </CardActions>
      </Card>
    </>
  );
}

function LoadingWrapper({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        width={120}
        height={32}
        sx={{ borderRadius: 16 }}
      />
    );
  }
  return children;
}

const USERNAMES: Record<string, string> = {
  joao: "joaolfern",
  carlos: "JoaoCarlosP",
  vieira: "RafaelHDSV",
  fernanda: "mfernandanll",
  bruno: "BrunoPasqual",
  lucas: "lucasrbordignon",
  tobias: "tobiasperassi",
  zarco: "felipezarco",
  danieli: "Danieli01",
  davi: "DaviSanttos",
  marcus: "marcuslaraa",
  mateus: "Al-Esmarfe",
  robson: "RobsonArita",
  michael: "MichaelDouglasLima",
  diego: "odiegoalessandro",
  janderson: "JandersonSR",
  nicolas: "Nicolaskn95",
  thales: "thalesmanoel",
  ana: "anamrcnds",
  andre: "AndreLuizJPoles",
  vinicius: "ViniciusRibeiro6",
};
