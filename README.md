# DraMark

**Dra**ma **Mark**down — 专为戏剧、影视及音乐剧剧本创作设计的纯文本标记语言。

## 核心目标

1. **少输入法切换 (Few IME Switch)** — 核心符号 `@`, `%`, `=` 在中文键盘下可直接通过 Shift 键打出，保证编剧创作心流不断
2. **状态机驱动 (State Machine Driven)** — 摒弃繁琐的闭合标签，通过极简的上下文状态推导台词、唱段和舞台动作的作用域
3. **原生译配支持 (Native Dual-track)** — 内建强大的双语译配工作流，一份源文件可编译为演员本、导演本、工作本
4. **技术与艺术解耦** — 将舞台监督的 Cue 标记与角色演出文本彻底分离

## 快速示例

```markdown
---
meta:
  title: 悲惨世界 (Les Misérables)
  locale: zh-CN
translation:
  enabled: true
  source_lang: en
  target_lang: zh-CN
  render: bilingual
casting:
  characters:
    - name: 冉阿让
      aliases: [24601]
  groups:
    principals:
      members: [冉阿让]
tech:
  mics:
    - id: HM1
      label: Hamlet 主麦
      color: "#4B8BFF"
  sfx:
    - id: SND_THUNDER
      file: thunder.mp3
      desc: 雷声
  lx:
    - id: LX01
      desc: 冷白顶光
      color: "#E6EEFF"
  keywords:
    - token: blackout
      label: 黑场
      color: "#111111"
---

@冉阿让
= Who am I?
我是谁？
= Can I conceal myself for evermore?
我能否永远把我自己隐藏？
假装我不再是过去的那个我？

---

警长贾维尔猛地推开了大门。

@贾维尔[怒吼]
你跑不掉了！{拔剑}

$$
@珂赛特
= In my life, there is so much I do not understand.
人生中有太多我不明白的事——
$$
```

## 核心语法速查

| 符号          | 用途                      | 示例                   |
| ------------- | ------------------------- | ---------------------- |
| `@角色名`     | 角色声明，进入台词模式    | `@哈姆雷特`            |
| `@A @B [情绪]`| 多角色声明（主名+别名）   | `@peter @bobby [aside]`|
| `---`         | 场景切分 / 重置为全局动作 | `---`                  |
| `% 注释`      | 行注释（译配注、直译）    | `% 直译：我是谁？`     |
| `= 原文`      | 译配模式：标记原文行      | `= To be or not to be` |
| `$$`          | 唱段容器（音乐剧）        | `$$ ... $$`            |
| `{动作}`      | 行内身体动作提示          | `给我出去！{指着门}`   |
| `<<LX01 GO>>` | 技术 Cue（灯光/音响）     | `<<SND: Thunder.mp3>>` |

## 与 CommonMark 的关系

DraMark 是 CommonMark 的超集方言。所有 CommonMark 格式（`*斜体*`、`**加粗**`、列表、引用等）完全保留。

Frontmatter 作为文档配置层存在，不属于 DraMark 正文语法本体；解析后通常交由前端/渲染器消费。

推荐配置命名空间：`meta`、`casting`、`translation`、`tech`。其中 `group` 仅在 `casting.groups` 定义，正文 `@` 不重复声明分组；`tech` 推荐使用 `mics/sfx/lx/keywords` 四类字典（同类内 `id` 唯一，未知字段可透传）。

兼容策略：默认不要求角色 `id`。在不重名场景下，`@角色` 匹配和 `casting.groups.*.members` 均可直接按 `name` 生效；仅在重名或跨系统关联时建议补 `id`。

## 规范文档

详见 [**DraMark Language Specification v1.0**](spec/spec.md)，包含：

- 二维状态机解析模型详解
- 完整的边缘情况裁决 (Edge Cases)
- 解析器实现指引
- 输入法与编辑器体验优化建议

## 许可证

[MIT](LICENSE)

Copyright (c) 2026 DraMark Contributors
