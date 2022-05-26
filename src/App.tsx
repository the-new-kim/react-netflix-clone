import { createGlobalStyle, ThemeProvider } from "styled-components";
import { defaultTheme } from "./theme";
import Router from "./Router";
import reset from "styled-reset";
import { Helmet } from "react-helmet";

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    position: relative;
    height: 100%;
    font-family: 'Kanit', sans-serif;
    font-weight: 100;
    background-color: black;
    color: white;
  }
  a{
    color: white;
    text-decoration:none;
  }
  
`;

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;400&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;
