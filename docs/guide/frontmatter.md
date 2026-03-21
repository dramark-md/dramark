# Frontmatter 配置

DraMark 文档可由 YAML Frontmatter 块开头，用于提供剧本配置数据。

## 基本结构

```dramark
---
meta:
  title: 在公园的长椅上睡大觉
  author: 小橘猫_zzz
  locale: zh-CN
---
```

Frontmatter 必须位于文档开头，以 `---` 开始和结束。

## 推荐字段

### meta - 元信息

```yaml
meta:
  title: 在公园的长椅上睡大觉    # 作品标题
  author: 小橘猫_zzz              # 作者/改编者
  locale: zh-CN                   # 默认语言区域
```

### casting - 角色配置

```yaml
casting:
  characters:
    - name: 小帕
      aliases: [帕]
      mic: B1
    - name: 小塔
      aliases: [塔]
      mic: B2
    - name: 小柴
      aliases: [柴]
      mic: B3
```

### translation - 译配配置

```yaml
translation:
  source_lang: zh-CN              # 原文语言
  target_lang: en                 # 目标语言
```

### tech - 技术配置

```yaml
tech:
  mics:                           # 麦克风配置
    - id: B1
    - id: B2
    - id: B3
  
  sfx:                            # 音效分类
    color: "#66ccff"
    entries:
      - id: BGM_ENTER
        desc: 入场音乐
      - id: BGM_PARK_NIGHT
        desc: 夜晚公园主题
      - id: SFX_THUD
        desc: 手刀敲击声
  
  lx:                             # 灯光分类
    color: "#ff66cc"
    entries:
      - id: SPOT_PARK
        desc: 公园环境光
      - id: SPOT_XIAOTA
        desc: 小塔独光
      - id: SPOT_DUO
        desc: 双人光区
```

### use_frontmatter_from - 外部配置

支持引用外部 YAML 文件作为配置基线：

```yaml
---
use_frontmatter_from: https://example.com/show/frontmatter.yaml
meta:
  title: 本地覆盖标题  # 这会覆盖外部配置中的 title
---
```

**合并策略**：
1. 读取外部文档作为基线配置
2. 将当前文档 Frontmatter 作为覆盖层
3. 对象字段按 key 递归覆盖
4. 数组字段默认整段替换（不做隐式拼接）

## 完整示例

以下节选自 [《在公园的长椅上睡大觉》](/examples/showcase)的 Frontmatter：

```yaml
---
meta:
  title: 在公园的长椅上睡大觉
  author: 小橘猫_zzz
  locale: zh-CN
translation:
  source_lang: zh-CN
  target_lang: en
casting:
  characters:
    - name: 小帕
      aliases: [帕]
      mic: B1
    - name: 小塔
      aliases: [塔]
      mic: B2
    - name: 小柴
      aliases: [柴]
      mic: B3
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

## 自定义字段

所有字段都是可选的，你可以添加任意自定义字段，解析器会透传这些字段供上层应用使用：

```yaml
---
my_app:
  custom_setting: value
  another_config: true
---
```
