

## Promise 的状态
实例对象的一个属性 [PromiseState]
* pending 未决定的
* resolved / fulfilled 成功
* rejected 失败

## Promise 对象的值
实例对象的另一个属性 [PromiseResult]
保存着异步任务的 [成功/失败] 的结果
* resolve
* reject

## 改变Promise对象状态的方式
* resolve
* reject
* throw

let p = new Promise((resolve, reject) => {
    <!-- resolve(); -->
    <!-- reject();  -->
    <!-- throw new Error('出错了'); -->
});

## 中断Promise链
含义：当使用promise的then链式调用时，在中间中断，不再调用后面的回调函数
办法：在回调函数中返回一个pendding状态的promise对象

let p = new Promise(function(resolve, reject) {
    setTimeout(() => {
        resolve('OK');
    }, 1000);
});

p.then(value => {
    console.log(111);
}).then(value => {
    console.log(222);
    return new Promise(() => {}); // 返回一个pendding状态的promise对象
}).then(() => {
    console.log(333);
}).catch(reason => {
    console.warn(reason);
});

## async 函数
返回值是一个promise对象
async function main() {
    <!-- return 321; -->
    <!-- return new Promise(function(resolve, reject) {
        // resolve('ok');
        reject('error---');
    }); -->
    throw 'oh no';
}

## await
1. await 右侧的表达式一般为promise对象，但也可以是其他的值
2. 如果表达式是promise对象，await返回的是promise成功的值
3. 如果表达式是其他值，直接将此值作为await的返回值

注意：
1. await必须写在async函数中，但是async函数中可以没有await
2. 如果await的promise失败了，就会抛出异常没需要通过try catch捕获处理，或者用.catch处理