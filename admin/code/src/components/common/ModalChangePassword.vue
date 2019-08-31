<template>
    <div class="ModalChangePassword">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
            <FormItem label="旧密码: " prop="oldPassword">
                <Input type="text" v-model="formValidate.oldPassword" placeholder="请输入旧密码" @on-focus="changePassword" style="width: 300px;"></Input>
            </FormItem>
            <FormItem label="新密码: " prop="newPassword">
                <Input type="text" v-model="formValidate.newPassword" placeholder="请输入新密码" @on-focus="changePassword"></Input>
            </FormItem>
            <FormItem label="重复新密码: " prop="confirmPassword">
                <Input type="text" v-model="formValidate.confirmPassword" placeholder="请输入新密码" @on-focus="changePassword"></Input>
            </FormItem>
        </Form>
    </div>
</template>
<script>
export default {
    data() {
        const validatePassword = (rule, value, callback) => {
           if (value === '') {
                callback(new Error('请将密码填入'));
            } else {
                let reg = /^\w{6,18}$/;
                if(!reg.test(value)) {
                    callback(new Error('6~18位字母数字下划线'))
                }
                callback();
            }
        }
        const validateConfirmPassword = (rule, value, callback) => {
           if (value === '') {
                callback(new Error('请确认新密码'));
            } else {
                let reg = /^\w{6,18}$/;
                if(!reg.test(value)) {
                    callback(new Error('6~18位字母数字下划线'))
                }
                if(value != this.formValidate.newPassword) {
                    callback(new Error('请确保两次输入的新密码一致'))
                }
                callback();
            }
        }
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo")); //用户信息
        return {
            userInfo : userInfo,

            type: 'text',

            oldPassword: '',        // 旧密码
            newPassword: '',        // 新密码
            confirmPassword: '',    // 确认新密码

            formValidate: {
                oldPassword: '',        // 旧密码
                newPassword: '',        // 新密码
                confirmPassword: '',    // 确认新密码
            },
            ruleValidate: {
                oldPassword: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                newPassword: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                confirmPassword: [
                    { validator: validateConfirmPassword, trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        setPassword() {
            let reg = /^\w{6,18}$/;
            if(!reg.test(this.formValidate.oldPassword)) {
                common.toastMsg("旧密码格式错误!");
            }
            if(!reg.test(this.formValidate.newPassword)) {
                common.toastMsg("新密码格式错误!");
            }
            if(!reg.test(this.formValidate.oldPassword)) {
                common.toastMsg("确认密码格式错误!");
            }
            if(this.formValidate.newPassword != this.formValidate.confirmPassword) {
                common.toastMsg("请保持新密码一致!");
            }
            let url = constGlobal.HostAlumni + 'sys/setPassword';
            let paramOptions = {
                byUserId: this.userInfo.userId,
                oldPassword: this.formValidate.oldPassword,
                newPassword: this.formValidate.newPassword
            }
            http.apiPost(url, paramOptions).then(res => {
                if(res.status == 0){
                    // this.formValidate.oldPassword = '';
                    // this.formValidate.newPassword = '';
                    // this.formValidate.confirmPassword = '';
                    common.toastMsg("密码更改成功");
                    sessionStorage.removeItem("userInfo");
                    sessionStorage.removeItem("userButtonPower");
                    sessionStorage.removeItem("userMenus");
                }else {
                    common.toastMsg("密码更改失败,请重试");
                }
            })
            .catch(response => {
                common.toastMsg("连接超时，请刷新重试");
            });
        },
        changePassword(event){
            event.target.type = "password";
        }
    }
}
</script>
<style lang="scss" scoped>
.ModalChangePassword {
    background-color: #ffffff;
    display: flex;
    display: -moz-flex;
    display: -webkit-flex;
    justify-content: center;
    -moz-justify-content: center;
    -webkit-justify-content: center;
}
</style>
