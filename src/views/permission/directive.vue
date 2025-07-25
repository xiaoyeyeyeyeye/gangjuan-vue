<template>
  <div class="app-container">
    <div>
      <el-form :model="role" label-width="80px" label-position="left">
        <!-- <i class="el-icon-user-solid" style="color:#ffffff;" /> -->
        <i class="user" style="color:#ffffff; font-size: 36px;" />
        <el-form-item label="角色">
          <el-input v-model="role.key" placeholder="admin" disabled />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="role.number" placeholder="工号" disabled/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="role.phone" placeholder="手机号" />
          <el-button type="primary" size="small" @click="handleDelete(scope)">解除绑定</el-button>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="role.phone" placeholder="手机号" />
          <el-button type="primary" size="small" @click="handleDelete(scope)">重置密码</el-button>
        </el-form-item>
      </el-form>
      <!-- <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数

const defaultRole = {
  key: '',
  number: '',
  phone: '',
  description: '',
  routes: []
}

export default {
  name: 'DirectivePermission',
  directives: { permission },
  data() {
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
      name: '',
      email: '',
      avatar: '',
      role: Object.assign({}, defaultRole)
    }
  },
  methods: {
    checkPermission,
    handleRolesChange() {
      this.key++
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }
  ::v-deep .permission-sourceCode {
    margin-left: 15px;
  }
  ::v-deep .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>

