import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { flushSync } from "react-dom";

const { useState } = React;

/**
 * @description 自动批量处理 batchedUpdates
 * 同一上下文中触发的更新合并为一个更新
 * setState是同步还是异步，可以实现同步吗，怎么实现，异步的原理是什么？
 * https://github.com/facebook/react/issues/11527
 * https://jishuin.proginn.com/p/763bfbd5f75(2+2)
 *
 *  flushSync
 * 刷新整个树，并强制在调用内部发生更新时完成重新渲染，所以您应该非常谨慎地使用它。
 * 这样它不会破坏道具、状态和引用之间的内部一致性。
 *
 */
const Page: React.FC = () => {
  const [count, setCount] = useState(0);
  const [age, setAge] = useState(0);
  // const countRef = useRef(0);
  // 每次 Render 的内容都会形成一个快照并保留下来，因此当状态变更而 Rerender 时，就形成了 N 个 Render 状态，
  // 而每个 Render 状态都拥有自己固定不变的 Props 与 State

  console.log("render ...", React.version);

  // 以前：这里的两次setState并没有批量处理，React会render两次， 但可以提供手动批处理 unstable_batchedupdates
  // v18之前只有事件回调、生命周期回调中的更新会进行批处理，
  // 而setTimeout、 setInterval 、直接在 DOM 上绑定原生事件、Promise 的回调不会进行批处理
  // React18: 自动批量处理，只会render一次
  const handleClick = () => {
    setCount(count + 1);
    setAge(age + 2);
    console.log(count, age);
  };

  // 跳过批处理
  const handleClickBySync = () => {
    flushSync(() => {
      setCount(count + 1); // do render
    });
    flushSync(() => {
      setAge(age + 2); // do render
    });
    console.log(count, age);
  };

  const getCount = () => {
    setTimeout(() => {
      console.log(count); // Capture Value 0
      // console.log(countRef.current); // 实时
    }, 3000);
  };

  return (
    <>
      <h1>
        AutoBatching; count:{count}, age: {age}
      </h1>
      <button onClick={handleClick}>handleClick</button>
      <button onClick={handleClickBySync}>handleClickBySync</button>
      <div>
        <button onClick={getCount}>getCount</button>
      </div>
    </>
  );
};

const container: Element = document.getElementById("root");
const root: ReactDOM.ReactDOMRoot = ReactDOM.createRoot(container);
root.render(<Page />);


// 那么两次setState调用时上下文中全局变量executionContext中会包含BatchedContext
// onClick() {
//   setTimeout(() => {
//     ReactDOM.unstable_batchedUpdates(() => {
//       this.setState({a: 3});
//       this.setState({a: 4});
//     })
//   })
// }

// 批处理源码
// export function batchedUpdates<A, R>(fn: A => R, a: A): R {
//   const prevExecutionContext = executionContext;
//   executionContext |= BatchedContext;
//   try {
//     return fn(a);
//   } finally {
//     executionContext = prevExecutionContext;
//     // If there were legacy sync updates, flush them at the end of the outer
//     // most batchedUpdates-like method.
//     if (executionContext === NoContext) {
//       resetRenderTimer();
//       flushSyncCallbacksOnlyInLegacyMode();
//     }
//   }
// }
