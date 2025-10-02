import Footer from "./components/Footer";
import Main from "./components/Main";
import { log } from "./utils/log";

import "./App.css";
import "./etc.css";

function App() {
  log('component', "App", 'log', 'rendered');
  return (
    <>
      <Main />
      <Footer />
    </>
  );
}

export default App;
