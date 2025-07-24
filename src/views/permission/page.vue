<template>
  <div class="app-container">
    <!-- 角色切换页面 -->
    <switch-roles @change="handleRolesChange" />
    角色切换页面
  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'PagePermission',
  components: { SwitchRoles },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    }
  }
}
</script>
