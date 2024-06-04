import { Suspense, lazy, useLayoutEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { getIsCompanyDay } from "./utils/getIsCompanyDay";

const Serveruler = lazy(() => import("./Serveruler"));
const isProduction = import.meta.env.VITE_IS_PRODUCTION;

function App() {
  useLayoutEffect(() => {
    if (isProduction) redirectToLocalNetwork();
  }, [isProduction]);

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
        <Loader />
      ) : (
        <Suspense fallback={<Loader />}>
          <Serveruler />
        </Suspense>
      )}
    </Container>
  );
}

export default App;

function redirectToLocalNetwork() {
  const isCompanyDay = getIsCompanyDay();
  const ipAddress = isCompanyDay ? COMPANY_IP_ADDRESS : HOME_IP_ADDRESS;

  window.location.href = ipAddress;
}

const COMPANY_IP_ADDRESS = "http://10.10.0.197:5173/";
const HOME_IP_ADDRESS = "http://172.24.196.14:5173/";

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      marginBottom=".5em"
      marginTop="1em"
    >
      <CircularProgress />
    </Box>
  );
};
