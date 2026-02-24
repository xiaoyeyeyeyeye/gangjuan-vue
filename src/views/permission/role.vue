<template>
  <div class="app-container">
    <!-- 权限分配页面 -->
    <div style="margin:0 0 5px 20px; font-size: 24px;">
      权限分配
    </div>
    <aside>
      管理员可以查看账户信息，并进行账户信息更改、手机解绑、密码重置等操作。
    </aside>

    <el-select v-model="rolesList.key" placeholder="角色权限" clearable style="width: 120px" class="filter-item">
      <el-option v-for="item in role_id_options" :key="item" :label="item" :value="item" />
    </el-select>

    <el-input v-model="rolesList.work_number" placeholder="工号" style="width: 150px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="rolesList.name" placeholder="姓名" style="width: 120px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="rolesList.phone_number" placeholder="手机号" style="width: 150px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      查找
    </el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddUser">
      新增
    </el-button>
    <el-table v-loading="listLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="权限类型" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.work_number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.phone_number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码" width="220">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述" min-width="220">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <!-- <el-button type="primary" size="small" @click="handleDelete(scope)">重置密码</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新建用户'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色">
          <el-select v-model="role.key" placeholder="角色权限" clearable style="width: 120px" class="filter-item">
            <el-option v-for="item in role_id_options" :key="item" :label="item" :value="item" />
          </el-select>

        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="role.work_number" placeholder="工号" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="role.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="role.phone_number" placeholder="手机号" />
          <el-button type="primary" size="small" @click="handleDelete(scope)">解除绑定</el-button>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="role.phone" placeholder="手机号" />
          <el-button type="primary" size="small" @click="handleDelete(scope)">重置密码</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addUser, deleteUser } from '@/api/role'

const defaultRole = {
  key: '',
  work_number: '',
  phone_number: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      listLoading: false,
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      role_id_options: ['admin', 'worker', 'device'],

      // 查询条件
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        roleType: undefined,
        employeeId: undefined,
        username: undefined,
        phone: undefined
      }
    }
  },
  // computed: {
  //   routesData() {
  //     return this.routes
  //   }
  // },
  created() {
    // 后期有角色菜单列表了再打开
    // this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      try {
        const res = await getRoutes()
        this.serviceRoutes = res.data
        this.routes = this.generateRoutes(res.data)
      } catch (error) {
        console.error('获取路由失败:', error)
      }
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      // 构建查询参数
      const params = {
        page: this.listQuery.pageNum,
        size: this.listQuery.pageSize
      }

      // 添加筛选条件
      if (this.listQuery.roleType) params.roleType = this.listQuery.roleType
      if (this.listQuery.employeeId) params.employeeId = this.listQuery.employeeId
      if (this.listQuery.username) params.username = this.listQuery.username
      if (this.listQuery.phone) params.phone = this.listQuery.phone

      getRoles(params).then(response => {
        this.rolesList = response.data.list || response.data.items || response.data
        this.total = response.data.total || this.rolesList.length
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    handleAddUser() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      // 根据后端字段映射
      this.role = deepClone({
        id: scope.row.id, // 添加id字段
        roleType: scope.row.roleType || scope.row.key,
        employeeId: scope.row.employeeId || scope.row.number,
        username: scope.row.username || scope.row.name,
        phone: scope.row.phone,
        description: scope.row.description
      })
    },

    async handleDelete({ $index, row }) {
      try {
        await this.$confirm('确认删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 使用id而不是key
        const id = row.id || row.key
        await deleteUser(id)
        this.rolesList.splice($index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error)
        }
      }
    },

    // // 重置密码
    // async handleResetPassword(row) {
    //   try {
    //     await this.$confirm('确认重置密码?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })

    //     await resetPassword({
    //       userId: row.id,
    //       employeeId: row.employeeId
    //     })
    //     this.$message.success('密码重置成功')
    //   } catch (error) {
    //     if (error !== 'cancel') {
    //       console.error(error)
    //     }
    //   }
    // },

    // // 解绑手机
    // async handleUnbindPhone(row) {
    //   try {
    //     await this.$confirm('确认解绑手机?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })

    //     await unbindPhone({
    //       userId: row.id
    //     })
    //     this.$message.success('手机解绑成功')
    //     // 刷新列表
    //     this.getList()
    //   } catch (error) {
    //     if (error !== 'cancel') {
    //       console.error(error)
    //     }
    //   }
    // },

    async confirmRole() {
      try {
        const isEdit = this.dialogType === 'edit'

        if (isEdit) {
          // await updateRole(this.role.id, this.role)
          // 更新本地数据
          const index = this.rolesList.findIndex(item => item.id === this.role.id)
          if (index > -1) {
            this.rolesList.splice(index, 1, { ...this.rolesList[index], ...this.role })
          }
        } else {
          const { data } = await addUser(this.role)
          this.rolesList.push(data)
        }

        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: `${isEdit ? '更新' : '创建'}成功`,
          type: 'success'
        })
      } catch (error) {
        console.error('操作失败:', error)
      }
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },

    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
