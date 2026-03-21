# 配置参考

## Frontmatter 字段

### meta

作品元信息。

```yaml
meta:
  title: string          # 作品标题
  author: string         # 作者/改编者
  locale: string         # 默认语言区域，如 zh-CN
  version: string        # 文档版本
```

### casting

角色配置。

```yaml
casting:
  characters:
    - name: string       # 角色名
      actor: string      # 演员名（可选）
      mic: string        # 麦克风 ID（可选）
      aliases: string[]  # 别名列表（可选）
  groups:
    - name: string       # 分组名
      members: string[]  # 成员列表
```

### translation

译配配置。

```yaml
translation:
  enabled: boolean       # 是否开启译配模式
  source_lang: string    # 原文语言代码
  target_lang: string    # 目标语言代码
  render_mode: string    # 渲染模式：bilingual | source | target
```

### tech

技术配置。

```yaml
tech:
  mics:                  # 麦克风设备（保留字段，数组结构）
    - id: string
      label: string
      desc: string
  
  {category}:            # 动态分类（除 mics 外）
    color: string        # 显示颜色
    entries:             # 条目列表
      - id: string
        label: string
        desc: string
  
  color: string          # 默认 Tech Cue 颜色
```

### use_frontmatter_from

外部 Frontmatter 引用。

```yaml
use_frontmatter_from: string  # URL 或文件路径
```

## 解析器选项

### translationEnabled

是否启用译配模式。若 Frontmatter 已设置 `translation.enabled: true`，以此为准。默认 `false`。

### includeComments

是否在 AST 中包含注释节点（`comment-line`、`comment-block`）。默认 `false`。

### strictMode

严格模式。启用时，遇到警告会抛出 `DraMarkParseError`。默认 `false`。

### characterDeclarationMode

角色声明校验模式。

- `'strict'`（默认）：角色声明必须独占一行
- `'compat'`：兼容模式，允许行内角色声明（会产生 `DEPRECATED_INLINE_CHARACTER_DECLARATION` 警告）

### multipassDebug

是否输出多阶段解析的调试信息。开启后可在 `file.data.dramark.multipassDebug` 或 `result.metadata.multipassDebug` 中查看各 pass 的快照。默认 `false`。

### pass4Restore

是否执行 Pass 4 还原阶段（还原代码保护区中的占位符）。默认 `true`。

## 使用示例

### Node.js

```javascript
import { parseDraMark } from 'dramark';

const result = parseDraMark(source, {
  translationEnabled: true,
  includeComments: false,
  strictMode: false
});

console.log(result.tree);
console.log(result.warnings);
console.log(result.metadata);
```

### Unified / Remark

```javascript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDraMark from 'remark-dramark';

const result = await unified()
  .use(remarkParse)
  .use(remarkDraMark, {
    translationEnabled: true
  })
  .process(source);
```
