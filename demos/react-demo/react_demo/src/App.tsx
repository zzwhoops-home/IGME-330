import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// lowercase doesn't work as a react function
// const app = () => {
//   return (
//     <>
//       <div></div>
//       <div></div>
//     </>
//   )
// }

const App = () => {
  // treat count as a "throwaway" value that can be referenced this refresh
  const [count, setCount] = useState(0)

  const [names, setNames] = useState([]);

  const fetchData = async() => {
    const result = await fetch("http://");
    const data = await result.json();

    return data;
  }

  // so that the network call setting names does not rerender and call fetchData again
  useEffect(() => {
    fetchData().then(data => {
      setNames(data);
      console.log(names);
    });
  }, [/* dependency list*/]); // for react to recognize changes in the dependency list and call what is within the useEffect hook again

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App