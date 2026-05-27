export interface DesignOption {
  id: string
  label: string
  description: string
  promptTemplate: string
  defaults: Record<string, string>
  preview?: Record<string, string>
}

export interface SliderConfig {
  min: number
  max: number
  step: number
  unit: string
  cssVar: string
  defaultValue: number
  promptLabel: (value: number) => string
  promptTemplate: (value: number) => string
}

export interface Dimension {
  id: string
  label: string
  category: 'visual' | 'component' | 'motion'
  controlType?: 'options' | 'slider'
  sliderConfig?: SliderConfig
  options: DesignOption[]
}

export const dimensions: Dimension[] = [
  // ========== 基础视觉 (9) ==========
  {
    id: 'color-bg', label: '背景色', category: 'visual',
    options: [
      { id: 'bg-white', label: '纯白', description: '干净、明亮的纯白背景', promptTemplate: '页面背景色使用纯白色 (#ffffff)。', defaults: { bg: '#ffffff' }, preview: { bg: '#ffffff' } },
      { id: 'bg-warm', label: '暖白', description: '略带暖调的米白背景', promptTemplate: '页面背景色使用暖白色 ({bg})，带有微妙的暖调。', defaults: { bg: '#faf8f5' }, preview: { bg: '#faf8f5' } },
      { id: 'bg-cool', label: '冷灰', description: '冷静克制的浅灰背景', promptTemplate: '页面背景色使用冷灰色 ({bg})，呈现理性克制的基调。', defaults: { bg: '#f4f6f9' }, preview: { bg: '#f4f6f9' } },
      { id: 'bg-dark', label: '深色', description: '深邃的暗色背景', promptTemplate: '页面背景色使用深色 ({bg})，营造沉浸式体验。', defaults: { bg: '#0f0f23' }, preview: { bg: '#0f0f23' } },
      { id: 'bg-custom', label: '自定义', description: '使用取色器自由选择背景色', promptTemplate: '页面背景色使用自定义颜色 ({bg})。', defaults: { bg: '#ffffff' }, preview: { bg: '#ffffff' } },
    ],
  },
  {
    id: 'color-primary', label: '主色调', category: 'visual',
    options: [
      { id: 'pri-blue', label: '蓝色', description: '经典科技蓝，适合企业级产品', promptTemplate: '主色调使用蓝色系 ({primary})，传递专业可信赖的品牌感。', defaults: { primary: '#0071e3' }, preview: { primary: '#0071e3' } },
      { id: 'pri-indigo', label: '靛蓝', description: '沉稳大气的靛蓝色', promptTemplate: '主色调使用靛蓝色 ({primary})，沉稳而不失现代感。', defaults: { primary: '#4f46e5' }, preview: { primary: '#4f46e5' } },
      { id: 'pri-green', label: '绿色', description: '自然活力绿，适合健康环保类', promptTemplate: '主色调使用绿色系 ({primary})，传递自然与活力的氛围。', defaults: { primary: '#16a34a' }, preview: { primary: '#16a34a' } },
      { id: 'pri-purple', label: '紫色', description: '创意紫，适合设计艺术类', promptTemplate: '主色调使用紫色 ({primary})，富有创意和艺术感。', defaults: { primary: '#7c3aed' }, preview: { primary: '#7c3aed' } },
      { id: 'pri-orange', label: '橙色', description: '热情橙，适合电商消费类', promptTemplate: '主色调使用橙色 ({primary})，温暖而有感染力。', defaults: { primary: '#ea580c' }, preview: { primary: '#ea580c' } },
      { id: 'pri-custom', label: '自定义', description: '使用取色器自由选择主色调', promptTemplate: '主色调使用自定义颜色 ({primary})。', defaults: { primary: '#0071e3' }, preview: { primary: '#0071e3' } },
    ],
  },
  {
    id: 'color-text', label: '文字色', category: 'visual',
    options: [
      { id: 'txt-dark', label: '深色文字', description: '高对比度的深灰文字', promptTemplate: '正文使用深灰色 ({text})，标题使用纯黑色，确保良好的可读性。', defaults: { text: '#1d1d1f' }, preview: { text: '#1d1d1f' } },
      { id: 'txt-soft', label: '柔和深灰', description: '稍柔和的深灰文字', promptTemplate: '文字色使用柔和的深灰色 ({text})，减轻长时间阅读的视觉疲劳。', defaults: { text: '#4a4a4f' }, preview: { text: '#4a4a4f' } },
      { id: 'txt-light', label: '浅色文字', description: '适用于深色背景的浅色文字', promptTemplate: '文字色使用浅色 ({text})，适合深色背景。', defaults: { text: '#f5f5f7' }, preview: { text: '#f5f5f7' } },
      { id: 'txt-custom', label: '自定义', description: '使用取色器自由选择文字色', promptTemplate: '文字色使用自定义颜色 ({text})。', defaults: { text: '#1d1d1f' }, preview: { text: '#1d1d1f' } },
    ],
  },
  {
    id: 'color-accent', label: '强调色', category: 'visual',
    options: [
      { id: 'acc-coral', label: '珊瑚红', description: '醒目的珊瑚红强调色', promptTemplate: '强调色使用珊瑚红 ({accent})，用于 CTA 按钮和关键信息突出。', defaults: { accent: '#ff6b6b' }, preview: { accent: '#ff6b6b' } },
      { id: 'acc-amber', label: '琥珀黄', description: '温暖的琥珀黄强调色', promptTemplate: '强调色使用琥珀黄 ({accent})，营造温暖而有活力的视觉焦点。', defaults: { accent: '#f59e0b' }, preview: { accent: '#f59e0b' } },
      { id: 'acc-cyan', label: '青色', description: '清爽的青色强调', promptTemplate: '强调色使用青色 ({accent})，清爽而富科技感。', defaults: { accent: '#06b6d4' }, preview: { accent: '#06b6d4' } },
      { id: 'acc-pink', label: '粉色', description: '时尚的粉色强调', promptTemplate: '强调色使用粉色 ({accent})，时尚且引人注目。', defaults: { accent: '#ec4899' }, preview: { accent: '#ec4899' } },
      { id: 'acc-custom', label: '自定义', description: '使用取色器自由选择强调色', promptTemplate: '强调色使用自定义颜色 ({accent})。', defaults: { accent: '#ff6b6b' }, preview: { accent: '#ff6b6b' } },
    ],
  },
  {
    id: 'font', label: '字体排版', category: 'visual',
    options: [
      { id: 'font-system', label: '系统默认', description: '使用操作系统原生字体，加载最快', promptTemplate: '使用系统默认字体栈：标题使用 -apple-system Bold，正文使用 system-ui sans-serif，字号 16px，行高 1.6。', defaults: {} },
      { id: 'font-inter', label: 'Inter', description: '现代几何无衬线字体', promptTemplate: '使用 Inter 字体：标题 Inter Bold {headingSize}，正文 Inter Regular {bodySize}，行高 1.6。从 Google Fonts 引入。', defaults: { headingSize: '28px', bodySize: '16px' } },
      { id: 'font-geist', label: 'Geist', description: 'Vercel 出品的现代字体', promptTemplate: '使用 Geist 字体：标题 Geist SemiBold，正文 Geist Regular，字号 16px，行高 1.6。', defaults: {} },
      { id: 'font-noto', label: 'Noto Sans SC', description: '思源黑体，中文显示优秀', promptTemplate: '使用 Noto Sans SC 字体：标题 Noto Sans SC Bold，正文 Noto Sans SC Regular，字号 16px，中文优化。', defaults: {} },
    ],
  },
  {
    id: 'dark-mode', label: '暗黑模式', category: 'visual',
    options: [
      { id: 'dm-auto', label: '跟随系统', description: '自动跟随系统设置切换', promptTemplate: '暗黑模式跟随系统 prefers-color-scheme 自动切换。', defaults: {} },
      { id: 'dm-light', label: '强制亮色', description: '始终使用亮色模式', promptTemplate: '强制使用亮色模式。', defaults: {} },
      { id: 'dm-dark', label: '强制暗色', description: '始终使用暗色模式', promptTemplate: '强制使用暗色模式，背景色为深色系，文字色为浅色系。', defaults: {} },
      { id: 'dm-toggle', label: '手动切换', description: '页面上提供切换按钮', promptTemplate: '在页面右上角提供暗黑模式手动切换按钮，默认跟随系统。', defaults: {} },
    ],
  },
  {
    id: 'border-radius', label: '圆角系统', category: 'visual', controlType: 'slider',
    sliderConfig: {
      min: 0, max: 32, step: 2, unit: 'px', cssVar: '--design-radius', defaultValue: 10,
      promptLabel: (v) => v === 0 ? '直角 (0px)' : v >= 28 ? '胶囊形' : `${v}px 圆角`,
      promptTemplate: (v) => v === 0 ? '全局使用直角 (0px)，呈现锐利干练的视觉风格。' : v >= 28 ? '按钮和卡片使用大圆角（近乎胶囊形），打造亲和友好的界面风格。' : `全局圆角使用 ${v}px，现代友好的视觉感受。`,
    },
    options: [],
  },
  {
    id: 'shadow', label: '阴影层级', category: 'visual', controlType: 'slider',
    sliderConfig: {
      min: 0, max: 20, step: 1, unit: '', cssVar: '--design-shadow', defaultValue: 4,
      promptLabel: (v) => v === 0 ? '扁平无阴影' : v <= 3 ? '浅阴影' : v <= 8 ? '中等阴影' : '深阴影',
      promptTemplate: (v) => v === 0 ? '使用扁平设计，不使用阴影，依靠边框和颜色区分层级。' : v <= 3 ? '使用轻微阴影提升关键元素（卡片、按钮），营造微妙的空间层次。' : v <= 8 ? '使用中等强度的阴影，卡片悬停时阴影加深并上浮，增强空间层次感。' : '使用较深的阴影效果，创造强烈的立体感和视觉冲击力。',
    },
    options: [],
  },
  {
    id: 'spacing', label: '间距系统', category: 'visual', controlType: 'slider',
    sliderConfig: {
      min: 4, max: 24, step: 2, unit: 'px', cssVar: '--design-spacing', defaultValue: 8,
      promptLabel: (v) => v <= 6 ? '紧凑间距' : v <= 12 ? '舒适间距' : '宽松间距',
      promptTemplate: (v) => v <= 6 ? `使用紧凑间距系统（基础单位 ${v}px），内容密度较高，适合数据密集型页面。` : v <= 12 ? `使用舒适间距系统（基础单位 ${v}px），内容呼吸感良好，适合大多数场景。` : `使用宽松间距系统（基础单位 ${v}px），大量留白，适合品牌展示和营销页面。`,
    },
    options: [],
  },

  // ========== 组件样式 (7) ==========
  {
    id: 'button', label: '按钮样式', category: 'component', controlType: 'options',
    options: [
      { id: 'btn-solid', label: '实心填充', description: '主色调填充的按钮', promptTemplate: '主要按钮使用实心填充样式，背景色为主色调，hover 时颜色加深 10%。', defaults: {} },
      { id: 'btn-outline', label: '描边按钮', description: '边框勾勒的按钮', promptTemplate: '主要按钮使用描边样式，边框 1.5px 主色调，hover 时填充主色调背景。', defaults: {} },
      { id: 'btn-ghost', label: '文字按钮', description: '无背景无边框的轻量按钮', promptTemplate: '使用轻量级文字按钮，hover 时显示浅色背景。', defaults: {} },
      { id: 'btn-gradient', label: '渐变按钮', description: '渐变填充的按钮', promptTemplate: '按钮使用主色调到强调色的渐变填充，hover 时渐变角度偏移，增加光泽感。', defaults: {} },
    ],
  },
  {
    id: 'card', label: '卡片样式', category: 'component',
    options: [
      { id: 'card-border', label: '边框卡片', description: '以边框分隔的卡片', promptTemplate: '卡片使用 1px 边框分隔，背景白色，padding {cardPadding}。', defaults: { cardPadding: '24px' } },
      { id: 'card-shadow', label: '阴影卡片', description: '以阴影抬升的卡片', promptTemplate: '卡片使用阴影抬升效果，hover 时阴影加深并轻微上浮 4px，过渡 0.3s。', defaults: {} },
      { id: 'card-glass', label: '玻璃态', description: '毛玻璃质感的卡片', promptTemplate: '卡片使用 backdrop-blur 玻璃态效果，半透明背景，适合现代设计风格。', defaults: {} },
      { id: 'card-flat', label: '扁平卡片', description: '极简无边框卡片', promptTemplate: '卡片采用极简扁平设计，无边框无阴影，仅依靠间距和排版区分内容。', defaults: {} },
    ],
  },
  {
    id: 'input', label: '输入框样式', category: 'component',
    options: [
      { id: 'inp-border', label: '边框式', description: '全边框输入框', promptTemplate: '输入框使用全边框，聚焦时边框变为强调色并显示外发光环。', defaults: {} },
      { id: 'inp-underline', label: '下划线式', description: '仅底部线条', promptTemplate: '输入框使用下划线样式，聚焦时下划线变粗并变为强调色。', defaults: {} },
      { id: 'inp-filled', label: '填充式', description: '灰底填充输入框', promptTemplate: '输入框使用浅灰背景填充，聚焦时背景变亮并显示底部强调色线条。', defaults: {} },
    ],
  },
  {
    id: 'nav', label: '导航样式', category: 'component',
    options: [
      { id: 'nav-top', label: '顶部固定', description: '固定在页面顶部的导航', promptTemplate: '导航栏固定在页面顶部，高度 64px，滚动时添加 backdrop-blur 模糊背景。', defaults: {} },
      { id: 'nav-side', label: '侧边导航', description: '固定在左侧的导航', promptTemplate: '使用侧边栏导航，宽度 240px，固定在左侧，适合后台管理系统。', defaults: {} },
      { id: 'nav-hamburger', label: '汉堡菜单', description: '移动端友好的汉堡菜单', promptTemplate: '使用汉堡菜单模式，移动端收起为汉堡图标，点击展开全屏导航面板。', defaults: {} },
    ],
  },
  {
    id: 'icons', label: '图标风格', category: 'component',
    options: [
      { id: 'icon-feather', label: 'Feather', description: '简洁线性图标', promptTemplate: '使用 Feather Icons，线性风格，stroke-width 1.5，尺寸 20px/24px。', defaults: {} },
      { id: 'icon-heroicons', label: 'Heroicons', description: 'Tailwind 团队出品', promptTemplate: '使用 Heroicons，提供 outline 和 solid 两种风格。', defaults: {} },
      { id: 'icon-lucide', label: 'Lucide', description: '活跃社区维护的图标库', promptTemplate: '使用 Lucide Icons，线性风格，社区活跃，图标数量丰富。', defaults: {} },
      { id: 'icon-none', label: '不使用图标', description: '纯文字界面', promptTemplate: '不使用图标库，采用纯文字 + 排版区分信息的极简风格。', defaults: {} },
    ],
  },
  {
    id: 'table', label: '表格样式', category: 'component',
    options: [
      { id: 'tbl-striped', label: '斑马纹', description: '交替行背景色', promptTemplate: '表格使用斑马纹交替行背景色，提升数据行的可读性。', defaults: {} },
      { id: 'tbl-lines', label: '水平分割线', description: '行间水平分割线', promptTemplate: '表格行之间使用水平分割线，表头与内容以较粗线条分隔。', defaults: {} },
      { id: 'tbl-clean', label: '无边框', description: '极简无边框表格', promptTemplate: '表格采用无边框极简设计，仅通过对齐和间距组织数据。', defaults: {} },
    ],
  },
  {
    id: 'badge', label: '标签徽章', category: 'component',
    options: [
      { id: 'badge-filled', label: '实心标签', description: '颜色填充的标签', promptTemplate: '标签使用实心填充样式，不同状态使用不同颜色（成功绿/警告黄/错误红/信息蓝）。', defaults: {} },
      { id: 'badge-outline', label: '描边标签', description: '边框勾勒的标签', promptTemplate: '标签使用描边样式，1px 边框，对应状态的颜色。', defaults: {} },
      { id: 'badge-dot', label: '圆点标签', description: '圆点 + 文字', promptTemplate: '标签使用圆点 + 文字的极简样式，圆点颜色对应状态。', defaults: {} },
    ],
  },

  // ========== 动效与交互 (7) ==========
  {
    id: 'hover', label: '悬停动效', category: 'motion',
    options: [
      { id: 'hover-lift', label: '上浮效果', description: '元素悬停时轻微上浮', promptTemplate: '可交互元素 hover 时向上浮起 4px，同时阴影加深，过渡时间 0.3s ease-out。', defaults: {} },
      { id: 'hover-scale', label: '缩放效果', description: '元素悬停时轻微放大', promptTemplate: '元素 hover 时 scale 放大至 1.05，过渡时间 0.2s ease-out。', defaults: {} },
      { id: 'hover-glow', label: '发光效果', description: '元素悬停时边缘发光', promptTemplate: '元素 hover 时添加 box-shadow 发光效果，颜色为主色调，过渡时间 0.3s。', defaults: {} },
      { id: 'hover-border', label: '边框变化', description: '悬停时边框颜色变化', promptTemplate: '元素 hover 时边框颜色过渡为主色调，配合轻微背景色变化，过渡时间 0.25s。', defaults: {} },
      { id: 'hover-none', label: '无动效', description: '悬停无动画', promptTemplate: '悬停时不使用动画效果，保持静态交互。', defaults: {} },
    ],
  },
  {
    id: 'click', label: '点击反馈', category: 'motion',
    options: [
      { id: 'click-ripple', label: '涟漪效果', description: 'Material Design 风格涟漪', promptTemplate: '按钮点击时从点击位置扩散圆形涟漪动画，持续 0.6s。', defaults: {} },
      { id: 'click-press', label: '按压缩放', description: '点击时短暂缩小', promptTemplate: '按钮点击时 scale 缩小至 0.95，释放后弹回，过渡时间 0.1s。', defaults: {} },
      { id: 'click-color', label: '颜色翻转', description: '点击时颜色瞬变', promptTemplate: '按钮点击时背景色和文字色瞬间翻转，提供即时的视觉反馈。', defaults: {} },
      { id: 'click-none', label: '无反馈', description: '点击无视觉反馈', promptTemplate: '点击时无特殊动画反馈。', defaults: {} },
    ],
  },
  {
    id: 'page-transition', label: '页面切换', category: 'motion',
    options: [
      { id: 'pt-fade', label: '淡入淡出', description: '经典的淡入淡出切换', promptTemplate: '页面切换使用淡入淡出效果，持续时间 0.3s，opacity 0 到 1。', defaults: {} },
      { id: 'pt-slide', label: '滑动切换', description: '页面从侧边滑入', promptTemplate: '页面切换使用从右向左滑动效果，translateX 30px 到 0，配合淡入，持续 0.4s。', defaults: {} },
      { id: 'pt-zoom', label: '缩放切换', description: '从小到大展开', promptTemplate: '页面切换使用缩放淡入效果，scale 0.95 到 1，opacity 0 到 1，持续 0.35s。', defaults: {} },
      { id: 'pt-none', label: '无切换动效', description: '页面直接切换', promptTemplate: '页面直接切换，不使用过渡动画。', defaults: {} },
    ],
  },
  {
    id: 'loading', label: '加载状态', category: 'motion',
    options: [
      { id: 'load-skeleton', label: '骨架屏', description: '内容占位骨架屏', promptTemplate: '加载中使用骨架屏占位，灰色块带 shimmer 动画，宽度匹配实际内容。', defaults: {} },
      { id: 'load-spinner', label: '旋转器', description: '经典旋转加载图标', promptTemplate: '加载中使用旋转动画图标，颜色为主色调，中心位置显示。', defaults: {} },
      { id: 'load-progress', label: '进度条', description: '顶部线性进度条', promptTemplate: '页面顶部显示线性进度条，颜色为主色调渐变色，加载完成后自动消失。', defaults: {} },
      { id: 'load-pulse', label: '脉冲效果', description: '内容区域脉冲闪烁', promptTemplate: '加载中内容区域使用脉冲闪烁效果（opacity 动画），模拟内容即将出现的预期感。', defaults: {} },
    ],
  },
  {
    id: 'finish-effect', label: '完成动效', category: 'motion',
    options: [
      { id: 'finish-bounce', label: '弹跳动画', description: '完成时弹跳一下', promptTemplate: '任务完成时目标元素执行弹跳动画（bounce），持续 0.6s，表达成功喜悦。', defaults: {} },
      { id: 'finish-check', label: '对勾绘制', description: '对勾描边动画', promptTemplate: '完成时显示 SVG 对勾描边动画，从 0 到完整路径绘制，持续 0.5s。', defaults: {} },
      { id: 'finish-confetti', label: '彩带效果', description: '彩色碎片散落', promptTemplate: '重大任务完成时触发彩带/纸屑散落动画，持续 1.5s，营造庆祝氛围。', defaults: {} },
      { id: 'finish-none', label: '无动效', description: '完成时无特殊动画', promptTemplate: '完成时无特殊动画效果。', defaults: {} },
    ],
  },
  {
    id: 'scroll-reveal', label: '滚动揭示', category: 'motion',
    options: [
      { id: 'sr-fade-up', label: '淡入上移', description: '元素进入视口时淡入上移', promptTemplate: '页面滚动时，元素进入视口触发淡入上移动画：opacity 0→1，translateY 20px→0，持续 0.6s。', defaults: {} },
      { id: 'sr-scale', label: '缩放淡入', description: '从小到正常大小', promptTemplate: '元素进入视口时从 scale 0.9 缩放到 1，配合淡入，持续 0.5s。', defaults: {} },
      { id: 'sr-stagger', label: '错开动画', description: '子元素依次出现', promptTemplate: '列表/卡片组中的子元素依次延迟出现，每个间隔 0.1s，营造流畅的序列感。', defaults: {} },
      { id: 'sr-none', label: '无动效', description: '无滚动动画', promptTemplate: '不使用滚动揭示动画，所有内容直接显示。', defaults: {} },
    ],
  },
  {
    id: 'micro-interaction', label: '微交互', category: 'motion',
    options: [
      { id: 'mi-shake', label: '输入抖动', description: '验证失败时输入框抖动', promptTemplate: '表单验证失败时输入框水平抖动（shake），持续 0.4s，提示用户注意。', defaults: {} },
      { id: 'mi-count', label: '数字跳动', description: '数值变化时跳动', promptTemplate: '数字变化时使用计数动画，从旧值跳动到新值，持续 0.5s。', defaults: {} },
      { id: 'mi-slide-in', label: '通知滑入', description: '通知从角落滑入', promptTemplate: '通知消息从右上角滑入，3s 后自动滑出，带淡入淡出效果。', defaults: {} },
      { id: 'mi-none', label: '无微交互', description: '不使用微交互', promptTemplate: '不使用特殊的微交互效果。', defaults: {} },
    ],
  },
]
