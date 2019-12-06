<template>
  <a-modal
    :footer="null"
    title="修改手机号"
    :width="640"
    :visible="visible"
    :confirmLoading="showLoading"
    @cancel="hide"
  >
    <a-spin :spinning="showLoading">
      <a-form :form="form" class="af" >
        <!-- 旧手机号 -->
        <a-form-item label="原手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span v-decorator="['oldphone']">{{ phoenNumber }}</span>
          <br />
          <a-button
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            class="getCaptcha1"
            :disabled="state1.smsSendBtn"
            @click.stop.prevent="getCaptcha1"
            v-text="!state1.smsSendBtn && '获取验证码'||(state1.time+' s')"></a-button>
        </a-form-item>
        <!-- 验证码 -->
        <a-form-item label="验证码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['oldcode',{rules: [{ required: true,len:6, message: '请输入验证码' }], validateTrigger: 'blur'} ]" placeholder="请输入验证码"></a-input>
        </a-form-item>
        <!-- 新手机号 -->
        <a-form-item label="新手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['newphone', {rules: rules.newphone}]" placeholder="请输入手机号"></a-input>
          <a-button
            class="getCaptcha2"
            :disabled="state2.smsSendBtn"
            @click.stop.prevent="getCaptcha2"
            v-text="!state2.smsSendBtn && '获取验证码'||(state2.time+' s')"></a-button>
        </a-form-item>
        <!-- 验证码 -->
        <a-form-item label="验证码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['newcode',{rules: [{ required: true,len:6, message: '请输入验证码' }], validateTrigger: 'blur'}]" placeholder="请输入验证码"></a-input>
        </a-form-item>
        <!-- 提交 -->
        <a-form-item class="btn" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-button class="btn2" @click.stop.prevent="handleSubmit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import TagApi from '@/api/tag'

export default {
  props: {
    tophone: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
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
      rules: {
        newphone: [{ required: true, len: 11, message: '请输入正确的手机号' }, { validateTrigger: ['change', 'blur'] }]
      },
      state1: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      state2: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      phoenNumber: '',
      visible: false,
      showLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (params) {
      this.visible = true
      // 编辑赋值
      this.phoenNumber = this.tophone
    },
    hide () {
      this.visible = false
      this.form.resetFields()
    },
    // 验证码
    getCaptcha1 (e) {
      e.preventDefault()
      const { form: { validateFields }, state1 } = this

      validateFields(['oldphone'], { force: true },
        (err, values) => {
          if (!err) {
            state1.smsSendBtn = true

            const interval1 = window.setInterval(() => {
              if (state1.time-- <= 0) {
                state1.time = 60
                state1.smsSendBtn = false
                window.clearInterval(interval1)
              }
            }, 1000)
          }
        }
      )
    },
    getCaptcha2 (e) {
      e.preventDefault()
      const { form: { validateFields }, state2 } = this

      validateFields(['newphone'], { force: true },
        (err, values) => {
          if (!err) {
            state2.smsSendBtn = true

            const interval2 = window.setInterval(() => {
              if (state2.time-- <= 0) {
                state2.time = 60
                state2.smsSendBtn = false
                window.clearInterval(interval2)
              }
            }, 1000)
          }
        }
      )
    },
    // 提交
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      this.showLoading = true
      const validateFieldsKey = ['newphone', 'oldcode', 'newcode']
      validateFields(validateFieldsKey, (errors, values) => {
        if (!errors) {
          this.handleSuccess()
        }
        this.showLoading = false
      })
    },
    handleSuccess () {
      this.visible = false
      this.form.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 10px;
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
.btn2 {
  width: 240px;
  height: 40px;
  background: rgba(0, 140, 251, 1);
  border-radius: 4px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}

.getCaptcha1 {
      width: 94px;
      height: 32px;
      display: block;
      background: rgba(247, 247, 247, 1);
      border: 1px solid rgba(205, 205, 205, 1);
      border-radius: 4px;
    }
.getCaptcha2 {
      width: 94px;
      height: 32px;
      display: block;
      background: rgba(247, 247, 247, 1);
      border: 1px solid rgba(205, 205, 205, 1);
      border-radius: 4px;
    }
</style>
