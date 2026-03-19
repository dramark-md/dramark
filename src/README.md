# DraMark Parser 开发文档

## 1. 文档定位

本文件描述的是当前仓库实现状态，而不是语言规范全文。

- 规范目标模型：Block Stack（见 `spec/spec.md`）
- 当前实现模型：micromark-only 集成 + DraMark multipass 管线
- 结论：当前实现已经覆盖大量语法能力，但尚未完整落地规范中的全部闭合与诊断规则

## 2. 当前状态（2026-03-20）

- 插件已切换为 micromark-only 集成路径（不再提供 `legacy` 模式开关）
- DraMark 采用**3-4 pass multipass** 架构（见下方“解析流水线”）
- `pnpm build`、`pnpm test:run` 已通过（6 files / 77 tests）

## 2.1 解析流水线（3-4 pass）

### 为什么必须 multipass

单遍解析无法同时满足以下规范约束：

1. 代码保护区优先（Code Sanctuary Priority）
2. 行内 Tech Cue 词法抢占（避免 `<<...>>` 被 CommonMark HTML/文本路径吞掉）
3. Block Stack 的确定性闭合顺序
4. CommonMark 内容块保真（list/blockquote/code 等结构不丢失）

多遍解析的目标不是“多跑几次”，而是把上述冲突分层处理，防止互相吞噬。

### 每一遍做什么

1. Pass 1（micromark 标记）
  - 输入：原始文本
  - 输出：带有行内词法边界信息的 parse 上下文
  - 作用：优先标记 `<<...>>`、`$...$`、`{...}` 这类容易被 CommonMark 抢占的符号

2. Pass 2（DraMark 标记/保护/结构解析）
  - 输入：原始文本 + pass1 词法边界约束
  - 输出：DraMark 结构段（song/character/translation/comment/tech-cue 等）与 Block Stack 操作结果
  - 作用：执行 root-level 触发规则、闭合顺序、角色独占行校验、译配上下文规则

3. Pass 3（micromark/CommonMark 解析）
  - 输入：结构段内 markdown 内容
  - 输出：标准 mdast 内容块
  - 作用：保证 CommonMark 结构保真，而不是把内容都降级成 text/paragraph

4. Pass 4（DraMark 还原保护块，可选）
  - 输入：带占位符或受保护片段的中间树
  - 输出：还原后的最终 AST
  - 作用：恢复保护区字面量并保证语义节点不被保护机制污染

### 失败模式（为什么不能退化为单遍）

1. `<<...>>` 被 CommonMark 路径吞掉，Tech Cue 漏识别
2. 代码块内符号误触发 DraMark 指令
3. `Song/Character/Translation` 闭合顺序错误导致 AST 漂移
4. list/blockquote 等内容块结构损坏

## 3. 目录结构

- `errors.ts`
  - `DraMarkParseError`、`defaultOptions`、`warningToError`
- `types.ts`
  - 自定义 AST 节点与 warning 类型
- `parser.ts`
  - DraMark multipass 结构解析主流程（scan + block-stack assemble）
- `inline-markers.ts`
  - 行内 marker 变换（含 `inline-spoken`）
- `m2-extensions.ts`
  - micromark 行内扩展与 from-markdown bridge
- `index.ts`
  - remark 插件入口
- `core/`
  - frontmatter 归一化、诊断映射、outline、view-model

## 4. 对外 API

### 4.1 parseDraMark

输入字符串，返回：

- `tree`
- `warnings`
- `metadata`
  - `frontmatterRaw?: string`
  - `translationEnabledFromFrontmatter: boolean`

说明：

- 解析器只透传 frontmatter 原文并做最小开关判定
- frontmatter schema 校验与外部配置拉取不在 parser 语法层完成

### 4.2 remark 插件

- 默认导出：`remarkDraMark`

行为：

- 固定走 micromark 集成路径（不再切换 legacy）
- 保持 mdast 主树不被覆盖
- 通过 `file.data.dramark` 输出 DraMark warnings/metadata（以及 multipass 集成信息）

### 4.3 strictMode

- `parseDraMark`：不会抛错，只返回 warnings
- `remarkDraMark`：`strictMode=true` 时，遇到 warnings 抛首条错误

## 5. 语法支持矩阵（实现视角）

### 5.1 已支持

- frontmatter 提取与原文透传
- `@角色`、多角色声明、`[]/【】` 情绪解析
- `---` / `***` / `___` 重置
- 根级 heading 识别与 song 穿透退出
- `$$` 与 `$$ 标题`
- `!!`（仅在 song 内有效）
- `= 原文` 译配源行（角色上下文 + translation enabled）
- `=` 显式退出译配
- `%` 行注释、`%%...%%` 块注释
- `<<<...>>>`（单行）与 `<<<`...`>>>` / `<<<`...`<<<`（多行闭合）
- 行内 `{...}` / `｛...｝`、`$...$`、`<<...>>`
- `inline-spoken`：song 上下文下 `$...$` 转为 `inline-spoken`
- root-level 指令门禁（缩进行不触发 DraMark 指令）
- `@@` 显式退出角色模式
- 角色声明独占行校验（`strict`）与兼容模式（`compat`）
- 引号角色名解析（`@"..."` / `@“...”`）

### 5.2 部分支持

- block-level micromark constructs 仍在迁移中（当前块级语义由 DraMark 结构 pass 提供）

### 5.3 尚未支持（规范条目）

- 外部 frontmatter 拉取 warning（如 `EXTERNAL_FRONTMATTER_*`）
- 完整 block-level micromark constructs（仍处于迁移阶段）

## 6. Warning 与诊断

当前 parser warning code：

- `UNCLOSED_BLOCK_COMMENT`
- `UNCLOSED_BLOCK_TECH_CUE`
- `UNCLOSED_SONG_CONTAINER`
- `TRANSLATION_OUTSIDE_CHARACTER`
- `CHARACTER_DECLARATION_NOT_STANDALONE`
- `INVALID_CHARACTER_NAME`
- `DEPRECATED_INLINE_CHARACTER_DECLARATION`
- `EXTERNAL_FRONTMATTER_FETCH_FAILED`
- `EXTERNAL_FRONTMATTER_PARSE_FAILED`

`core` 层可附加配置诊断（`CONFIG_*`），用于 frontmatter 归一化反馈。

## 7. 测试与命令

- `pnpm build`
- `pnpm test:run`
- `pnpm dev:web`
- `pnpm build:web`

测试文件：

- `src/tests/parser.test.ts`
- `src/tests/scan-segments.test.ts`
- `src/tests/edge-cases.test.ts`
- `src/tests/plugin.test.ts`
- `src/tests/core.test.ts`
- `src/tests/ham.test.ts`

## 8. 下一步（与 Block 模型对齐）

1. 将当前解析流程显式拆分为 pass 管线（pass1/2/3/4）并暴露可观测中间产物
2. 补齐 Tech Cue 闭合优先级边界测试（尤其是 `<<<\n<<<\n>>>`）
3. 在需要占位保护时实现显式 pass4 restore（保护块还原）
4. 将 block-level 能力逐步迁移到 micromark flow constructs
