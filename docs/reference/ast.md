# AST 节点类型

DraMark 解析器在标准 MDAST（Markdown Abstract Syntax Tree）基础上扩展了以下自定义节点类型。

## 块级节点

### FrontmatterBlock

Frontmatter 块，包含原始 YAML 文本。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'frontmatter'` | 节点类型 |
| `value` | `string` | 原始 YAML 文本 |

### CharacterBlock

角色块，由 `@角色名` 声明触发。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'character-block'` | 节点类型 |
| `name` | `string` | 主角色名 |
| `names` | `string[]` | 所有角色名（含主名，支持多角色声明 `@A @B`） |
| `mood` | `string?` | 情绪/状态提示（如 `[惊喜地]`） |
| `children` | `DraMarkRootContent[]` | 子节点（台词内容） |

### TranslationPair

译配对，由 `= 原文` 触发。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'translation-pair'` | 节点类型 |
| `sourceText` | `string` | 原文（行内文本） |
| `target` | `Content[]` | 译文（块级节点数组） |
| `children` | `DraMarkRootContent[]` | 子节点 |

### SongContainer

唱段容器，由 `$$` 包裹。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'song-container'` | 节点类型 |
| `title` | `string?` | 唱段标题（如 `$$ My Shot` 中的 `My Shot`） |
| `children` | `DraMarkRootContent[]` | 子节点 |

### SpokenSegment

念白段落，由 `!!` 包裹，仅在 SongContainer 内有意义。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'spoken-segment'` | 节点类型 |
| `children` | `DraMarkRootContent[]` | 子节点 |

### BlockTechCue

块级技术提示，由 `<<< ... >>>` 包裹。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'block-tech-cue'` | 节点类型 |
| `value` | `string` | 提示内容原文 |
| `children` | `DraMarkRootContent[]?` | 可选子节点 |

### CommentLine

行注释，由行首 `%` 或行内 `␠%` 触发。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'comment-line'` | 节点类型 |
| `value` | `string` | 注释内容 |

仅在 `includeComments: true` 时出现在 AST 中。

### CommentBlock

块注释，由 `%%` 包裹。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'comment-block'` | 节点类型 |
| `value` | `string` | 注释内容 |

仅在 `includeComments: true` 时出现在 AST 中。

## 行内节点

行内节点注册在 MDAST 的 `PhrasingContentMap` 中，可出现在段落或台词的行内内容里。

### InlineAction

行内动作提示，由 `{}` 包裹。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'inline-action'` | 节点类型 |
| `value` | `string` | 动作描述 |

### InlineSongSegment

行内唱段（在念白模式中使用 `$唱词$`）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'inline-song'` | 节点类型 |
| `value` | `string` | 唱词内容 |

在 SongContainer 内，`$...$` 语义反转为行内念白（`inline-spoken`）。

### InlineSpokenSegment

行内念白（在唱段模式中使用 `$念白$`）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'inline-spoken'` | 节点类型 |
| `value` | `string` | 念白内容 |

### InlineTechCue

行内技术提示，由 `<<>>` 包裹。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'inline-tech-cue'` | 节点类型 |
| `value` | `string` | 提示内容 |

## 类型联合

```typescript
// 根级内容节点
type DraMarkRootContent =
  | Content              // 标准 MDAST 节点（段落、列表、标题等）
  | FrontmatterBlock
  | CharacterBlock
  | TranslationPair
  | SongContainer
  | SpokenSegment
  | BlockTechCue
  | CommentLine
  | CommentBlock;

// 行内节点（注册到 PhrasingContentMap）
// inline-action | inline-song | inline-spoken | inline-tech-cue
```

## 解析结果

```typescript
interface DraMarkParseResult {
  tree: DraMarkRoot;           // AST 根节点
  warnings: DraMarkWarning[];  // 解析警告列表
  metadata: DraMarkMetadata;   // 元数据
}

interface DraMarkMetadata {
  frontmatterRaw?: string;                  // Frontmatter 原始 YAML 文本
  translationEnabledFromFrontmatter: boolean; // 是否从 frontmatter 启用译配
  multipassDebug?: DraMarkMultipassDebugArtifacts; // 调试信息（需开启 multipassDebug）
}
```
