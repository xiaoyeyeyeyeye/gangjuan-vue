<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="margin:0 0 5px 20px; font-size: 24px;">
        出库记录
      </div>
      <aside>
        出库将由摄像头系统自动定位出库。
        可对出库的钢卷进行修改、删除处理，也可以手动新增出库钢卷。
      </aside>
      <el-input v-model="listQuery.coilNo" placeholder="钢卷编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.manufacturerName" placeholder="厂家" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in manufacture_id_options" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker v-model="value2" type="datetimerange" clearable class="filter-item" :picker-options="pickerOptions" range-separator="至" start-placeholder="出库开始时间" end-placeholder="出库结束时间" />
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
      <el-table-column label="出库时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <!-- <span>{{ row.outAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span>{{ row.outAt }}</span>
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
          <span>{{ row.locationXyz }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" class-name="status-col" min-width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            已出库
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            撤销出库
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" class="two-column-form" label-position="left" label-width="120px">
        <!-- 两列布局开始 -->
        <el-row :gutter="24" type="flex" wrap>
          <el-col :span="12">
            <el-form-item label="出库时间" prop="outAt">
              <el-date-picker v-model="temp.outAt" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择出库时间" />
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
                <el-option v-for="item in manufacture_id_options" :key="item" :label="item" :value="item" />
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
            <el-form-item label="当前坐标" prop="locationXyz">
              <el-input v-model="temp.locationXyz" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前状态" prop="status">
              <el-input v-model="temp.status" />
              <!-- <el-input placeholder="已出库" /> -->
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
import {
  fetchOutboundList,
  // fetchOutboundPage,
  // executeOutbound,
  cancelOutbound
} from '@/api/outbound'

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
      // 为了页面效果，全部变为已出库
      const statusMap = {
        '在库': 'info',
        '已出库': 'info',
        '废弃': 'info'
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
        pageNum: 1,
        pageSize: 10,
        coilNo: '',
        manufacturerName: '',
        startTime: '',
        endTime: ''
      },
      manufacture_id_options: ['柳钢', '攀钢', '首钢', '马钢', '沙钢'],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['已出库', '废弃'],
      showReviewer: false,
      temp: {
        outAt: '',
        coilNo: '',
        operator: '',
        manufacturerName: '柳钢',
        coilSize: '',
        locationId: '',
        locationXyz: '',
        status: '已出库'
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
        outAt: [{ required: true, message: '请选择出库时间', trigger: 'change' }],
        coilNo: [{ required: true, message: '请输入钢卷编号', trigger: 'blur' }],
        operator: [{ required: true, message: '请输入操作人', trigger: 'blur' }],
        manufacturerName: [{ required: true, message: '请选择厂家', trigger: 'change' }]
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
      const params = {
        ...this.listQuery
      }
      if (this.value2 && this.value2.length === 2) {
        params.startTime = this.value2[0].getTime()
        params.endTime = this.value2[1].getTime()
      }
      fetchOutboundList(params).then(res => {
        this.list = res.data.records || []
        this.total = res.data.total || 0
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
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
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        outAt: '',
        coilNo: '',
        operator: '',
        manufacturerName: '柳钢',
        coilSize: '',
        locationId: '',
        locationXyz: '',
        status: '已出库'
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$confirm('确认撤销该钢卷出库记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        cancelOutbound(row.operationId, this.$store.getters.userId).then(() => {
          this.$notify({
            title: '成功',
            message: '撤销成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
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

