
class Promise {
    // 添加属性
    promiseState = 'pendding';
    promiseResult = null;
    // 保存then方法的回调
    callbacks = [];

    constructor(executor) {
        try {
            // 同步调用【执行器函数】
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            // 修改promise状态为失败
            this.reject(error);
        }
    }

    // resolve函数
    resolve(data) {
        // 判断状态--状态只能修改一次
        if(this.promiseState !== 'pendding') return;
        // 1.修改对象的状态
        this.promiseState = 'fulfilled';
        // 2.修改对象结果值
        this.promiseResult = data;
        setTimeout(() => {
            // 调用成功的回调函数
            this.callbacks.forEach(item => {
                if(item.onResolve) item.onResolve(data);
            });
        });
    }

    // reject函数
    reject(data) {
        // 判断状态--状态只能修改一次
        if(this.promiseState !== 'pendding') return;
        // 1.修改对象的状态
        this.promiseState = 'rejected';
        // 2.修改对象结果值
        this.promiseResult = data;

        setTimeout(() => {
            // 调用失败的回调函数
            this.callbacks.forEach(item => {
                if(item.onReject) item.onReject(data);
            });
        });
    }
    // then方法使用，代码复用
    handleCallback(resolve, reject) {
        return (thenCallback) => {
            try {
                let res = thenCallback(this.promiseResult);
                if (res instanceof Promise) {
                    res.then(value => {
                        resolve(value);
                    }, err => {
                        reject(err);
                    });
                } else resolve(res);
            } catch (error) {
                reject(error);
            }
        };
    }


    then(onResolve, onReject) {

        if (typeof onResolve !== 'function') {
            onResolve = value => value;
        }
        if (typeof onReject !== 'function') {
            onResolve = err => { throw err };
        }
        return new Promise((resolve, reject) => {
            // callback、resolve、reject的this已经绑定好了
            // callback的this是调用then方法的this对象
            // resolve和reject的this是新的promise对象（即then方法的返回值）
            let callback = this.handleCallback(resolve, reject);

            // 判断promiseState 调用回调函数 
            if(this.promiseState === 'fulfilled') {
                setTimeout(() => {
                    callback(onResolve);
                });
            }
            if(this.promiseState === 'rejected') {
                setTimeout(() => {
                    callback(onReject);
                });
            }

            // 保存回调函数
            if(this.promiseState === 'pendding') {
                this.callbacks.push({
                    onResolve: function() {
                        callback(onResolve);
                    },
                    onReject: function() {
                        callback(onReject);
                    }
                });
            }

        });
    }

    catch(onReject) {
        return this.then(undefined, onReject);
    }

    static resolve(value) {
        return new Promise(function(resolve, reject) {
            if(value instanceof Promise) {
                value.then(res => resolve(res), err => reject(err));
            } else resolve(value);
        });
    }
    // reject方法--返回结果永远是一个失败的promise
    static reject(value) {
        return new Promise(function(resolve, reject) {
            reject(value);
        });
    }

    static all(promiseArr) {
        return new Promise(function(resolve, reject) {
            let count = 0, arr = [];
            promiseArr.forEach((item, index) => {
                item.then(res => {
                    count++;
                    arr[index] = res;
                    if(count === promiseArr.length) {
                        resolve(arr);
                    }
                }, err => {
                    reject(err);
                });
            });
        })
    }

    static race(promiseArr) {
        return new Promise(function(resolve, reject) {
            promiseArr.forEach(item => {
                item.then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                });
            });
        });
    }
}