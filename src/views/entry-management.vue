<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="margin:0 0 10px 30px; font-size: 24px;">
        入库记录
      </div>
      <aside>
        入库扫码请使用配备的扫描仪，将由摄像头系统自动定位入库。
        可对入库的钢卷进行修改、删除处理，也可以手动新增入库钢卷。
      </aside>
      <el-input v-model="listQuery.coil_no" placeholder="钢卷编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.manufacture_id" placeholder="厂家" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in manufacture_id_options" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker v-model="value2" type="datetimerange" clearable class="filter-item" :picker-options="pickerOptions" range-separator="至" start-placeholder="入库开始时间" end-placeholder="入库结束时间" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" align="center" width="80" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <!-- <span>{{ row.entry_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span>{{ row.entryAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷编号" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.coilNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂家" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.manufacturerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷规格" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.coilSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前位置" align="center" min-width="180">
        <template slot-scope="{row}">
          <span>{{ row.locationId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前坐标" align="center" min-width="130">
        <template slot-scope="{row}">
          <span>{{ row.location_xyz }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" class-name="status-col" min-width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            撤销入库
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" class="two-column-form" label-position="left" label-width="120px">
        <!-- 两列布局开始 -->
        <el-row :gutter="24" type="flex" wrap>
          <el-col :span="12">
            <el-form-item label="入库时间" prop="entryAt">
              <el-date-picker v-model="temp.entryAt" type="datetime" placeholder="请选择入库时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢卷编号" prop="coilNo">
              <el-input v-model="temp.coilNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="temp.operator" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家" prop="manufacturerName">
              <el-select v-model="temp.manufacturerName" class="filter-item" placeholder="请选择厂家">
                <el-option v-for="item in manufacture_id_options" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢卷规格" prop="coilSize">
              <el-input v-model="temp.coilSize" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前位置" prop="locationId">
              <el-input v-model="temp.locationId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前坐标" prop="location_xyz">
              <el-input v-model="temp.location_xyz" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前状态" prop="status">
              <el-input v-model="temp.status" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '在库': 'success',
        '已出库': 'info',
        '废弃': 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      manufacture_id_options: ['柳钢', '攀钢', '首钢', '马钢', '沙钢'],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['在库', '已出库', '废弃'],
      showReviewer: false,
      temp: {
        id: undefined,
        manufacture_id: '柳钢',
        remark: '',
        timestamp: new Date(),
        coil_no: '',
        type: '',
        status: '在库'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        coil_no: [{ required: true, message: '请输入钢卷编号', trigger: 'blur' }]
      },
      downloadLoading: false,

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.records
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        // this.listQuery.sort = '+id'
      } else {
        // this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        manufacture_id: '柳钢',
        remark: '',
        timestamp: new Date(),
        coil_no: '',
        status: '在库',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '撤销成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style scoped>
.two-column-form .el-row {
  flex-wrap: wrap;
}

.two-column-form .el-col {
  min-width: 300px; /* 最小宽度，防止太窄换行 */
}

/* 表单最大高度自动滚动，而不是整个 dialog 出现滚动条 */
.el-dialog__body {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden; /* 禁止横向滚动 */
}
</style>
