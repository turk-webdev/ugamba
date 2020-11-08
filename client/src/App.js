import logo from './logo.svg';
import './App.css';

function App() {
  const onLearnReactClick = () => {
    fetch('/tests/')
      .then((res) => res.json())
      .then((result) => {
        console.log('results => ', result);
      });
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button className="App-link" onClick={() => onLearnReactClick()}>
          Learn React
        </button>
      </header>
    </div>
  );
}

export default App;
