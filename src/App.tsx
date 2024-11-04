import { Suspense, lazy } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Layout } from "./layout/Layout";
import { appTheme } from "./theme/appTheme";

const Serveruler = lazy(() => import("./Serveruler"));

const theme =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

function App() {
  return (
    <ThemeProvider theme={appTheme(theme)}>
      <CssBaseline />
      <Layout>
        <Suspense fallback={<Loader />}>
          <Serveruler />
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
}

export default App;

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
