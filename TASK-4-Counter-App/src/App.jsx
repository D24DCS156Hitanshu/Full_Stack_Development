import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');

  const handleFirstNameChange = (event) => {
    setfirstname(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setlastname(event.target.value);
  };


  return (
    <>
      <div className='box'>
      <div className='try'>
        <h1>{count}</h1>
      </div>
      <div className='try'>
        <button onClick={() => setCount((count) => count + 1)}>
          INCREMENT
        </button>
        <button onClick={() => setCount((count) => count - 1)}>
          DECREMENT
        </button>
        <button onClick={() => setCount(0)}>
          RESET
        </button>
        <button onClick={() => setCount((count) => count + 5)}>
          INCREMENT 5
        </button>
      </div>
      <div className='try'>
        <h1> WELCOME TO CHARUSAT!!</h1>
      </div>
      <div className='try'>
        FirstName: <input type="text" placeholder="Enter your First name" onChange={handleFirstNameChange} /><br />
      </div>
      <div className='try'>
        LastName: <input type="text" placeholder="Enter your Last name" onChange={handleLastNameChange} />
      </div>
      <div className='try'>
        First Name: {firstname} <br />
        Last Name: {lastname} <br />
      </div>
      </div>
    </>
  );
}

export default App;
