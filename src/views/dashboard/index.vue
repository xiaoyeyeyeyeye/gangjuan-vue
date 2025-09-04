<template>
  <div class="dashboard-container">
    <adminDashboard />
    <div class="content">
      <!-- 左侧：Three.js 容器 -->
      <div ref="container" class="three-container" />

      <!-- 右侧：固定信息展示区 -->
      <div class="info-panel">
        <el-card class="coil-card">
          <h3>钢卷信息</h3>
          <p v-if="selected"><strong>ID:</strong> {{ selected.userData.id }}</p>
          <p v-else><strong>请选择钢卷</strong></p>
          <!-- 后续可拓展更多字段 -->
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      coilMeshes: [],
      selectedCoil: null,
      selected: null // ✅ 记录选中钢卷
    }
  },
  mounted() {
    try {
      this.initThreeScene()
    } catch (e) {
      console.error('Three.js 初始化失败:', e)
    }
  },
  methods: {
    initThreeScene() {
      const container = this.$refs.container

      // === 场景 ===
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xaed6f1) // 浅蓝天色
      scene.fog = new THREE.Fog(0x0a0a0a, 300, 1200)

      // === 相机 ===
      const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        3000
      )
      camera.position.set(200, 200, 600) // 近一点，像人眼高度
      camera.lookAt(60, 30, 120) // 朝向钢卷区域

      // === 渲染器 ===
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.shadowMap.enabled = true
      container.appendChild(renderer.domElement)

      // === 控制器 ===
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.maxPolarAngle = Math.PI / 2
      controls.minDistance = 100
      controls.maxDistance = 1000
      controls.enablePan = true // 仓库场景允许平移

      // === 灯光 ===
      scene.add(new THREE.AmbientLight(0xffffff, 0.5))
      const dirLight = new THREE.DirectionalLight(0xffffff, 1)
      dirLight.position.set(500, 800, 300)
      dirLight.castShadow = true
      scene.add(dirLight)

      // 几个小点光源，增加亮点
      const pointLight1 = new THREE.PointLight(0x44aaff, 1, 300)
      pointLight1.position.set(200, 150, 100)
      scene.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0x88ccff, 1, 300)
      pointLight2.position.set(-200, 200, -150)
      scene.add(pointLight2)

      // === 地面：水泥色 + 网格 ===
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 })
      )
      floor.rotation.x = -Math.PI / 2
      floor.receiveShadow = true
      scene.add(floor)

      const grid = new THREE.GridHelper(2000, 100, 0x444444, 0x888888)
      scene.add(grid)

      // 网格辅助线（蓝色高亮）
      const gridHelper = new THREE.GridHelper(2000, 40, 0x00ffff, 0x004477)
      scene.add(gridHelper)

      // === 铁轨 ===
      const railMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8 })
      for (let i = -1; i <= 1; i += 2) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(800, 5, 10), railMaterial)
        rail.position.set(0, 2, i * 40)
        rail.receiveShadow = true
        scene.add(rail)
      }
      const sleeperMaterial = new THREE.MeshStandardMaterial({ color: 0x774422 })
      for (let i = -350; i <= 350; i += 40) {
        const sleeper = new THREE.Mesh(new THREE.BoxGeometry(40, 5, 20), sleeperMaterial)
        sleeper.position.set(i, 2, 0)
        scene.add(sleeper)
      }

      // === 塔吊（简化版）===
      const craneBase = new THREE.Mesh(new THREE.BoxGeometry(40, 200, 40), new THREE.MeshStandardMaterial({ color: 0xffcc00 }))
      craneBase.position.set(-200, 100, -200)
      scene.add(craneBase)

      const craneArm = new THREE.Mesh(new THREE.BoxGeometry(300, 20, 20), new THREE.MeshStandardMaterial({ color: 0xffaa00 }))
      craneArm.position.set(-50, 200, -200)
      scene.add(craneArm)

      const craneHook = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 50, 16), new THREE.MeshStandardMaterial({ color: 0x333333 }))
      craneHook.position.set(-150, 150, -200)
      scene.add(craneHook)

      // === 草木 ===
      for (let i = 0; i < 10; i++) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 8), new THREE.MeshStandardMaterial({ color: 0x8b4513 }))
        trunk.position.set(-300 + i * 80, 10, 300)
        scene.add(trunk)

        const leaves = new THREE.Mesh(new THREE.ConeGeometry(15, 40, 8), new THREE.MeshStandardMaterial({ color: 0x228b22 }))
        leaves.position.set(-300 + i * 80, 40, 300)
        scene.add(leaves)
      }

      // === 添加钢卷 ===
      const coils = this.generateMockCoils()
      this.coilMeshes = this.addSteelCoils(coils, scene)

      // === 自动对准中心 ===
      const box = new THREE.Box3()
      this.coilMeshes.forEach(mesh => box.expandByObject(mesh))
      const center = new THREE.Vector3()
      box.getCenter(center)

      controls.target.copy(center)
      camera.lookAt(center)

      // === 入场相机小动画 ===
      const startPos = new THREE.Vector3(0, 800, 1500) // 开始远处
      const endPos = new THREE.Vector3(300, 250, 500) // 停止位置
      camera.position.copy(startPos)

      let progress = 0
      const animateCamera = () => {
        if (progress < 1) {
          progress += 0.01
          camera.position.lerpVectors(startPos, endPos, progress)
          requestAnimationFrame(animateCamera)
        }
      }
      animateCamera()

      // === 点击交互 ===
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

          if (this.selectedCoil && this.selectedCoil !== selected) {
            this.restoreCoilMaterial(this.selectedCoil)
          }

          // 选中 → 替换为蓝色科技网格
          selected.material = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            wireframe: true
          })
          this.selectedCoil = selected
          this.selected = selected // ✅ 保存到 data
        } else {
          if (this.selectedCoil) {
            this.restoreCoilMaterial(this.selectedCoil)
            this.selectedCoil = null
            this.selected = null
          }
        }
      })

      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(container.clientWidth, container.clientHeight)
      })

      // === 动画循环 ===
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
      const geometry = new THREE.CylinderGeometry(10, 10, 20, 64) // 多段，更圆滑
      const meshes = []

      for (const coil of data) {
        const material = new THREE.MeshStandardMaterial({
          color: 0x99aabb,
          metalness: 0.9, // 强金属感
          roughness: 0.2, // 光滑
          emissive: 0x111111 // 微微自发光，避免纯黑
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(coil.x, coil.y + 10, coil.z)
        mesh.rotation.x = Math.PI / 2
        mesh.userData.id = coil.id

        mesh.castShadow = true
        mesh.receiveShadow = true

        scene.add(mesh)
        meshes.push(mesh)
      }

      return meshes
    },
    restoreCoilMaterial(mesh) {
      mesh.material = new THREE.MeshStandardMaterial({
        color: 0x99aabb,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x111111
      })
    }
  }
}
</script>
<style scoped>
.content {
  display: flex;
  height: 70vh; /* 高度要固定，否则 clientHeight 可能是 0 */
}

.three-container {
  flex: 1; /* 占满剩余空间 */
}

.info-panel {
  width: 300px;
  height: 100%; /* 跟随 .content */
  padding: 0; /* 让 card 贴边 */
  background: #f9f9f9;
  border-left: 1px solid #e0e0e0;
}

.coil-card {
  height: 100%; /* 填满右侧区域 */
  border-radius: 0; /* 贴边更好看，可以保留圆角 */
  display: flex;
  flex-direction: column;
}

.coil-card .el-card__body {
  flex: 1;
  overflow-y: auto; /* 内容多时滚动 */
  padding: 16px;
}
</style>
