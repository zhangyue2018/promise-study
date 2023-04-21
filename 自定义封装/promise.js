
function Promise(executor) {
    // 添加属性
    this.promiseState = 'pendding';
    this.promiseResult = null;

    let self = this;

    // resolve函数
    function resolve(data) {
        // 1.修改对象的状态
        self.promiseState = 'fulfilled';
        // 2.修改对象结果值
        self.promiseResult = data;
    }

    // reject函数
    function reject(data) {
        // 1.修改对象的状态
        self.promiseState = 'rejected';
        // 2.修改对象结果值
        self.promiseResult = data;
    }

    // 同步调用【执行器函数】
    executor(resolve, reject);
}

Promise.prototype.then = function(onResolve, onReject) {
    
};