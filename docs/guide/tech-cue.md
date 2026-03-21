# 技术提示 (Tech Cue)

Tech Cue 用于表达技术调度信息（灯光、音效、麦克风等）。

## 形态概览

| 形态 | 类型 | 语法 | 说明 |
|------|------|------|------|
| **行内 Tech Cue** | Inline | `<<内容>>` | 标准 CommonMark，不跨行 |
| **单行块级 Tech Cue** | Block | `<<< 内容 >>>` | 独占一行，行尾闭合 |
| **多行块级 Tech Cue** | Block | `<<< [属性头]` ... `>>>` | 可包含行内 Tech Cue |

## 行内 Tech Cue

**语法**：`<<内容>>`

```dramark
# 02 相遇小帕

<<BGM_ENTER GO>> <<LX: SPOT_PARK 渐起>>
```

### 规则

- 必须在**同一物理行**内闭合
- 若未闭合，整段降级为普通文本
- 在代码保护区内失效

### 多组匹配

同一行多组 `<<` / `>>` 按**最近配对**规则：

```dramark
@小帕
晚上好呀夜宵先生。

@小塔
晚上好？夜宵？<<BGM_ENTER STOP>>
```

## 单行块级 Tech Cue

**语法**：`<<<` + 内容 + `>>>`（行尾闭合）

```dramark
小帕下。

<<< SFX 春去秋来 >>>
```

这会自动关闭不兼容的块，添加内容后立即关闭。

## 多行块级 Tech Cue

**开启**：`<<<` 或 `<<< 属性头`

**闭合**：`>>>`（主闭合）或 `<<<`（对称回退）

```dramark
<<<
LX: SPOT_DUO 灯光变化同时打亮二人。
>>>
```

### 属性头

可选的属性头用于分类：

```dramark
<<< LX
SPOT_PARK 渐起
SPOT_XIAOTA 跟随
>>>
```

### 闭合优先级

1. `>>>` 主闭合（优先级更高）
2. `<<<` 对称回退闭合（仅当未匹配到 `>>>` 时）

### 内部嵌套

- 允许包含**行内 Tech Cue**
- 禁止嵌套块级 Tech Cue（遇到 `<<<` 视为内容）

## Frontmatter 配置

定义 Tech Cue 分类和颜色：

```yaml
---
tech:
  mics:
    - id: B1
    - id: B2
    - id: B3
  sfx:
    color: "#66ccff"
    entries:
      - id: BGM_ENTER
        desc: 入场音乐
      - id: BGM_PARK_NIGHT
        desc: 夜晚公园主题
      - id: SFX_THUD
        desc: 手刀敲击声
  lx:
    color: "#ff66cc"
    entries:
      - id: SPOT_PARK
        desc: 公园环境光
      - id: SPOT_XIAOTA
        desc: 小塔独光
      - id: SPOT_DUO
        desc: 双人光区
---
```

匹配规则：取首词，优先匹配分类名，其次匹配 entry id。

## 使用场景

### 灯光提示

```dramark
<<BGM_ENTER GO>> <<LX: SPOT_PARK 渐起>>

<<<
LX: SPOT_DUO 灯光变化同时打亮二人。
>>>
```

### 音效提示

```dramark
<<SFX: SFX_THUD>> 小帕手刀敲小塔，小塔被吓一跳。
```

### 场景背景音乐

```dramark
小塔行礼。<<BGM_PARK_NIGHT GO>>

@小帕
别急！再多聊聊嘛，我从来没见过你，怎么进来的？<<BGM_PARK_NIGHT GO>>
```

## 注释支持

TechCueBlock 内允许完整注释语法：

```dramark
<<<
LX: SPOT_PARK % 这是公园环境光
SFX: BGM_ENTER % 入场音乐
>>>
```
