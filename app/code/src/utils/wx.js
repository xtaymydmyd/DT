getPhoneNumber(e){
    console.log("eeee")
    console.log(e)
    console.log(e.mp.detail.errMsg) 
    console.log(e.mp.detail.iv) 
    console.log(e.mp.detail.encryptedData) 
},
wxGetUserInfo (code) {
    console.log("code" + code);
    const self = this;
    wx.getUserInfo({
        withCredentials: true,
        success (res) {
            console.log("success");
            console.log(res)
            
        },
        fail (err) {
            console.log('自动wx.getUserInfo失败:',err);
            // 显示主动授权的button
        }
    })
},
bindGetUserInfo(e) {
    // console.log('回调事件后触发')
    const self = this;
    if (e.mp.detail.userInfo){
        console.log('用户按了允许授权按钮')
        let { encryptedData,userInfo,iv } = e.mp.detail;
        self.$http.post(api,{
            // 这里的code就是通过wx.login()获取的
            code:self.code,
            encryptedData,
            iv,
        }).then(res => {
            console.log(`后台交互拿回数据:`,res);
            // 获取到后台重写的session数据，可以通过vuex做本地保存
        }).catch(err => {
            console.log(`api请求出错:`,err);
        })  
    } else {
        //用户按了拒绝按钮
        console.log('用户按了拒绝按钮');
    }
},