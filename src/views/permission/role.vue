<template>
  <div class="app-container">
    <!-- 权限分配页面 -->
    <div style="margin:0 0 5px 20px; font-size: 24px;">
      权限分配
    </div>
    <aside>
      管理员可以查看账户信息，并进行账户信息更改、手机解绑、密码重置等操作。
    </aside>

    <el-select v-model="listQuery.roleId" placeholder="角色权限" clearable style="width: 120px" class="filter-item">
      <el-option v-for="item in role_id_options" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
    </el-select>

    <el-input v-model="listQuery.jobNumber" placeholder="工号" style="width: 150px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="listQuery.name" placeholder="姓名" style="width: 120px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="listQuery.phoneNumber" placeholder="手机号" style="width: 150px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      查找
    </el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddUser">
      新增
    </el-button>
    <el-table v-loading="listLoading" :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="权限类型" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.jobNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.phoneNumber }}
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
          <el-select v-model="role.roleId" placeholder="角色权限" clearable style="width: 120px" class="filter-item">
            <el-option v-for="item in role_id_options" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="role.jobNumber" placeholder="工号" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="role.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="role.phoneNumber" placeholder="手机号" />
        </el-form-item>
        <el-form-item v-if="dialogType==='new'" label="密码">
          <el-input v-model="role.password" type="password" placeholder="密码（选填，默认123456）" />
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
import { queryUsers, getAllRoles, addUser, updateUser, deleteUser } from '@/api/role'

const defaultRole = {
  userId: undefined,
  roleId: undefined,
  jobNumber: '',
  phoneNumber: '',
  name: '',
  password: ''
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      list: [],
      listLoading: false,
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      role_id_options: [],

      // 查询条件
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        roleId: undefined,
        jobNumber: undefined,
        name: undefined,
        phoneNumber: undefined
      }
    }
  },
  created() {
    this.fetchRoleOptions()
    this.getList()
  },
  methods: {
    async fetchRoleOptions() {
      try {
        const res = await getAllRoles()
        this.role_id_options = res || []
      } catch (error) {
        console.error('获取角色列表失败:', error)
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      const params = {
        page: this.listQuery.pageNum,
        size: this.listQuery.pageSize,
        roleId: this.listQuery.roleId,
        jobNumber: this.listQuery.jobNumber,
        name: this.listQuery.name,
        phoneNumber: this.listQuery.phoneNumber
      }

      queryUsers(params).then(response => {
        const pageData = response.records !== undefined ? response : (response.pageInfo || response)
        this.list = pageData.records || pageData.data || []
        this.total = pageData.total || 0
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
      const row = scope.row
      this.role = deepClone({
        userId: row.userId,
        roleId: row.roleId,
        jobNumber: row.jobNumber,
        phoneNumber: row.phoneNumber,
        name: row.name
      })
    },

    async handleDelete({ $index, row }) {
      try {
        await this.$confirm('确认删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await deleteUser(row.userId)
        this.list.splice($index, 1)
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
          const { userId, roleId, jobNumber, phoneNumber, name } = this.role
          await updateUser(userId, { roleId, jobNumber, phoneNumber, name })
        } else {
          const { roleId, jobNumber, phoneNumber, name, password } = this.role
          await addUser({ roleId, jobNumber, phoneNumber, name, password })
        }

        this.dialogVisible = false
        this.getList()
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
