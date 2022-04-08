import * as React from "react";
import * as ReactDOM from "react-dom/client";

const { Suspense } = React;


/**
 * @description suspense 悬而未决 2018年16.6.0版本中发布
 * React 16 将提供一个内置函数 componentDidCatch，如果 render() 函数抛出错误，
 * 该函数可以捕捉到错误信息，并且可以展示相应的错误信息
 * 官方例子：https://codesandbox.io/s/frosty-hermann-bztrp
 * 好处：
 *  - 当有错误发生时, 我们可以友好地展示 fallback 组件；
 *  - 可以捕捉到它的子元素（包括嵌套子元素）抛出的异常；
 *    {this.state.info && this.state.info.componentStack}
 *  - 可以复用错误组件；
 */

let status = "pending";
let result;
const data = new Promise((resolve) => setTimeout(() => resolve("结果"), 1e3));

function wrapPromise(promise) {
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  if (status === "pending") {
    // 利用了该特性 componentDidCatch(error, info)
    throw suspender || Promise.resolve();
  } else if (status === "error") {
    throw result;
  } else if (status === "success") {
    return result;
  }
}

function Result() {
  const state = wrapPromise(data);
  return <div>{state}</div>;
}

const Page = () => {
  console.log("render page");
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Result />
    </Suspense>
  );
};
const container: Element = document.getElementById("root");
const root: ReactDOM.ReactDOMRoot = ReactDOM.createRoot(container);

root.render(<Page />);

declare const Promise;
// 源码
// class Suspense extends React.Component {
//   state = { promise: null }
//   componentDidCatch(e) {
//       if (e instanceof Promise) {
//           this.setState(
//           { promise: e }, () => {
//               e.then(() => {
//                   this.setState({ promise: null })
//               })
//           })
//       }
//   }
//   render() {
//       const { fallback, children } = this.props
//       const { promise } = this.state
//       return <>
//           { promise ? fallback : children }
//       </>
//   }
// }
