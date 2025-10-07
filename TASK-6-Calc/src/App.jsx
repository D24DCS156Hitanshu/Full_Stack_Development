import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [displayValue, setDisplayValue] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [animateDisplay, setAnimateDisplay] = useState(false)


  useEffect(() => {
    if (displayValue !== '0') {
      setAnimateDisplay(true)
      const timer = setTimeout(() => setAnimateDisplay(false), 150)
      return () => clearTimeout(timer)
    }
  }, [displayValue])

  const clearAll = () => {
    setDisplayValue('0')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.')
      setWaitingForOperand(false)
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.')
    }
  }

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue)
    
    if (prevValue === null) {
      setPrevValue(inputValue)
    } else if (operator) {
      const currentValue = prevValue || 0
      let newValue = 0
      
      switch (operator) {
        case '+':
          newValue = currentValue + inputValue
          break
        case '-':
          newValue = currentValue - inputValue
          break
        case '×':
          newValue = currentValue * inputValue
          break
        case '÷':
          newValue = currentValue / inputValue
          break
        default:
          break
      }
      
      setPrevValue(newValue)
      setDisplayValue(String(newValue))
    }
    
    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const handleEquals = () => {
    if (!operator || prevValue === null) return
    
    performOperation('=')
    setOperator(null)
  }

  const handlePercentage = () => {
    const value = parseFloat(displayValue)
    setDisplayValue(String(value / 100))
  }

  const toggleSign = () => {
    const value = parseFloat(displayValue)
    setDisplayValue(String(-value))
  }

  return (
    <div className="calculator">
      <div className={`display ${animateDisplay ? 'animate' : ''}`}>
        <div className="display-value">{displayValue}</div>
      </div>
      
      <div className="keypad">
        <div className="row">
          <button className="key function" onClick={clearAll}>AC</button>
          <button className="key function" onClick={toggleSign}>±</button>
          <button className="key function" onClick={handlePercentage}>%</button>
          <button className="key operator" onClick={() => performOperation('÷')}>÷</button>
        </div>
        
        <div className="row">
          <button className="key number" onClick={() => inputDigit(7)}>7</button>
          <button className="key number" onClick={() => inputDigit(8)}>8</button>
          <button className="key number" onClick={() => inputDigit(9)}>9</button>
          <button className="key operator" onClick={() => performOperation('×')}>×</button>
        </div>
        
        <div className="row">
          <button className="key number" onClick={() => inputDigit(4)}>4</button>
          <button className="key number" onClick={() => inputDigit(5)}>5</button>
          <button className="key number" onClick={() => inputDigit(6)}>6</button>
          <button className="key operator" onClick={() => performOperation('-')}>−</button>
        </div>
        
        <div className="row">
          <button className="key number" onClick={() => inputDigit(1)}>1</button>
          <button className="key number" onClick={() => inputDigit(2)}>2</button>
          <button className="key number" onClick={() => inputDigit(3)}>3</button>
          <button className="key operator" onClick={() => performOperation('+')}>+</button>
        </div>
        
        <div className="row">
          <button className="key number zero" onClick={() => inputDigit(0)}>0</button>
          <button className="key number" onClick={inputDecimal}>.</button>
          <button className="key operator equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  )
}

export default App
