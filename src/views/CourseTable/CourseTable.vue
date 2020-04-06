<template>
  <el-card shadow="hover" :style="cardBackground">

    <div class="drop">
      <!--Help-->
      <el-dropdown class="helper" @command="handleCommand">
        <el-button circle type="success" icon="el-icon-s-opportunity">
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="about">关于本站</el-dropdown-item>
          <el-dropdown-item command="suggestion">友情建议</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--选择周数-->
      <span class="select-week">
      <common-form inline :form-label="formLabel" :form="formData">
        <!--回到本周的按钮-->
          <el-button-group>
            <el-tooltip effect="light" content="显示上周课程" placement="top" :enterable="false">
              <el-button  :disabled="formData.week===1" @click="lastWeekCourses" type="primary" icon="el-icon-arrow-left" ></el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="显示本周课程" placement="top" :enterable="false">
                          <el-button :disabled="formData.week===curWeek" class="btn-curweek" type='primary' round
                                     icon="el-icon-location-information" @click="rebackCurWeek"></el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="显示下周课程" placement="top" :enterable="false">
            <el-button :disabled="formData.week===17" @click="nextWeekCourses" type="primary" icon="el-icon-arrow-right" ></el-button>
            </el-tooltip>
          </el-button-group>

      </common-form>
    </span>

    </div>

    <!--表格区域-->
    <el-table
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      :data="tableData"
      :span-method="objectSpanMethod"
      v-loading="tableConfig.isLoading"
      border>
      <el-table-column
        type="index"
        align="center"
        label="节次\星期"
        width="95px"
      >
        <template slot-scope="scope">
          <div class="first-col">
            <div class="first-col-normal">
              {{customIndex(scope.$index,'normal')}}
            </div>
            <div class="first-col-time">
              {{customIndex(scope.$index,'time')}}
            </div>
          </div>

        </template>
      </el-table-column>
      <el-table-column
        align="center"
        v-for="item in tableLabel"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      >
        <template slot-scope="scope">
          <div class="course">
            <div v-if="scope.row[item.prop].name!==undefined" slot="reference">
              <el-tag size="medium">{{scope.row[item.prop].name}}</el-tag>
            </div>
            <div class="course-teacher">
              {{scope.row[item.prop].teacher}}
            </div>
            <div class="course-location">
              {{scope.row[item.prop].location}}
            </div>
          </div>
        </template>
      </el-table-column>

    </el-table>

    <!--加星星区域-->
    <div class="stars">
      <el-tooltip class="item" effect="light" content="加颗星星吧OwO~" placement="top-start">
        <el-button @click="addStar" type="warning" icon="el-icon-star-on" circle/>
      </el-tooltip>
      <div class="starSum">{{starSum}}</div>
    </div>
    <!--About-->
    <el-drawer
      title="关于本站"
      :visible.sync="drawerVisible"
      direction="ltr"
    >
      <ul class="about">
        <li>作者：柠檬鱼</li>
        <li>现状：东北大学-软件学院-在读-大二学生</li>
        <li>联系方式：873310466@qq.com</li>
        <li><span style="margin-right: 5px">Github :</span>
          <el-link type="primary" href="https://github.com/873310466/CoureseTable">
            https://github.com/873310466/CoureseTable
          </el-link>
        </li>
        <li><span style="margin-right: 5px">Gitee :</span>
          <el-link type="primary" href="https://github.com/873310466/CoureseTable">
            https://github.com/873310466/CoureseTable
          </el-link>
        </li>
      </ul>
    </el-drawer>
    <!--友情建议对话框-->
    <el-dialog
      title="友情建议"
      :visible.sync="leaveMessageDialogVisible"
      ref="leaveMessageDialog"
      :before-close="beforeCloseLMDialog"
      width="50%"
    >
      <!--友情建议表单-->
      <common-form :form-label="LMFormLabel" :form="LMFormData" :form-rules="LMFormRules"
                   :label-position="'top'"></common-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="leaveMessageDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sendSuggestion">发 送</el-button>
  </span>
    </el-dialog>
  </el-card>

</template>

<script>
import CommonForm from '@/components/CommonForm'

