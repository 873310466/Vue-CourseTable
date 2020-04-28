 <template>
  <el-card shadow="hover" :style="cardBackground">

    <el-row>
      <!--左上角-->
      <!--Help-->
      <el-col :span="1">
        <el-dropdown @command="handleCommand">
          <el-button circle type="success" icon="el-icon-s-opportunity">
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="about">关于本站</el-dropdown-item>
            <el-dropdown-item command="suggestion">友情建议</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :xs="{span: 3, offset: 5}" :sm="{span:3,offset:2}"><div class="jiayou">祝大家考试好运哇~(●'◡'●)</div></el-col>
      <el-col :xs="{span: 16, offset: 5}" :lg="{span: 10, offset: 3}" :sm="{span:8,offset:5}">
        <!--选择周数-->
        <span class="select-week">
          <common-form inline :form-label="formLabel" :form="formData">
            <!--回到本周的按钮-->
              <el-button-group>
            <el-tooltip effect="light" content="显示上周课程" placement="top" :enterable="false">
                  <el-button :disabled="formData.week===1" @click="lastWeekCourses" type="primary"
                             icon="el-icon-arrow-left"></el-button>
                </el-tooltip>
                <el-tooltip effect="light" content="显示本周课程" placement="top" :enterable="false">
                              <el-button :disabled="formData.week===curWeek" class="btn-curweek" type='primary' round
                                         icon="el-icon-location-information" @click="rebackCurWeek"></el-button>
                </el-tooltip>
                <el-tooltip effect="light" content="显示下周课程" placement="top" :enterable="false">
                <el-button :disabled="formData.week===17" @click="nextWeekCourses" type="primary"
                           icon="el-icon-arrow-right"></el-button>
                </el-tooltip>
              </el-button-group>
          </common-form>
        </span>
      </el-col>
    </el-row>

    <el-table
      :height="tableConfig.height"
      :header-cell-style="headerCellStyle"
      :cell-class-name="cellStyle"
      :data="tableData"
      :span-method="objectSpanMethod"
      v-loading="tableConfig.isLoading"
      style="border-radius: 20px"
      border>
      <el-table-column
        type="index"
        align="center"
        label="节次\星期"
        width="95px"
        fixed
        :resizable="false"

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
        :resizable="false"
      >
        <template v-slot:header>
          <div class="col-header-normal">
            {{item.label}}
          </div>
          <div>
            {{customColHeader(item.label)}}
          </div>
        </template>
        <template slot-scope="scope">
          <div class="course">
            <div v-if="scope.row[item.prop].name!==undefined">
              <el-tag size="medium" class="course-name">{{scope.row[item.prop].name}}</el-tag>
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
    <!--抽屉页t-->
    <div class="about">
      <el-drawer
        size="30%"
        title="关于本站"
        :visible.sync="drawerVisible"
        direction="ltr"
      >
        <ul class="about-ul">
          <li>简介：本网站是自己上学的一个课程表~</li>
          <li>作者：柠檬鱼</li>
          <li>现状：东北大学-软件学院-大二学生</li>
          <li>联系方式：873310466@qq.com</li>
          <li>源码
            <ul>
              <li><span style="margin-right: 5px">前端 :</span>
                <el-link type="primary" href="https://github.com/873310466/Vue-CourseTable">
                  https://github.com/873310466/Vue-CourseTable
                </el-link>
              </li>
              <li><span style="margin-right: 5px">后端 :</span>
                <el-link type="primary" href="https://github.com/873310466/CoureseTable">
                  https://github.com/873310466/CoureseTable
                </el-link>
              </li>
            </ul>
          </li>
        </ul>
        <img src="" alt="">
        <el-carousel :interval="3000" arrow="always" style="margin: 0 13px;border-radius: 10px">
          <el-carousel-item v-for="item in dataImg" :key="item.src">
            <img style="width: 100%;height: 100%" :src="item.src"/>
          </el-carousel-item>
        </el-carousel>
        <el-divider content-position="center">⭐ <span style="font-weight: bold;font-size: 16px">愿景</span> ⭐</el-divider>
        <h4 style="display: flex;justify-content: center">希望自己早日找到实习，越来越 <span style="color: #00aae2"> 腻害</span>叭
          (●'◡'●)</h4>
      </el-drawer>
    </div>

    <!--友情建议对话框-->
    <el-dialog
      :visible.sync="leaveMessageDialogVisible"
      ref="leaveMessageDialog"
      :before-close="beforeCloseLMDialog"
      width="310px"
    >
      <span style="font-size: 23px" slot="title">
        <i class="el-icon-s-promotion" style="color: #00aae2;margin-right: 5px"></i>Tips
      </span>
      <!--友情建议表单-->
      <common-form :form-label="LMFormLabel" :form="LMFormData" :form-rules="LMFormRules"
                   :label-position="'top'"></common-form>

      <span slot="footer">
        <el-button @click="beforeCloseLMDialog">取 消</el-button>
        <el-button type="primary" @click="sendSuggestion" :loading="btnSendTipsLoading">发 送</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import CommonForm from '@/components/CommonForm'
