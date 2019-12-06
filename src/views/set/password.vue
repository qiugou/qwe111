<template>
  <a-modal
    :footer="null"
    title="修改登录密码"
    :width="640"
    :visible="visible"
    :confirmLoading="showLoading"
    @cancel="hide"
    wrapClassName="web"
  >
    <a-spin :spinning="showLoading">
      <a-form :form="form" class="af" >
        <a-form-item label="原登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            type="password"
            v-decorator="['password', {rules:[{ required: true, message: '密码不能为空' }, { max: 30, message: '最大长度不超过30字节' }]}]"
            placeholder="原登录密码"></a-input>
        </a-form-item>
        <a-form-item label="新登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            type="password"
            autocomplete="false"
            placeholder="请输入密码"
            v-decorator="['newPassWord', {rules: [ { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
        <a-form-item label="确认登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            type="password"
            autocomplete="false"
            placeholder="确认密码"
            v-decorator="['newPassWord2', {rules: [{ validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
        <a-form-item class="btn">
          <a-button class="sbtn" @click.stop.prevent="handleSubmit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import SetApi from '@/api/set'

export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      state: {
        passwordLevel: 0,
        percent: 10
      },
      visible: false,
      showLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // 显示
    show (params) {
      this.visible = true
    },
    // 隐藏
    hide () {
      this.visible = false
      this.form.resetFields()
    },
    // 密码
    handlePasswordLevel (rule, value, callback) {
      let level = 0
      if (value) {
      // 判断这个字符串中有没有数字
        if (/[0-9]/.test(value)) {
          level++
        }
        // 判断字符串中有没有字母
        if (/[a-zA-Z]/.test(value)) {
          level++
        }
        // 判断字符串中有没有特殊符号
        if (/[^0-9a-zA-Z_]/.test(value)) {
          level++
        }
        this.state.passwordLevel = level
        this.state.percent = level * 30
        if (level >= 2) {
          if (level >= 3) {
            this.state.percent = 100
          }
          callback()
        } else {
          if (level === 0) {
            this.state.percent = 10
          }
          callback(new Error('密码强度不够'))
        }
      } else {
        callback(new Error('密码不能为空'))
      }
    },
    // 确认密码
    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('newPassword')
      console.log(password)
      console.log('value', value)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    // 保存
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      this.showLoading = true
      const validateFieldsKey = ['password', 'newPassWord']
      validateFields(validateFieldsKey, (errors, values) => {
        if (!errors) {
          console.log(values)
          SetApi.reset()
          this.$emit('parentMethod')
          this.handleSuccess()
        }
        this.showLoading = false
      })
    },
    handleSuccess () {
      this.visible = false
      // this.$emit('ok')
      this.form.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.web {
  .ant-modal-header {
  background: red;
  border-radius: 8px 8px 0px 0px;
  padding: 16px 269px;

}
.ant-modal-title {
  color: red;
   margin-left: 248px
}
}

.af {
  position: relative;
  padding-bottom: 100px;
}
.btn {
  position: absolute;
  bottom: 1%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.sbtn {
  width: 240px;
  height: 40px;
  background: rgba(0, 140, 251, 1);
  border-radius: 4px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
</style>
