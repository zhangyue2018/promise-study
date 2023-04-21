
function Promise(executor) {
    // 添加属性
    this.promiseState = 'pendding';
    this.promiseResult = null;

    let self = this;

    // resolve函数
    function resolve(data) {
        // 判断状态--状态只能修改一次
        if(self.promiseState !== 'pendding') return;
        // 1.修改对象的状态
        self.promiseState = 'fulfilled';
        // 2.修改对象结果值
        self.promiseResult = data;
    }

    // reject函数
    function reject(data) {
        // 判断状态--状态只能修改一次
        if(self.promiseState !== 'pendding') return;
        // 1.修改对象的状态
        self.promiseState = 'rejected';
        // 2.修改对象结果值
        self.promiseResult = data;
    }

    try {
        // 同步调用【执行器函数】
        executor(resolve, reject);
    } catch (error) {
        // 修改promise状态为失败
        reject(error);
    }

    
}

Promise.prototype.then = function(onResolve, onReject) {
    
};