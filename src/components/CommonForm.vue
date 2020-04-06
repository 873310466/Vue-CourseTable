<template>
  <el-form :inline="inline"
           :model="form"
           ref="form"
           label-width="120px"
           :label-position="labelPosition"
           status-icon :rules="formRules">
    <el-form-item v-for="item in formLabel"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label">

      <!--输入框-->
      <el-input clearable v-if="!item.type||item.prop==='id'"
                :style="{width:item.isCusWidth?item.cusWidth:null}"
                v-model="form[item.prop]"
                :placeholder="item.placeholder!==undefined?item.placeholder:'请输入'+item.label"
                :prefix-icon="item.icon"
                :disabled="item.prop==='username'?isReadOnly:false"
                :type="item.inputType"
                :show-password="item.inputType==='password'"
                autocomplete="off"/>
      <!--多行文本输入框-->
      <el-input
        v-if="item.type==='textarea'"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 7}"
        :placeholder="item.placeholder!==undefined?item.placeholder:'请输入'+item.label"
        maxlength="200"
        show-word-limit
        v-model="form[item.prop]"
      >
      </el-input>
      <!--下拉框-->
      <el-select
                 :style="{width:item.isCusWidth?item.cusWidth:'100%'}"
                 v-if="item.type==='select'"
                 v-model="form[item.prop]"
                 placeholder="请选择">
        <el-option v-for="sItem in item.opts"
                   :key="sItem.value"
                   :label="sItem.label"
                   :value="sItem.value"/>
      </el-select>
      <!--Switch-->
      <el-switch v-if="item.type==='switch'"
                 active-text="已激活"
                 inactive-text="未激活"
                 active-color="#13ce66"
                 inactive-color="#ff4949"
                 v-model="form[item.prop]"/>
      <!--日期-->
      <el-date-picker
        style="width: 100%"
        v-model="form[item.prop]"
        align="right"
        type="date"
        placeholder="选择日期"
        v-if="item.type==='date'"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions">
      </el-date-picker>
      <!--隐藏输入框，传输数据-->
      <el-input v-if="item.type==='hidden'"
                v-model="form[item.prop]"
                type="hidden"
      />
      <!--级联选择器-->
      <!--options 用来指定数据源-->
      <!--props 用来指定配置对象-->
      <!--change-on-select 允许选中任意节点-->
      <!--filterable 开启搜索功能-->
      <el-cascader
        ref="cascader"
        v-if="item.type==='cascader'"
        v-model="form[item.prop]"
        :options="item.opts"
        :props="{
          expandTrigger: 'hover',
          value:'id',
          label:'name',
          children:'children',
          checkStrictly : true
       }"
        filterable
        placeholder="不选则默认为 1 级节点，亲亲点击这里可以搜索喔~"
        clearable
        separator=" -> "
        @change="parentCateChanged"/>
    </el-form-item>

    <!--插槽，放按钮啥的-->
    <el-form-item>
      <slot/>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'CommonForm',
  props: {
    inline: Boolean,
    labelPosition: String,
    form: Object,
    formLabel: Array,
    formRules: Object,
    isReadOnly: Boolean
  },
  data () {
    return {
      /* 日期快截选择 */
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      parent_id: this.form.parent_id

    }
  },
  methods: {
    parentCateChanged () {
      this.$emit('parentCateChanged')
    }
  }

}
</script>

<style lang="scss" scoped>
  .el-cascader {
    width: 100%;
  }

</style>