export default {
  name: 'CourseTable',
  components: { CommonForm },
  data () {
    return {
      // 星星点击总数
      starSum: 0,
      // “关于界面弹出显示与隐藏”
      drawerVisible: false,
      // 本周
      curWeek: '',
      // 今天星期几
      curDay: '',
      // 背景图片
      cardBackground: {
        background: 'url(' + require('../../assets/beauty.jpg') + ') no-repeat',
        backgroundSize: 'cover'
      },
      // 友情建议对话框
      leaveMessageDialogVisible: false,
      // 友情建议表单及标签
      LMFormLabel: [
        {
          label: '联系方式',
          prop: 'linkman',
          placeholder: '(可选) 仅用于反馈交流 OwO~'
        },
        {
          label: '友情建议',
          prop: 'content',
          type: 'textarea',
          placeholder: '欢迎交流、欢迎交流~~O(∩_∩)O'

        }
      ],
      LMFormData: {
        linkman: '',
        content: ''
      },
      LMFormRules: {
        content: [
          {
            required: true,
            message: '请输入一些文字叭~',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 200,
            message: '长度在 3 到 200 个字符',
            trigger: 'blur'
          }
        ]
      },
      formLabel: [
        {
          label: '选择教学周',
          type: 'select',
          prop: 'week',
          isCusWidth: true,
          cusWidth: '90%',
          opts: [
            {
              label: '第 1 周',
              value: 1
            },
            {
              label: '第 2 周',
              value: 2
            }
          ]
        }
      ],
      formData: {
        // 选中的周数
        week: ''
      },
      tableLabel: [
        {
          prop: '7',
          label: '星期日'
        },
        {
          prop: '1',
          label: '星期一'
        },
        {
          prop: '2',
          label: '星期二'
        },
        {
          prop: '3',
          label: '星期三'
        },
        {
          prop: '4',
          label: '星期四'
        },
        {
          prop: '5',
          label: '星期五'
        },
        {
          prop: '6',
          label: '星期六'
        }

      ],
      tableData: [],
      tableConfig: {
        isLoading: true
      }
    }
  },

  methods: {
    // 加星星
    async addStar () {
      const { data: res } = await this.$http().put('/stars/')
      if (res.code !== 200) return this.$message.info('加星星失败呜呜呜/(ㄒoㄒ)/~~')
      this.starSum = res.data
    },
    // 获取星星
    async getStar () {
      const { data: res } = await this.$http().get('/stars/')
      if (res.code !== 200) return this.$message.info('获取星星数量失败呜呜呜/(ㄒoㄒ)/~~')
      this.starSum = res.data
    },
    // 帮助下拉菜单的点击事件
    handleCommand (command) {
      switch (command) {
        // About页面
        case 'about':
          this.drawerVisible = true
          break
          // 友情建议
        case 'suggestion':
          this.leaveMessageDialogVisible = true
          this.$nextTick(() => {
            const form = this.$refs.leaveMessageDialog.$children[2].$refs.form
            form.resetFields()
          })
          break
      }
    },
    // 发送建议
    sendSuggestion () {
      const form = this.$refs.leaveMessageDialog.$children[2].$refs.form
      form.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http().post('/mail/', this.LMFormData)
          if (res.code !== 200) return this.$message.error('发送失败，请尝试555QAQ')
          this.$message.success('发送成功！欢迎交流 OwO~')
          this.leaveMessageDialogVisible = false
        }
      })
    },
    // 发送建议对话框BeforeClose
    beforeCloseLMDialog (done) {
      this.$confirm('亲亲确认关闭对话框吗 OvO？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    // 获取课程表数据
    async getCourseTable () {
      if (this.formData.week !== '') {
        // 访问接口，获取选中周数的所有课程数据
        const { data: res } = await this.$http().get(`/course/table/${this.formData.week}`)
        if (res.code !== 200) return this.$message.error('获取数据失败')
        // 开启加载效果
        this.tableConfig.isLoading = true

        // 手动延迟0.5S，提升用户体验
        setTimeout(() => {
          // 得到的数据是二维的，X是星期，Y是开始的节次
          // 循环得到开始节次，再循环星期
          res.data.forEach(item => {
            // 生成每一行的模板（周日开始——周六结束）
            const coursePerRow = {
              7: '',
              1: '',
              2: '',
              3: '',
              4: '',
              5: '',
              6: ''
            }
            item.forEach(subItem => {
              // 根据星期几，来排版每节次的课程表
              switch (subItem.day) {
                case 1:
                  coursePerRow['1'] = subItem
                  break
                case 2:
                  coursePerRow['2'] = subItem
                  break
                case 3:
                  coursePerRow['3'] = subItem
                  break
                case 4:
                  coursePerRow['4'] = subItem
                  break
                case 5:
                  coursePerRow['5'] = subItem
                  break
                case 6:
                  coursePerRow['6'] = subItem
                  break
                case 7:
                  coursePerRow['7'] = subItem
                  break
              }
            })
            // 添加数据
            this.tableData.push(coursePerRow)
          })
          // 关闭加载效果
          this.tableConfig.isLoading = false
        }, 500)
      }
    },
    // 根据一节课多少节次，决定table-cell占多少行
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 0) {
        if (rowIndex % 2 === 0) {
          const rowSpan = row[column.property].rowSpan > 0 ? row[column.property].rowSpan : 1
          return {
            rowspan: rowSpan,
            colspan: 1
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    },
    // 获取所有教学周
    async getAllWeeks () {
      const { data: res } = await this.$http().get('/week/all')
      if (res.code !== 200) return this.$message.error('获取教学周失败')
      res.data = res.data.map(item => {
        item = {
          label: `第 ${item.cweek} 周`,
          value: item.cweek
        }
        return item
      })

      this.formLabel[0].opts = res.data
    },
    // 显示上周课程
    lastWeekCourses () {
      this.formData.week -= 1
    },
    // 显示下周课程
    nextWeekCourses () {
      this.formData.week += 1
    },
    // 自定义索引列--`第几节`
    customIndex (index, type) {
      const cusIndex = index + 1
      if (type === 'normal') {
        switch (cusIndex) {
          case 1 :
            return '第 一 节'
          case 2 :
            return '第 二 节'
          case 3 :
            return '第 三 节'
          case 4 :
            return '第 四 节'
          case 5 :
            return '第 五 节'
          case 6 :
            return '第 六 节'
          case 7 :
            return '第 七 节'
          case 8 :
            return '第 八 节'
          case 9 :
            return '第 九 节'
          case 10 :
            return '第 十 节'
          case 11 :
            return '第 十一 节'
          case 12 :
            return '第 十二 节'
        }
      } else {
        switch (cusIndex) {
          case 1 :
            return '08 : 30'
          case 2 :
            return '09 : 30'
          case 3 :
            return '10 : 40'
          case 4 :
            return '11 : 40'
          case 5 :
            return '14 : 00'
          case 6 :
            return '15 : 00'
          case 7 :
            return '16 : 10'
          case 8 :
            return '17 : 10'
          case 9 :
            return '18 : 30'
          case 10 :
            return '19 : 30'
          case 11 :
            return '20 : 40'
          case 12 :
            return '21 : 40'
        }
      }
    },
    headerCellStyle ({ row, column, columnIndex, rowIndex }) {
      if (rowIndex === 0 && columnIndex === this.curDay + 1) {
        return {
          backgroundColor: '#3172b2',
          color: '#eee'
        }
      } else {
        return { background: '#eef1f6' }
      }
    },
    // table-cell样式
    cellStyle ({ row, column, columnIndex, rowIndex }) {
      if (columnIndex !== 0) {
        return row[column.property].rowSpan > 0
          ? { backgroundColor: '#E0FFFF' } : {}
      } else {
        if (rowIndex < 4) {
          return {
            backgroundColor: '#c4e1c5',
            cursor: 'default'
          }
        } else if (rowIndex < 8) {
          return {
            backgroundColor: 'skyblue',
            cursor: 'default'
          }
        } else {
          return {
            backgroundColor: '#FFB6C1',
            cursor: 'default'
          }
        }
      }
    },
    // 计算选中周数和当前周数
    countSelectedWeek () {
      var curDateObject = new Date('2020-02-23')
      const oneDayTime = 86400000
      const toNowDays = (new Date() - curDateObject) / oneDayTime
      this.curWeek = Math.floor(toNowDays / 7) + 1
      this.formData.week = this.curWeek
    },
    // 回到本周
    rebackCurWeek () {
      this.formData.week = this.curWeek
      this.$message.success(`本周是第 ${this.curWeek} 周喔~~`)
    }
  },
  watch: {
    // 监控选中周数改变
    'formData.week': {
      handler (newValue) {
        this.formData.week = newValue
        // 清空table数据
        this.tableData = []
        this.getCourseTable()
      },
      immediate: true
    }
  },
  created () {
    this.getAllWeeks()
    this.countSelectedWeek()
    this.getStar()
    this.curDay = new Date().getDay()
  }
}
</script>

<style lang="scss" scoped>
  .stars {
    display: flex;
    justify-content: center;
    margin-top: 12px;

    .starSum {
      display: flex;
      align-items: center;
      margin-left: 10px;
      font-size: 19px;
      color: white;
    }
  }

  .el-table--enable-row-hover .el-table__body tr:hover {
    background: rgba(0, 0, 0, 1);
    border: 1px solid #313463;
    box-shadow: 0 0 1px 1px #313463, inset 0 0 10px 5px rgba(49, 52, 99, 0.20);
  }

  .el-table {
    width: 90%;
    margin: 0px 63px;
    opacity: 0.5;
    transition: 0.666s ease-in-out;

  }

  .el-card {
    margin: 30px;
    height: 780px;
  }

  .el-table:hover {
    opacity: 1;
  }

  .select-week {
    /deep/ .el-form-item__label {
      color: white;

    }
  }

  .drop {
    justify-content: center;
    display: flex;
  }

  .course {
    .el-tag {
      display: flex;
      justify-content: center;
      color: #3b96f5;
      font-weight: bold;
      font-size: 15px;
    }

    .course-teacher {
      color: #049b64;
      font-size: 15px;
    }

    .course-location {
      font-size: 14px;
    }
  }

  .btn-curweek {
    margin-left: -40px;
  }

  .first-col:hover {

    .first-col-time {
      opacity: 1;

    }

    .first-col-normal {
      opacity: 0;

    }

  }

  .first-col-normal {
    transition: 0.5s ease-in-out;
    display: block;
  }

  .first-col-time {
    opacity: 0;
    transition: 0.5s ease-in-out;
    position: absolute;
    font-size: 14px;
    font-weight: bold;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }

  .helper {
    position: absolute;
    left: 50px;
    top: 50px;
  }

  .about li {
    margin: 10px 0;
  }

</style>
