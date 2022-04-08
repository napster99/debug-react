import * as React from "react";
import * as ReactDOM from "react-dom";
import * as NewReactDOM from "react-dom/client";
// https://reactjs.org/docs/react-dom-client.html

/**
 * Any existing DOM elements inside are replaced when render is called.
 * Later calls use React’s DOM diffing algorithm for efficient updates.
 * DOM本身已有元素将被替换，通过高效的差异算法实现更新
 *
 * createRoot 本身不会修改container节点，只会修改其子节点
 *  It may be possible to insert a component to an existing DOM node without overwriting the existing children.
 *
 * Using createRoot() to hydrate a server-rendered container is not supported.
 * Use hydrateRoot() instead.
 *
 * createRoot( New Root API )相比render( Legacy Root API )优点是什么？
 * //Initial render
 * ReactDOM.render(<App name="Saeloun blog" />, container);
 *
 * // During an update, React would access the root of the DOM element
 * ReactDOM.render(<App name="Saeloun testimonials" />, container);
 * 在更新的时候 我们仍然要传递root节点进去，尽管从不使用它
 *
 *
 * ReactDOM.render(<App name="Saeloun blog" />, container, function () {
 *    // Called after inital render or any update.
 *    console.log('Blog rendered');
 * });
 * 回调参数在新的根API中被完全删除，因为它难以正确计时
 * 渲染回调: createRoot 推荐requestIdleCallback\setTimeout\ref callback on the root
 *
 */
declare var requestIdleCallback;

const Page = ({ callback }) => {
  return <h1 ref={callback}>createRoot w</h1>;
};
const container: Element = document.getElementById("root");
const root: NewReactDOM.ReactDOMRoot = NewReactDOM.createRoot(container);

root.render(<Page callback={() => console.log("Page rendered1")} />);
// root.render(<span>333</span>)
// root.render(<span>wwwww</span>)
setTimeout(() => console.log("Page rendered2"), 0);
requestIdleCallback(() => console.log("Page rendered3"));
// ReactDOM.render(<h1>ReactDOM.render</h1>, container)
// root.unmount();
console.log(root);
