/**
 * Aura Warm-Tech Interactive Engine for Jim's Portfolio
 * Integrates:
 * 1. CSS @property Cursor Amber Spotlight & Card Specular Tracking
 * 2. Pts.js — Human-Intent Geometric Vector Field (#hero-pts-canvas)
 * 3. Rough Notation — Warm Terracotta Hand-drawn Editorial Annotations
 * 4. Matter.js — 2D Rigid-Body Tactile Capability Sandbox (#skills-physics-stage)
 * 5. Unified ⌘K Command Palette & Cross-Site Warm-Obsidian Theme Sync
 */
;(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ==========================================================================
     1. 轻提示 Toast & 暖纸 / 黑曜石暗夜双主题同步 (与 Next.js next-themes 互通)
     ========================================================================== */
  const toastEl = document.getElementById('aura-toast')
  let toastTimer = null

  function showToast(msg) {
    if (!toastEl) return
    toastEl.textContent = msg
    toastEl.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400)
  }

  const themeToggleBtn = document.getElementById('theme-toggle')
  const themeIcon = document.getElementById('theme-icon')

  function syncThemeIcon() {
    if (!themeIcon) return
    const isDark = document.documentElement.classList.contains('dark')
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon'
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark')
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch (e) {}
    syncThemeIcon()
    showToast(isDark ? '已切换至「黑曜石暗夜」模式' : '已切换至「暖纸晨光」模式')
  }

  syncThemeIcon()
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme)
  }

  /* 复制邮箱交互 */
  function copyEmail() {
    const email = 'cxxvcheng@gmail.com'
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('已复制邮箱：cxxvcheng@gmail.com')
      })
    } else {
      window.location.href = 'mailto:' + email
    }
  }

  const copyEmailBtn = document.getElementById('copy-email-btn')
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', copyEmail)
  }

  /* ==========================================================================
     2. 平滑锚点跳转 & 顶栏滚动感知 & 卡片渐显
     ========================================================================== */
  function scrollToSection(hash) {
    if (!hash || hash === '#' || hash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const target = document.getElementById(hash.replace(/^#/, ''))
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 78
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      scrollToSection(this.getAttribute('href'))
    })
  })

  const navbar = document.getElementById('navbar')
  const onScroll = () => {
    if (!navbar) return
    navbar.classList.toggle('scrolled', window.scrollY > 48)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  if (!prefersReducedMotion) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
            cardObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.project-card, .blog-card').forEach((card, idx) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(24px)'
      card.style.transition = `opacity 0.65s cubic-bezier(0.2, 1, 0.3, 1) ${(idx % 3) * 0.07}s, transform 0.65s cubic-bezier(0.2, 1, 0.3, 1) ${(idx % 3) * 0.07}s, border-color 0.35s ease, box-shadow 0.35s ease`
      cardObserver.observe(card)
    })
  }

  /* ==========================================================================
     3. CSS @property 光标琥珀聚光灯 & 卡片边缘追光
     ========================================================================== */
  const heroSection = document.getElementById('home')
  const heroSpotlight = document.getElementById('hero-spotlight')

  if (heroSection && heroSpotlight && !prefersReducedMotion) {
    heroSection.addEventListener(
      'pointermove',
      (e) => {
        const rect = heroSection.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        heroSpotlight.style.setProperty('--spot-x', `${x.toFixed(1)}%`)
        heroSpotlight.style.setProperty('--spot-y', `${y.toFixed(1)}%`)
        heroSpotlight.style.setProperty('--spot-alpha', '0.95')
      },
      { passive: true }
    )

    heroSection.addEventListener('pointerleave', () => {
      heroSpotlight.style.setProperty('--spot-x', '72%')
      heroSpotlight.style.setProperty('--spot-y', '40%')
      heroSpotlight.style.setProperty('--spot-alpha', '0.55')
    })
  }

  document.querySelectorAll('.project-card, .blog-card').forEach((card) => {
    card.addEventListener(
      'pointermove',
      (e) => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--card-x', `${(e.clientX - rect.left).toFixed(0)}px`)
        card.style.setProperty('--card-y', `${(e.clientY - rect.top).toFixed(0)}px`)
      },
      { passive: true }
    )
  })

  /* ==========================================================================
     4. 插件一：Pts.js — 几何诗学「人定方向 · 秩序向量场」
     ========================================================================== */
  function initPtsVectorField() {
    const canvas = document.getElementById('hero-pts-canvas')
    const telemetryState = document.getElementById('pts-telemetry-state')
    if (!canvas || !window.Pts || prefersReducedMotion) return

    const { CanvasSpace, Create, Pt, Group, Line } = window.Pts
    const space = new CanvasSpace(canvas)
    space.setup({ bgcolor: 'transparent', resize: true, retina: true })
    const form = space.getForm()

    let gridPts = []
    let pointer = new Pt(-9999, -9999)
    let pointerActive = false
    let lastMoveTime = 0

    function rebuildGrid() {
      if (!space.size || space.size.x < 40 || space.size.y < 40) return
      const cols = Math.max(8, Math.min(20, Math.floor(space.size.x / 88)))
      const rows = Math.max(5, Math.min(11, Math.floor(space.size.y / 88)))
      gridPts = Create.gridPts(space.innerBound, cols, rows)
    }

    space.add({
      start: () => {
        rebuildGrid()
      },
      resize: () => {
        rebuildGrid()
      },
      animate: (time) => {
        if (!gridPts.length) rebuildGrid()
        const t = (time || 0) * 0.0012
        const activeNow = pointerActive && Date.now() - lastMoveTime < 2600
        const influenceRadius = Math.min(310, Math.max(200, space.size.x * 0.22))
        const nearNodes = []

        for (let i = 0; i < gridPts.length; i++) {
          const base = gridPts[i]
          // 左侧轻微混沌波动，右侧趋于水平精密秩序
          const orderFactor = base.x / Math.max(1, space.size.x)
          const idleWave =
            Math.sin(t + base.x * 0.006 + base.y * 0.005) * (1.35 - orderFactor * 0.85)

          let angle = idleWave
          let len = 8 + orderFactor * 4
          let alpha = 0.11 + orderFactor * 0.07
          let isAligned = false

          if (activeNow) {
            const dx = pointer.x - base.x
            const dy = pointer.y - base.y
            const dist = Math.hypot(dx, dy)

            if (dist < influenceRadius) {
              const ratio = 1 - dist / influenceRadius
              const targetAngle = Math.atan2(dy, dx)
              // 平滑角度插值：光标赋予方向
              const diff = Math.atan2(
                Math.sin(targetAngle - idleWave),
                Math.cos(targetAngle - idleWave)
              )
              angle = idleWave + diff * (ratio * 0.92)
              len = 10 + ratio * 11
              alpha = 0.22 + ratio * 0.58
              isAligned = ratio > 0.35
              nearNodes.push({ pt: base, dist, ratio })
            }
          }

          const hx = Math.cos(angle) * (len * 0.5)
          const hy = Math.sin(angle) * (len * 0.5)
          const p1 = new Pt(base.x - hx, base.y - hy)
          const p2 = new Pt(base.x + hx, base.y + hy)

          if (isAligned) {
            form.strokeOnly(`rgba(220, 164, 104, ${alpha.toFixed(3)})`, 1.35).line([p1, p2])
            form
              .fillOnly(`rgba(220, 164, 104, ${(alpha * 0.95).toFixed(3)})`)
              .point(p2, 1.7, 'circle')
          } else {
            form.strokeOnly(`rgba(245, 242, 235, ${alpha.toFixed(3)})`, 1).line([p1, p2])
          }
        }

        // 将光标周围最近的 4 个秩序节点连成几何校准网格
        if (activeNow && nearNodes.length > 1) {
          nearNodes.sort((a, b) => a.dist - b.dist)
          const top = nearNodes.slice(0, 4)
          for (let i = 0; i < top.length; i++) {
            form
              .strokeOnly(`rgba(220, 164, 104, ${(0.18 * top[i].ratio).toFixed(3)})`, 0.9)
              .line(new Group(pointer, top[i].pt))
            if (i + 1 < top.length && Line.magnitude(new Group(top[i].pt, top[i + 1].pt)) < 160) {
              form.strokeOnly('rgba(245, 242, 235, 0.14)', 0.8).line([top[i].pt, top[i + 1].pt])
            }
          }
          form.strokeOnly('rgba(220, 164, 104, 0.45)', 1).point(pointer, 5, 'circle')
        }
      },
    })

    if (heroSection) {
      heroSection.addEventListener(
        'pointermove',
        (e) => {
          const rect = canvas.getBoundingClientRect()
          pointer = new Pt(e.clientX - rect.left, e.clientY - rect.top)
          pointerActive = true
          lastMoveTime = Date.now()
          if (telemetryState) {
            telemetryState.textContent = `ALIGNED (${Math.round(pointer.x)}, ${Math.round(pointer.y)})`
          }
        },
        { passive: true }
      )

      heroSection.addEventListener('pointerleave', () => {
        pointerActive = false
        if (telemetryState) telemetryState.textContent = 'AUTONOMOUS'
      })

      // 离开首屏视口时自动休眠画布，零后台算力消耗
      const heroVisObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              space.pause(false)
            } else {
              space.pause(true)
            }
          })
        },
        { threshold: 0.02 }
      )
      heroVisObserver.observe(heroSection)
    }

    space.play()
  }

  /* ==========================================================================
     5. 插件二：Rough Notation — 陶土手绘墨迹批注（纸本与人本温度）
     ========================================================================== */
  function initRoughAnnotations() {
    if (!window.RoughNotation || prefersReducedMotion) return
    const { annotate, annotationGroup } = window.RoughNotation

    const heroEm = document.getElementById('rough-hero-em')
    if (heroEm) {
      const aHero = annotate(heroEm, {
        type: 'underline',
        color: '#DCA468',
        strokeWidth: 2.2,
        padding: 2,
        iterations: 2,
        animationDuration: 900,
      })
      setTimeout(() => aHero.show(), 850)
    }

    const aboutSection = document.getElementById('about')
    const elAmplify = document.getElementById('rough-amplify')
    const elRecords = document.getElementById('rough-records')
    const elQuote = document.getElementById('rough-quote')

    if (aboutSection && elAmplify && elRecords) {
      const a1 = annotate(elAmplify, {
        type: 'highlight',
        color: 'rgba(193, 135, 75, 0.22)',
        multiline: true,
        iterations: 1,
        animationDuration: 700,
      })
      const a2 = annotate(elRecords, {
        type: 'underline',
        color: '#C1874B',
        strokeWidth: 1.8,
        padding: 1,
        multiline: true,
        animationDuration: 650,
      })
      const list = [a1, a2]
      if (elQuote) {
        list.push(
          annotate(elQuote, {
            type: 'bracket',
            brackets: ['right'],
            color: '#C1874B',
            strokeWidth: 2,
            padding: 6,
            animationDuration: 600,
          })
        )
      }
      const group = annotationGroup(list)
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            group.show()
            obs.disconnect()
          }
        },
        { threshold: 0.35 }
      )
      obs.observe(aboutSection)
    }

    const elMcp = document.getElementById('rough-mcp')
    if (elMcp) {
      const aMcp = annotate(elMcp, {
        type: 'box',
        color: 'rgba(193, 135, 75, 0.65)',
        strokeWidth: 1.5,
        padding: [2, 5],
        animationDuration: 750,
      })
      const obsMcp = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            aMcp.show()
            obsMcp.disconnect()
          }
        },
        { threshold: 0.5 }
      )
      obsMcp.observe(elMcp)
    }
  }

  /* ==========================================================================
     6. 插件三：Matter.js — 2D 刚体物理「技能引力交互沙盒」
     ========================================================================== */
  function initMatterSkillsSandbox() {
    const stage = document.getElementById('skills-physics-stage')
    if (!stage || !window.Matter) return

    const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = window.Matter

    const CHIPS = [
      { label: 'MCP Protocol · npm', variant: 'accent' },
      { label: 'Claude Code', variant: 'dark-chip' },
      { label: 'Next.js 16', variant: 'accent' },
      { label: 'PostgreSQL · 20M+', variant: 'dark-chip' },
      { label: 'React 19', variant: '' },
      { label: 'TypeScript', variant: '' },
      { label: 'Elasticsearch', variant: '' },
      { label: 'Redis Cache', variant: '' },
      { label: 'Supabase RLS', variant: 'accent' },
      { label: 'Python / Flask', variant: '' },
      { label: 'Docker', variant: '' },
      { label: 'Gemini Multimodal', variant: 'dark-chip' },
      { label: 'DeepSeek R1', variant: '' },
      { label: 'Swift · macOS', variant: '' },
      { label: 'WPS AirScript', variant: '' },
      { label: 'Voice AI / TTS', variant: '' },
    ]

    const engine = Engine.create({
      gravity: { x: 0, y: 0.82, scale: 0.001 },
    })

    let width = stage.clientWidth || 960
    let height = stage.clientHeight || 290
    const wallThickness = 80
    let walls = []
    const items = []

    function createWalls(w, h) {
      if (walls.length) Composite.remove(engine.world, walls)
      const opts = { isStatic: true, restitution: 0.5, friction: 0.2 }
      walls = [
        Bodies.rectangle(w / 2, h + wallThickness / 2 - 2, w + 200, wallThickness, opts),
        Bodies.rectangle(w / 2, -wallThickness * 2, w + 200, wallThickness, opts),
        Bodies.rectangle(-wallThickness / 2 + 2, h / 2, wallThickness, h * 3, opts),
        Bodies.rectangle(w + wallThickness / 2 - 2, h / 2, wallThickness, h * 3, opts),
      ]
      Composite.add(engine.world, walls)
    }

    function spawnChips() {
      items.forEach((it) => {
        Composite.remove(engine.world, it.body)
        it.el.remove()
      })
      items.length = 0

      width = stage.clientWidth || 960
      height = stage.clientHeight || 290
      createWalls(width, height)

      CHIPS.forEach((chip, i) => {
        const el = document.createElement('div')
        el.className = `matter-pill ${chip.variant}`.trim()
        el.textContent = chip.label
        stage.appendChild(el)

        const rect = el.getBoundingClientRect()
        const pillW = Math.max(92, rect.width || chip.label.length * 9 + 34)
        const pillH = Math.max(34, rect.height || 36)

        const cols = Math.max(3, Math.floor((width - 80) / 165))
        const col = i % cols
        const row = Math.floor(i / cols)
        const startX = Math.min(
          width - pillW / 2 - 20,
          Math.max(
            pillW / 2 + 20,
            ((col + 0.5) / cols) * (width - 60) + 30 + (Math.random() - 0.5) * 26
          )
        )
        const startY = 26 + row * 44 + Math.random() * 12

        const body = Bodies.rectangle(startX, startY, pillW, pillH, {
          chamfer: { radius: pillH / 2 },
          restitution: 0.52,
          friction: 0.14,
          frictionAir: 0.014,
          angle: (Math.random() - 0.5) * 0.24,
        })

        Composite.add(engine.world, body)
        items.push({ el, body, w: pillW, h: pillH })
      })
    }

    // 鼠标/触控抓取约束，同时解绑滚轮拦截以保障整页顺畅滚动
    const mouse = Mouse.create(stage)
    mouse.pixelRatio = 1
    if (mouse.mousewheel) {
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
      mouse.element.removeEventListener('wheel', mouse.mousewheel)
    }

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.22,
        damping: 0.08,
        render: { visible: false },
      },
    })
    Composite.add(engine.world, mouseConstraint)

    let isRunning = false
    let isZeroG = false
    let rafId = null
    let lastTs = 0

    function tick(ts) {
      if (!isRunning) return
      const dt = lastTs ? Math.min(24, ts - lastTs) : 16.67
      lastTs = ts

      if (isZeroG) {
        items.forEach((it, idx) => {
          const waveX = Math.sin(ts * 0.001 + idx) * 0.00004
          const waveY = Math.cos(ts * 0.0012 + idx * 1.3) * 0.00004
          Body.applyForce(it.body, it.body.position, { x: waveX, y: waveY })
        })
      }

      Engine.update(engine, dt)

      for (let i = 0; i < items.length; i++) {
        const { el, body, w, h } = items[i]
        const x = body.position.x - w / 2
        const y = body.position.y - h / 2
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${body.angle.toFixed(3)}rad)`
      }

      rafId = requestAnimationFrame(tick)
    }

    let spawned = false
    const visObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!spawned) {
              spawned = true
              spawnChips()
            }
            if (!isRunning) {
              isRunning = true
              lastTs = 0
              rafId = requestAnimationFrame(tick)
            }
          } else if (isRunning) {
            isRunning = false
            if (rafId) cancelAnimationFrame(rafId)
          }
        })
      },
      { threshold: 0.05 }
    )
    visObserver.observe(stage)

    const zeroGBtn = document.getElementById('physics-zerog-btn')
    if (zeroGBtn) {
      zeroGBtn.addEventListener('click', () => {
        isZeroG = !isZeroG
        engine.gravity.y = isZeroG ? 0.02 : 0.82
        zeroGBtn.classList.toggle('active', isZeroG)
        if (isZeroG) {
          items.forEach((it) => {
            Body.setVelocity(it.body, {
              x: (Math.random() - 0.5) * 4,
              y: -2.2 - Math.random() * 2.8,
            })
          })
        }
      })
    }

    const resetBtn = document.getElementById('physics-reset-btn')
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        spawnChips()
      })
    }

    let resizeTimer = null
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (!spawned) return
        const newW = stage.clientWidth
        const newH = stage.clientHeight
        if (Math.abs(newW - width) > 24) {
          width = newW
          height = newH
          createWalls(width, height)
          items.forEach((it) => {
            if (it.body.position.x > width - it.w / 2) {
              Body.setPosition(it.body, { x: width - it.w / 2 - 16, y: it.body.position.y })
            }
          })
        }
      }, 180)
    })
  }

  /* ==========================================================================
     7. ⌘K 极客命令面板 (支持全站跳转、项目与博客检索、主题切换)
     ========================================================================== */
  function initCommandPalette() {
    const backdrop = document.getElementById('cmd-backdrop')
    const input = document.getElementById('cmd-input')
    const listEl = document.getElementById('cmd-list')
    const triggerBtn = document.getElementById('cmd-trigger')
    const closeBtn = document.getElementById('cmd-close')
    if (!backdrop || !input || !listEl) return

    const COMMANDS = [
      {
        group: '快捷动作 / Quick Actions',
        icon: 'fas fa-circle-half-stroke',
        title: '切换「暖纸晨光 / 黑曜石暗夜」主题',
        sub: 'Theme',
        keywords: 'dark light theme 暗夜 主题 切换',
        action: () => toggleTheme(),
      },
      {
        group: '快捷动作 / Quick Actions',
        icon: 'far fa-copy',
        title: '复制联系邮箱 cxxvcheng@gmail.com',
        sub: 'Copy',
        keywords: 'email mail contact 邮箱 联系 复制',
        action: () => copyEmail(),
      },
      {
        group: '快捷动作 / Quick Actions',
        icon: 'fab fa-github',
        title: '访问 GitHub 开源主页 (@Jim-purch)',
        sub: 'External',
        keywords: 'github repo code 开源 仓库',
        action: () => window.open('https://github.com/Jim-purch/', '_blank', 'noopener'),
      },

      {
        group: '简历章节 / Resume Sections',
        icon: 'fas fa-compass',
        title: '返回顶部 · 秩序与意图场',
        sub: '#home',
        keywords: 'home top hero 顶部 首页',
        action: () => scrollToSection('#home'),
      },
      {
        group: '简历章节 / Resume Sections',
        icon: 'fas fa-seedling',
        title: '01 · 关于我与人机协作观',
        sub: '#about',
        keywords: 'about philosophy 关于 理念 协作观',
        action: () => scrollToSection('#about'),
      },
      {
        group: '简历章节 / Resume Sections',
        icon: 'fas fa-cubes',
        title: '02 · 核心能力与物理技能沙盒',
        sub: '#skills',
        keywords: 'skills mcp matter physics 技能 物理 沙盒',
        action: () => scrollToSection('#skills'),
      },
      {
        group: '简历章节 / Resume Sections',
        icon: 'fas fa-star',
        title: '03 · 精选代表性项目 (9 项实战)',
        sub: '#projects',
        keywords: 'projects work portfolio 项目 作品 旗舰',
        action: () => scrollToSection('#projects'),
      },
      {
        group: '简历章节 / Resume Sections',
        icon: 'fas fa-book-open',
        title: '04 · 开源实战与架构手记',
        sub: '#blog',
        keywords: 'blog notes guides 博客 手记 文章',
        action: () => scrollToSection('#blog'),
      },
      {
        group: '简历章节 / Resume Sections',
        icon: 'fas fa-paper-plane',
        title: '05 · 合作与联系方式',
        sub: '#contact',
        keywords: 'contact hire 联系 合作',
        action: () => scrollToSection('#contact'),
      },

      {
        group: '全站专页与文章 / Site & Guides',
        icon: 'fas fa-newspaper',
        title: '进入博客归档专页 (/blog)',
        sub: 'Page',
        keywords: 'blog all posts 全部文章 博客列表',
        action: () => {
          window.location.href = '/blog'
        },
      },
      {
        group: '全站专页与文章 / Site & Guides',
        icon: 'fas fa-layer-group',
        title: '进入项目作品库 (/projects)',
        sub: 'Page',
        keywords: 'projects archive 项目页',
        action: () => {
          window.location.href = '/projects'
        },
      },
      {
        group: '全站专页与文章 / Site & Guides',
        icon: 'fas fa-tags',
        title: '进入技术标签索引 (/tags)',
        sub: 'Page',
        keywords: 'tags 标签 分类',
        action: () => {
          window.location.href = '/tags'
        },
      },
      {
        group: '全站专页与文章 / Site & Guides',
        icon: 'fas fa-plug',
        title: 'WPS MCP Server 开源介绍与接入指南',
        sub: 'Guide',
        keywords: 'wps mcp claude typescript npm 表格',
        action: () => {
          window.location.href = '/blog/wps-mcp-server-guide'
        },
      },
      {
        group: '全站专页与文章 / Site & Guides',
        icon: 'fas fa-database',
        title: '2000万+ 配件数据分布式系统架构演进',
        sub: 'Architecture',
        keywords: 'postgresql redis elasticsearch 2000万 分布式 高并发',
        action: () => {
          window.location.href = '/blog/parts-database-architecture'
        },
      },
      {
        group: '全站专页与文章 / Site & Guides',
        icon: 'fas fa-brain',
        title: 'OH-MindMirror 心理镜像投射工具手记',
        sub: 'AI Native',
        keywords: 'oh mindmirror gemini 心理学 多模态',
        action: () => {
          window.location.href = '/blog/oh-mindmirror-intro'
        },
      },
      {
        group: '全站专页与文章 / Site & Guides',
        icon: 'fas fa-table',
        title: '基于 Next.js 16 与 Supabase 构建云表格 SaaS',
        sub: 'SaaS',
        keywords: 'nextjs supabase saas rls 云表格',
        action: () => {
          window.location.href = '/blog/cloud-sheet-saas-guide'
        },
      },

      {
        group: 'GitHub 开源仓库 / Repositories',
        icon: 'fab fa-github',
        title: 'Jim-purch/jim-wps-mcp-server (WPS MCP Server)',
        sub: 'GitHub',
        keywords: 'github repo wps mcp npm',
        action: () =>
          window.open('https://github.com/Jim-purch/jim-wps-mcp-server', '_blank', 'noopener'),
      },
      {
        group: 'GitHub 开源仓库 / Repositories',
        icon: 'fab fa-github',
        title: 'Jim-purch/websearch-wps-webhook (云表格快速查找 SaaS)',
        sub: 'GitHub',
        keywords: 'github repo websearch cloud sheet saas',
        action: () =>
          window.open('https://github.com/Jim-purch/websearch-wps-webhook', '_blank', 'noopener'),
      },
      {
        group: 'GitHub 开源仓库 / Repositories',
        icon: 'fab fa-github',
        title: 'Jim-purch/sheets2kdocs (Google Sheets → 金山文档同步)',
        sub: 'GitHub',
        keywords: 'github repo sheets2kdocs kdocs google sheets sync',
        action: () =>
          window.open('https://github.com/Jim-purch/sheets2kdocs', '_blank', 'noopener'),
      },
      {
        group: 'GitHub 开源仓库 / Repositories',
        icon: 'fab fa-github',
        title: 'Jim-purch/mac-voice-to-text (macOS 实时语音转文字)',
        sub: 'GitHub',
        keywords: 'github repo macos voice whisper swift',
        action: () =>
          window.open('https://github.com/Jim-purch/mac-voice-to-text', '_blank', 'noopener'),
      },
      {
        group: 'GitHub 开源仓库 / Repositories',
        icon: 'fab fa-github',
        title: 'Jim-purch/OH-MindMirror (AI 心理投射工具)',
        sub: 'GitHub',
        keywords: 'github repo oh mindmirror gemini',
        action: () =>
          window.open('https://github.com/Jim-purch/OH-MindMirror', '_blank', 'noopener'),
      },
      {
        group: 'GitHub 开源仓库 / Repositories',
        icon: 'fab fa-github',
        title: 'Jim-purch/telechat (Telegram 双通道语音机器人)',
        sub: 'GitHub',
        keywords: 'github repo telechat deepseek minimax telegram',
        action: () => window.open('https://github.com/Jim-purch/telechat', '_blank', 'noopener'),
      },
      {
        group: 'GitHub 开源仓库 / Repositories',
        icon: 'fab fa-github',
        title: 'Jim-purch/put-watermark-web (纯前端批量水印工具)',
        sub: 'GitHub',
        keywords: 'github repo watermark canvas docker',
        action: () =>
          window.open('https://github.com/Jim-purch/put-watermark-web', '_blank', 'noopener'),
      },
    ]

    let filtered = COMMANDS.slice()
    let activeIdx = 0

    function renderList() {
      listEl.innerHTML = ''
      if (!filtered.length) {
        const empty = document.createElement('div')
        empty.className = 'cmd-group-label'
        empty.style.padding = '1.5rem 1rem'
        empty.style.textAlign = 'center'
        empty.textContent = '未找到匹配指令 / No matching commands'
        listEl.appendChild(empty)
        return
      }

      let currentGroup = ''
      filtered.forEach((item, idx) => {
        if (item.group !== currentGroup) {
          currentGroup = item.group
          const label = document.createElement('div')
          label.className = 'cmd-group-label'
          label.textContent = currentGroup
          listEl.appendChild(label)
        }

        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'cmd-item' + (idx === activeIdx ? ' active' : '')
        btn.innerHTML = `
          <span class="cmd-item-left">
            <i class="${item.icon}"></i>
            <span>${item.title}</span>
          </span>
          <span class="cmd-item-sub">${item.sub}</span>
        `
        btn.addEventListener('mouseenter', () => {
          activeIdx = idx
          Array.from(listEl.querySelectorAll('.cmd-item')).forEach((el, i) => {
            el.classList.toggle('active', i === activeIdx)
          })
        })
        btn.addEventListener('click', () => {
          closePalette()
          item.action()
        })
        listEl.appendChild(btn)
      })
    }

    function openPalette() {
      backdrop.classList.add('open')
      input.value = ''
      filtered = COMMANDS.slice()
      activeIdx = 0
      renderList()
      setTimeout(() => input.focus(), 40)
    }

    function closePalette() {
      backdrop.classList.remove('open')
    }

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase()
      filtered = !q
        ? COMMANDS.slice()
        : COMMANDS.filter((c) =>
            (c.title + ' ' + c.keywords + ' ' + c.sub).toLowerCase().includes(q)
          )
      activeIdx = 0
      renderList()
    })

    if (triggerBtn) triggerBtn.addEventListener('click', openPalette)
    if (closeBtn) closeBtn.addEventListener('click', closePalette)
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePalette()
    })

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (backdrop.classList.contains('open')) {
          closePalette()
        } else {
          openPalette()
        }
        return
      }
      if (!backdrop.classList.contains('open')) return

      if (e.key === 'Escape') {
        e.preventDefault()
        closePalette()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (filtered.length) {
          activeIdx = (activeIdx + 1) % filtered.length
          renderList()
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (filtered.length) {
          activeIdx = (activeIdx - 1 + filtered.length) % filtered.length
          renderList()
        }
      } else if (e.key === 'Enter' && filtered[activeIdx]) {
        e.preventDefault()
        const selected = filtered[activeIdx]
        closePalette()
        selected.action()
      }
    })
  }

  /* 启动全部交互模块 */
  initPtsVectorField()
  initRoughAnnotations()
  initMatterSkillsSandbox()
  initCommandPalette()
})()
