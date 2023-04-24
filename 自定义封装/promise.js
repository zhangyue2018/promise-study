
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
    let self = this;
    // 值穿透
    if(typeof onResolve !== 'function') {
        onResolve = value => value;
    }
    // 异常穿透
    if(typeof onReject !== 'function') {
        onReject = function(err) {
            throw err;
        }
    }
    return new Promise((resolve, reject) => {

        function callback(funParam) {
            try {
                let res = funParam(self.promiseResult);
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
        // 判断promiseState 调用回调函数 
        if(this.promiseState === 'fulfilled') {
            callback(onResolve);
        }
        if(this.promiseState === 'rejected') {
            callback(onReject);
        }

        // 保存回调函数
        if(this.promiseState === 'pendding') {
            this.callcack.push({
                onResolve: function(value) {
                    callback(onResolve);
                },
                onReject: function(err) {
                    callback(onReject);
                }
            });
        }
    });
};

// catch方法
Promise.prototype.catch = function(onReject) {
    return this.then(undefined, onReject);
}

// resolve方法
Promise.resolve = function(value) {

    return new Promise(function(resolve, reject) {
        if(value instanceof Promise) {
            value.then(res => {
                resolve(res);
            }, err => {
                reject(err);
            });
        } else {
            resolve(value);
        }
    });
}

// reject方法--返回结果永远是一个失败的promise
Promise.reject = function(value) {
    return new Promise(function(resolve, reject) {
        reject(value);
    });
}