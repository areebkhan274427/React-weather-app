import "./App.css";
import Weather from "./components/Weather";

function App() {
  return (
    <div className="App">
      <div className="heading-container shadow">
        <h1 className="text-center">Weather Web APP</h1>
      </div>
      <Weather />
    </div>
  );
}

export default App;