import * as CLASS_INDEX from '@/assets/js/class_index'
import * as WEEKDAY from '@/assets/js/weekday'
// 开学日期
const BEGIN_DATE = new Date('2020-02-23 00:00:00')
// 一周的时间
const ONE_WEEK_TIME = 7 * 24 * 3600000
// 一天的时间
const ONE_DAY_TIME = 86400000

export default {
  name: 'CourseTable',
  components: { CommonForm },
  data () {
    return {
      // 轮播图
      dataImg: [
        {
          src: 'https://course-table-img.oss-cn-hangzhou.aliyuncs.com/BEAUTY01.jpg'
        },
        {
          src: 'https://course-table-img.oss-cn-hangzhou.aliyuncs.com/BEAUTY02.png'

        },

        {
          src: 'https://course-table-img.oss-cn-hangzhou.aliyuncs.com/BEAUTY03.jpg'

        }
      ],
      // 背景图片
      bgImg:
          ['http://course-table-img.oss-cn-hangzhou.aliyuncs.com/bk1.jpg',
            'http://course-table-img.oss-cn-hangzhou.aliyuncs.com/bk2.jpg',
            'http://course-table-img.oss-cn-hangzhou.aliyuncs.com/bk3.jpg',
            'http://course-table-img.oss-cn-hangzhou.aliyuncs.com/bk4.jpg'],
      // 发送建议的按钮加载效果
      btnSendTipsLoading: false,
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
        background: 'url(http://course-table-img.oss-cn-hangzhou.aliyuncs.com/bk1.jpg) no-repeat'
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
          placeholder: '欢迎交流、欢迎交流~~O(∩_∩)O',
          minRows: 6
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
          label: '教 学 周',
          type: 'select',
          prop: 'week',
          isCusWidth: true,
          cusWidth: '71%',
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
          prop: 'seven',
          label: '星期日'
        },
        {
          prop: 'one',
          label: '星期一'
        },

        {
          prop: 'two',
          label: '星期二'
        },
        {
          prop: 'three',
          label: '星期三'
        },
        {
          prop: 'four',
          label: '星期四'
        },
        {
          prop: 'five',
          label: '星期五'
        },
        {
          prop: 'six',
          label: '星期六'
        }

      ],
      tableData: [],
      tableConfig: {
        isLoading: true,
        height: window.innerHeight - 159
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
          this.btnSendTipsLoading = true
          const { data: res } = await this.$http().post('/mail/', this.LMFormData)
          if (res.code !== 200) return this.$message.error('发送失败，请尝试555QAQ')
          this.$message.success('发送成功！欢迎交流 OwO~')
          this.btnSendTipsLoading = false
          this.leaveMessageDialogVisible = false
        }
      })
    },
    // 发送建议对话框BeforeClose
    beforeCloseLMDialog () {
      this.$confirm('亲亲确认关闭对话框吗 OvO？', '提示', {
        type: 'warning',
        roundButton: true
      })
        .then(_ => {
          this.leaveMessageDialogVisible = false
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
        this.spanArray = []

        // 手动延迟0.5S，提升用户体验
        setTimeout(() => {
          // 得到的数据是二维的，X是星期，Y是开始的节次
          // 循环得到开始节次，再循环星期
          res.data.forEach(item => {
            // 生成每一行的模板（周日开始——周六结束）
            const coursePerRow = {
              one: '',
              two: '',
              three: '',
              four: '',
              five: '',
              six: '',
              seven: ''
            }
            item.forEach(subItem => {
              // 根据星期几，来排版每节次的课程表
              switch (subItem.day) {
                case 1:
                  coursePerRow.one = subItem
                  break
                case 2:
                  coursePerRow.two = subItem
                  break
                case 3:
                  coursePerRow.three = subItem
                  break
                case 4:
                  coursePerRow.four = subItem
                  break
                case 5:
                  coursePerRow.five = subItem
                  break
                case 6:
                  coursePerRow.six = subItem
                  break
                case 7:
                  coursePerRow.seven = subItem
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
        const rowSpan = row[column.property].rowSpan
        if (rowIndex % 2 === 0 && rowSpan !== undefined) {
          return [rowSpan, 1]
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
            return CLASS_INDEX.firstOrder
          case 2 :
            return CLASS_INDEX.secondOrder
          case 3 :
            return CLASS_INDEX.thirdOrder
          case 4 :
            return CLASS_INDEX.fourthOrder
          case 5 :
            return CLASS_INDEX.fifthOrder
          case 6 :
            return CLASS_INDEX.sixthOrder
          case 7 :
            return CLASS_INDEX.seventhOrder
          case 8 :
            return CLASS_INDEX.eigthOrder
          case 9 :
            return CLASS_INDEX.ninthOrder
          case 10 :
            return CLASS_INDEX.tenthOrder
          case 11 :
            return CLASS_INDEX.eleventhOrder
          case 12 :
            return CLASS_INDEX.twelfthOrder
        }
      } else {
        switch (cusIndex) {
          case 1 :
            return CLASS_INDEX.firstOrderTime
          case 2 :
            return CLASS_INDEX.secondOrderTime
          case 3 :
            return CLASS_INDEX.thirdOrderTime
          case 4 :
            return CLASS_INDEX.fourthOrderTime
          case 5 :
            return CLASS_INDEX.fifthOrderTime
          case 6 :
            return CLASS_INDEX.sixthOrderTime
          case 7 :
            return CLASS_INDEX.seventhOrderTime
          case 8 :
            return CLASS_INDEX.eigthOrderTime
          case 9 :
            return CLASS_INDEX.ninthOrderTime
          case 10 :
            return CLASS_INDEX.tenthOrderTime
          case 11 :
            return CLASS_INDEX.eleventhOrderTime
          case 12 :
            return CLASS_INDEX.twelfthOrderTime
        }
      }
    },
    // 自定义表头（显示当前日期）
    customColHeader (weekday) {
      const curWeek = this.formData.week
      let offset = 0
      switch (weekday) {
        case WEEKDAY.Sunday:
          offset = 0
          break
        case WEEKDAY.Monday:
          offset = 1
          break
        case WEEKDAY.Tuesday:
          offset = 2
          break
        case WEEKDAY.Wendesday:
          offset = 3
          break
        case WEEKDAY.Thursday:
          offset = 4
          break

        case WEEKDAY.Friday:
          offset = 5
          break
        case WEEKDAY.Saturday:
          offset = 6
          break
      }
      const curDate = new Date(BEGIN_DATE.getTime() + (curWeek - 1) * ONE_WEEK_TIME + offset * ONE_DAY_TIME)

      return (curDate.getMonth() + 1) + '-' + (curDate.getDate())
    },
    // header-cell
    headerCellStyle ({ row, column, columnIndex, rowIndex }) {
      if (rowIndex === 0 && columnIndex === this.curDay + 1 && this.formData.week === this.curWeek) {
        return {
          backgroundColor: '#3172b2',
          color: '#eee'
        }
      } else if (rowIndex === 0 && columnIndex === 0) {
        return { background: '#fff' }
      } else {
        return { background: '#eef1f6' }
      }
    },
    // table-cell样式
    cellStyle ({ row, column, columnIndex, rowIndex }) {
      if (columnIndex !== 0) {
        return row[column.property].rowSpan > 0
          ? 'has-course' : undefined
      } else {
        if (rowIndex < 4) {
          return 'fir-courses'
        } else if (rowIndex < 8) {
          return 'sec-courses'
        } else {
          return 'thr-courses'
        }
      }
    },
    // 计算选中周数和当前周数
    countSelectedWeek () {
      const toNowDays = (new Date() - BEGIN_DATE) / ONE_DAY_TIME
      this.curWeek = Math.floor(toNowDays / 7) + 1
      this.formData.week = this.curWeek

      return this.curWeek
    },
    // 回到本周
    rebackCurWeek () {
      this.formData.week = this.curWeek
      this.$notify({
        message: `本周是第 ${this.curWeek} 周喔~~`,
        type: 'success',
        duration: 2000
      })
    },
    // 随机背景图片
    randomBgImg () {
      setInterval(() => {
        const index = Math.floor(Math.random() * 4 + 1)
        this.cardBackground.background = 'url(http://course-table-img.oss-cn-hangzhou.aliyuncs.com/bk' + index + '.jpg) no-repeat'
      }, 30000)
    },
    getHeight () {
      this.tableConfig.height = window.innerHeight - 159
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
    this.randomBgImg()
    window.addEventListener('resize', this.getHeight)
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
  }

}
</script>

<style lang="scss" scoped>
  @import "src/assets/scss/course_table.scss";

</style>
<style lang="scss">
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ffffff!important;
  }
  .has-course{
    background-color: #E0FFFF!important;
    padding: 0!important;
    position: relative;
    overflow: hidden!important; // 这里很关键，好像默认是visible
    .cell{
      transition: ease-in-out .5s;
      height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
    }
  }
  .has-course :hover {
    top: -3px;
    background-color: #fedd8397;
    border-radius: 20px;
    cursor: pointer;
    transform: translateY(-3px);
    box-shadow: 10px 10px 10px 0 rgba(108, 135, 135, .2);

    .course-name {
      background-color: #409eff;
      color: #eeeeee;
      border-radius: 20px;
      cursor: default;
    }

    .course-name:hover {
      background-color: #409eff;
      color: #eeeeee;
      border-radius: 20px;
      cursor: default;
    }
  }
  .fir-courses{
    background-color: #c4e1c5!important;
    cursor: default;
    font-weight: bold;
  }
  .sec-courses{
    background-color: skyblue!important;
    cursor: default;
    font-weight: bold;
  }
  .thr-courses{
    background-color: #FFB6C1!important;
    cursor: default;
    font-weight: bold;
  }

</style>
