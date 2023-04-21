
function Promise(executor) {
    // 添加属性
    this.promiseState = 'pendding';
    this.promiseResult = null;
    // 保存then方法的回调函数
    this.callcack = [];

    let self = this;


    // resolve函数
    function resolve(data) {
        // 判断状态--状态只能修改一次
        if(self.promiseState !== 'pendding') return;
        // 1.修改对象的状态
        self.promiseState = 'fulfilled';
        // 2.修改对象结果值
        self.promiseResult = data;

        // 调用成功的回调函数
        self.callcack.forEach(item => {
            if(item.onResolve) item.onResolve(data);
        });
    }

    // reject函数
    function reject(data) {
        // 判断状态--状态只能修改一次
        if(self.promiseState !== 'pendding') return;
        // 1.修改对象的状态
        self.promiseState = 'rejected';
        // 2.修改对象结果值
        self.promiseResult = data;

        // 调用失败的回调函数
        self.callcack.forEach(item => {
            if(item.onReject) item.onReject(data);
        });
    }

    try {
        // 同步调用【执行器函数】
        executor(resolve, reject);
    } catch (error) {
        // 修改promise状态为失败
        reject(error);
    }

    
}
// then方法返回一个promise对象
Promise.prototype.then = function(onResolve, onReject) {
    return new Promise((resolve, reject) => {
        // 判断promiseState 调用回调函数 
        if(this.promiseState === 'fulfilled') {
            try {
                let res = onResolve(this.promiseResult);
                if(res instanceof Promise) {
                    res.then(value => {
                        resolve(value);
                    }, err => {
                        reject(err);
                    });
                } else {
                    resolve(res);
                }
            } catch (error) {
                reject(error);
            }
        }
        if(this.promiseState === 'rejected') {
            onReject(this.promiseResult);
        }

        // 保存回调函数
        if(this.promiseState === 'pendding') {
            this.callcack.push({
                onResolve,
                onReject
            });
        }
    });
};