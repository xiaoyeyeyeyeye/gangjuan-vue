<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="margin:0 0 5px 20px; font-size: 24px;">
        库存总览
      </div>
      <aside>
        可以查看有记录的钢卷全部信息，修改基本信息。
        支持钢卷二维码补打。
      </aside>
      <el-input v-model="listQuery.coilNo" placeholder="钢卷编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.manufacturerName" placeholder="厂家" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in manufacture_id_options" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker v-model="entryTimeRange" type="datetimerange" clearable class="filter-item" :picker-options="pickerOptions" range-separator="至" start-placeholder="入库开始时间" end-placeholder="入库结束时间" />
      <el-date-picker v-model="outTimeRange" type="datetimerange" clearable class="filter-item" :picker-options="pickerOptions" range-separator="至" start-placeholder="出库开始时间" end-placeholder="出库结束时间" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <!-- <div ref="container" style="width: 100%; height: 40vh;" /> -->

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
          <!-- <span>{{ row.entryAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span>{{ row.entryAt }}</span>
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
          <span>{{ row.xCoord }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" class-name="status-col" min-width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="钢卷名称" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.coilName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷牌号" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.coilGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品标准" align="center" min-width="140">
        <template slot-scope="{row}">
          <span>{{ row.productStandard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="熔炼号" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.heatNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品等级" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.coilClass }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷重量（吨）" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.weightT }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷重量（千克）" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.weightKg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="张数" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.sheet }}</span>
        </template>
      </el-table-column>
      <el-table-column label="长度" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同号" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.contractNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到站" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.destination }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产日期" align="center" min-width="140">
        <template slot-scope="{row}">
          <span>{{ row.dateProduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终用户" align="center" min-width="170">
        <template slot-scope="{row}">
          <span>{{ row.consumer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" min-width="140">
        <template slot-scope="{row}">
          <span>{{ row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            二维码补打
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="880px">
      <el-form ref="dataForm" :rules="rules" :model="temp" class="two-column-form" label-position="left" label-width="120px">
        <!-- 两列布局开始 -->
        <el-row :gutter="24" type="flex" wrap>
          <el-col :span="12">
            <el-form-item label="入库时间" prop="entryAt">
              <el-date-picker v-model="temp.entryAt" type="datetime" placeholder="请选择入库时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库时间" prop="outAt">
              <el-date-picker v-model="temp.outAt" type="datetime" placeholder="请选择出库时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢卷编号" prop="coilNo">
              <el-input v-model="temp.coilNo" />
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
            <el-form-item label="当前坐标" prop="xCoord">
              <el-input v-model="temp.xCoord" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前状态" prop="status">
              <el-input v-model="temp.status" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢卷名称" prop="coilName">
              <el-input v-model="temp.coilName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢卷牌号" prop="coilGrade">
              <el-input v-model="temp.coilGrade" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品标准" prop="productStandard">
              <el-input v-model="temp.productStandard" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="熔炼号" prop="heatNo">
              <el-input v-model="temp.heatNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品等级" prop="coilClass">
              <el-input v-model="temp.coilClass" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢卷重量（吨）" prop="weightT">
              <el-input v-model="temp.weightT" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢卷重量（千克）" prop="weightKg">
              <el-input v-model="temp.weightKg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="张数" prop="sheet">
              <el-input v-model="temp.sheet" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="长度" prop="length">
              <el-input v-model="temp.length" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同号" prop="contractNo">
              <el-input v-model="temp.contractNo" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="到站" prop="destination">
              <el-input v-model="temp.destination" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产日期" prop="dateProduction">
              <el-input v-model="temp.dateProduction" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最终用户" prop="consumer">
              <el-input v-model="temp.consumer" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
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

    <!-- 还需要做一个二维码补打 -->
  </div>
</template>

<script>
import {
  fetchOverviewList,
  createOverview,
  updateOverview,
  // generateQrCode,
  reprintQrCode
} from '@/api/steel-coil'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
      currentRole: 'adminDashboard',
      coilMeshes: [],
      selectedCoil: null,

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      entryTimeRange: [],
      outTimeRange: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        coilNo: '',
        manufacturerName: '',
        entryStart: '',
        entryEnd: '',
        outStart: '',
        outEnd: ''
      },

      manufacture_id_options: ['柳钢', '攀钢', '首钢', '马钢', '沙钢'],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['在库', '已出库', '废弃'],
      showReviewer: false,
      temp: {
        coilId: undefined,

        entryAt: '',
        outAt: '',

        coilNo: '',
        operator: '',
        manufacturerName: '',
        coilSize: '',

        locationId: '',
        // location_xyz: '',

        status: '在库',

        coilName: '',
        coilGrade: '',
        productStandard: '',
        heatNo: '',
        coilClass: '',

        weightT: '',
        weightKg: '',
        sheet: '',
        length: '',

        contractNo: '',
        destination: '',
        dateProduction: '',
        consumer: '',

        remark: ''
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
        coilNo: [{ required: true, message: '请输入钢卷编号', trigger: 'blur' }]
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
  mounted() {
    // this.initThreeScene()
  },
  methods: {
    initThreeScene() {
      const container = this.$refs.container
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf0f0f0)

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(120, 150, 250) // ✅ 向上抬高并稍微拉远

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.maxPolarAngle = Math.PI / 2.2
      controls.minDistance = 100
      controls.maxDistance = 400
      controls.enablePan = false

      // 光照
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
      directionalLight.position.set(100, 100, 100)
      scene.add(directionalLight)

      // 地板
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshStandardMaterial({ color: 0xdddddd })
      )
      floor.rotation.x = -Math.PI / 2
      scene.add(floor)

      // 添加钢卷
      const coils = this.generateMockCoils()
      this.coilMeshes = this.addSteelCoils(coils, scene)

      // 点击监听器
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(this.coilMeshes)

        if (intersects.length > 0) {
          const selected = intersects[0].object

          // 恢复上一个颜色
          if (this.selectedCoil && this.selectedCoil !== selected) {
            this.selectedCoil.material.color.set(0x607d8b)
          }

          // 选中新颜色
          selected.material.color.set(0xff0000)
          this.selectedCoil = selected

          // 显示信息
          alert(`钢卷 ID: ${selected.userData.id}`)
        } else {
          // 点击空白处，取消选中
          if (this.selectedCoil) {
            this.selectedCoil.material.color.set(0x607d8b)
            this.selectedCoil = null
          }
        }
      })

      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }

      animate()
    },

    generateMockCoils() {
      const data = []
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 10; row++) {
          for (let layer = 0; layer < 3; layer++) {
            data.push({
              id: `${col}-${row}-${layer}`,
              x: col * 30,
              y: layer * 25,
              z: row * 30
            })
          }
        }
      }
      return data
    },

    addSteelCoils(data, scene) {
      const geometry = new THREE.CylinderGeometry(10, 10, 20, 32)
      const meshes = []

      for (const coil of data) {
        const material = new THREE.MeshStandardMaterial({ color: 0x607d8b })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(coil.x, coil.y + 10, coil.z)
        mesh.rotation.x = Math.PI / 2
        mesh.userData.id = coil.id
        scene.add(mesh)
        meshes.push(mesh)
      }

      return meshes
    },

    getList() {
      this.listLoading = true
      fetchOverviewList(this.listQuery).then(res => {
        const data = res.result
        this.list = data.records
        this.total = data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      if (this.entryTimeRange?.length === 2) {
        this.listQuery.entryStart = this.entryTimeRange[0]
        this.listQuery.entryEnd = this.entryTimeRange[1]
      } else {
        this.listQuery.entryStart = ''
        this.listQuery.entryEnd = ''
      }

      if (this.outTimeRange?.length === 2) {
        this.listQuery.outStart = this.outTimeRange[0]
        this.listQuery.outEnd = this.outTimeRange[1]
      } else {
        this.listQuery.outStart = ''
        this.listQuery.outEnd = ''
      }

      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
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
        coilId: undefined,
        entryAt: '',
        outAt: '',
        coilNo: '',
        operator: '',
        manufacturerName: '',
        coilSize: '',
        locationId: '',
        // location_xyz: '',
        status: '在库',
        coilName: '',
        coilGrade: '',
        productStandard: '',
        heatNo: '',
        coilClass: '',
        weightT: '',
        weightKg: '',
        sheet: '',
        length: '',
        contractNo: '',
        destination: '',
        dateProduction: '',
        consumer: '',
        remark: ''
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
      this.$refs['dataForm'].validate(valid => {
        if (!valid) return
        createOverview(this.temp).then(() => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({ title: '成功', message: '新增成功', type: 'success' })
        })
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (!valid) return
        updateOverview(this.temp.coilId, this.temp).then(() => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({ title: '成功', message: '更新成功', type: 'success' })
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确认补打该钢卷二维码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reprintQrCode(row.coilId, '前端补打').then(() => {
          this.$message.success('二维码补打成功')
          window.open(`/api/overview/${row.coilId}/qrcode`)
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
    }
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // }
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
