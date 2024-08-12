import { Suspense, lazy, useLayoutEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { getIsCompanyDay } from "./utils/getIsCompanyDay";
import { Layout } from "./layout/Layout";
import { appTheme } from "./theme/appTheme";

const Serveruler = lazy(() => import("./Serveruler"));
const isProduction = import.meta.env.VITE_IS_PRODUCTION;

const theme =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

function App() {
  useLayoutEffect(() => {
    if (isProduction) redirectToLocalNetwork();
  }, [isProduction]);

  return (
    <ThemeProvider theme={appTheme(theme)}>
      <CssBaseline />
      <Layout>
        {isProduction ? (
          <Loader />
        ) : (
          <Suspense fallback={<Loader />}>
            <Serveruler />
          </Suspense>
        )}
      </Layout>
    </ThemeProvider>
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
