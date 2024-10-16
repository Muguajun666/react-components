// import { useEffect, useState } from 'react';
// import {useMountedState} from 'react-use';
// import useMountedState from './hooks/useMountedState';

// const App = () => {
//     const isMounted = useMountedState();
//     const [,setNum ] = useState(0);

//     useEffect(() => {
//         setTimeout(() => {
//             setNum(1);
//         }, 1000);
//     }, []);

//     return <div>{ isMounted() ? 'mounted' : 'pending' }</div>
// };

// export default App;

// import {useLifecycles} from 'react-use';
// import useLifecycles from './hooks/useLifecycles';

// const App = () => {
//   useLifecycles(() => console.log('MOUNTED'), () => console.log('UNMOUNTED'));

//   return null;
// };

// export default App;

// import { useEffect } from "react";
// import { useCookie } from "react-use";
// import useCookie from "./hooks/useCookie";

// const App = () => {
//   const [value, updateCookie, deleteCookie] = useCookie("guang");

//   useEffect(() => {
//     deleteCookie();
//   }, []);

//   const updateCookieHandler = () => {
//     updateCookie("666");
//   };

//   return (
//     <div>
//       <p>cookie 值: {value}</p>
//       <button onClick={updateCookieHandler}>更新 Cookie</button>
//       <br />
//       <button onClick={deleteCookie}>删除 Cookie</button>
//     </div>
//   );
// };
// export default App;

// import {useHover} from 'react-use';
// import useHover from "./hooks/useHover";

// const App = () => {
//   const element = (hovered: boolean) =>
//     <div>
//       Hover me! {hovered && 'Thanks'}
//     </div>;

//   const [hoverable, hovered] = useHover(element);

//   return (
//     <div>
//       {hoverable}
//       <div>{hovered ? 'HOVERED' : ''}</div>
//     </div>
//   );
// };

// export default App;

// import { useRef } from "react";
// import { useScrolling } from "react-use";
// import useScrolling from "./hooks/useScrolling";

// const App = () => {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const scrolling = useScrolling(scrollRef);

//   return (
//     <>
//     {<div>{scrolling ? "滚动中.." : "没有滚动"}</div>}

//     <div ref={scrollRef} style={{height: '200px', overflow: 'auto'}}>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//       <div>guang</div>
//     </div>
//     </>
//   );
// };

// export default App;

// import { useRef } from 'react';
// import { useSize } from 'ahooks';
// import useSize from "./hooks/useSize";

// export default () => {
//   const ref = useRef<HTMLDivElement>(null);
//   const size = useSize(ref);
//   return (
//     <div ref={ref}>
//       <p>改变窗口大小试试</p>
//       <p>
//         width: {size?.width}px, height: {size?.height}px
//       </p>
//     </div>
//   );
// };


// import { useWhyDidYouUpdate } from 'ahooks';
// import useWhyDidYouUpdate from './hooks/useWhyDidYouUpdate';
// import React, { useState } from 'react';

// const Demo: React.FC<{ count: number }> = (props) => {
//   const [randomNum, setRandomNum] = useState(Math.random());

//   useWhyDidYouUpdate('Demo', { ...props, randomNum });

//   return (
//     <div>
//       <div>
//         <span>number: {props.count}</span>
//       </div>
//       <div>
//         randomNum: {randomNum}
//         <button onClick={() => setRandomNum(Math.random)}>
//           设置随机 state
//         </button>
//       </div>
//     </div>
//   );
// };

// export default () => {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <Demo count={count} />
//       <div>
//         <button onClick={() => setCount((prevCount) => prevCount - 1)}>减一</button>
//         <button onClick={() => setCount((prevCount) => prevCount + 1)}>加一</button>
//       </div>
//     </div>
//   );
// };


import { useCountDown } from 'ahooks';

export default () => {
  const [countdown, formattedRes] = useCountDown({
    targetDate: `${new Date().getFullYear()}-12-31 23:59:59`,
  });

  const { days, hours, minutes, seconds, milliseconds } = formattedRes;

  return (
    <p>
      距离今年年底还剩 {days} 天 {hours} 小时 {minutes} 分钟 {seconds} 秒 {milliseconds} 毫秒
    </p>
  );
};
