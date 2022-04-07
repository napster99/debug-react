import * as React from 'react'
import * as ReactDOM from 'react-dom'

const Page = () => {
  return <h1>sssa</h1>
}

console.log('React', React)
console.log('ReactDOM', ReactDOM)
ReactDOM.render(<Page /> , document.getElementById('root'))