<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="margin:0 0 5px 20px; font-size: 24px;">
        库存总览
      </div>
      <aside>
        可以查看钢卷全部信息，修改基本钢卷信息。
        支持钢卷二维码补打。
      </aside>
      <el-input v-model="listQuery.title" placeholder="钢卷编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="厂家" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="规模类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="出库时间" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="操作人" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
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
      <!-- <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.entry_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷编号" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.coil_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂家" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.manufacture_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷规格" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.coil_size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前位置" align="center" min-width="180">
        <template slot-scope="{row}">
          <span>{{ row.location_id }}</span>
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

      <el-table-column label="钢卷名称" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.coil_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷牌号" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.coil_grade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品标准" align="center" min-width="140">
        <template slot-scope="{row}">
          <span>{{ row.product_standard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="熔炼号" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.heat_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品等级" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.coil_class }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷重量（吨）" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.weight_t }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷重量（千克）" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.weight_kg }}</span>
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
          <span>{{ row.contract_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到站" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.destination }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产日期" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.date_production }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终用户" align="center" min-width="170">
        <template slot-scope="{row}">
          <span>{{ row.consumer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" min-width="140">
        <template slot-scope="{row}">
          <span>{{ row.entry_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="880px">
      <el-form ref="dataForm" :rules="rules" :model="temp" class="two-column-form" label-position="left" label-width="120px">
        <!-- 两列布局开始 -->
        <el-row :gutter="24" type="flex" wrap>
          <el-col :span="12">
            <el-form-item label="入库时间" prop="timestamp">
              <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢卷编号" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="操作人" prop="type">
              <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <el-form-item label="厂家" prop="type">
              <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="钢卷规格" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入库位置" prop="type">
              <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="当前状态" prop="type">
              <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="钢卷名称" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="钢卷牌号" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品标准" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="熔炼号" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品等级" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="钢卷重量（吨）" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="钢卷重量（千克）" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="合同号" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="到站" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="生产日期" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="钢卷生产厂家编号" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="最终用户" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="title">
              <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
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
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
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
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
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
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.initThreeScene()
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

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
        message: '操作Success',
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
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
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
              message: 'Created Successfully',
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
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '二维码补打',
        message: '生成二维码，唤起打印任务',
        type: 'success',
        duration: 2000
      })
      // this.list.splice(index, 1)
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
