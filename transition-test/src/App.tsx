import React, { useState } from 'react';
import './App.css';
import { AnimatedProps, animated, useTransition } from '@react-spring/web';

interface PageItem {
  (props: AnimatedProps<{ style: React.CSSProperties }>): React.ReactElement;
}

const pages: Array<PageItem> = [
  ({ style }) => <animated.div style={{ ...style, background: 'lightpink'}}>A</animated.div>,
  ({ style }) => <animated.div style={{ ...style, background: 'lightblue'}}>B</animated.div>,
  ({ style }) => <animated.div style={{ ...style, background: 'lightgreen'}}>C</animated.div>
]

function App() {
  const [index, setIndex] = useState(0)

  const onClick = () => {
    setIndex((state) => (state + 1) % pages.length)
  }

  const transitions = useTransition(index, {
    from: { transform: 'translate3d(100%, 0, 0)'},
    enter: { transform: 'translate3d(0%, 0, 0)'},
    leave: { transform: 'translate3d(-100%, 0, 0)'}
  })

  return (
    <div className="container" onClick={onClick}>
      {transitions((style, i) => {
        const Page = pages[i]
        return <Page key={i} style={style} />
      })}
    </div>
  )
}

export default App;
