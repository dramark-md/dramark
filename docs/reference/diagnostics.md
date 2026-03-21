# 诊断码参考

DraMark 解析器在解析过程中可能产生以下诊断信息。

## 警告码列表

| 诊断码 | 说明 |
|--------|------|
| `UNCLOSED_SONG_CONTAINER` | 文档结束时存在未闭合的 `$$` 唱段容器 |
| `UNCLOSED_BLOCK_TECH_CUE` | 存在未闭合的块级 Tech Cue（`<<<`） |
| `UNCLOSED_BLOCK_COMMENT` | 存在未闭合的块注释（`%%`） |
| `TRANSLATION_OUTSIDE_CHARACTER` | 译配标记 `=␠` 出现在角色块外 |
| `CHARACTER_DECLARATION_NOT_STANDALONE` | 角色声明行包含非附着内容（如普通台词） |
| `INVALID_CHARACTER_NAME` | 角色名为空或无效 |
| `DEPRECATED_INLINE_CHARACTER_DECLARATION` | 使用已弃用的行内角色声明语法（在 `strict` 模式下） |
| `EXTERNAL_FRONTMATTER_FETCH_FAILED` | 无法拉取 `use_frontmatter_from` 指向的外部资源 |
| `EXTERNAL_FRONTMATTER_PARSE_FAILED` | 外部 Frontmatter 拉取成功但 YAML 解析失败 |

## 诊断码详情

### UNCLOSED_SONG_CONTAINER

文档结束时存在未闭合的 `$$` 唱段。

```dramark
$$ 小帕饿饿歌
@小帕
= 哪里会有夜宵呢
Where to find a bite tonight?
% 缺少闭合的 $$
```

### UNCLOSED_BLOCK_TECH_CUE

存在未闭合的块级 Tech Cue。

```dramark
<<<
LX: SPOT_DUO 灯光变化同时打亮二人。
% 缺少闭合的 >>> 或 <<<
```

### UNCLOSED_BLOCK_COMMENT

存在未闭合的块注释。

```dramark
%%
注释内容
% 缺少闭合的 %%
```

### TRANSLATION_OUTSIDE_CHARACTER

译配标记 `=␠` 出现在角色块外。

```dramark
= 哪里会有夜宵呢  % 警告：不在 @角色 块内
Where to find a bite tonight?
```

### CHARACTER_DECLARATION_NOT_STANDALONE

角色声明行包含非附着内容（普通对白文本）。

```dramark
@小帕 真好喝！  % 警告：@ 后不应跟普通台词
```

正确写法：

```dramark
@小帕
真好喝！
```

### INVALID_CHARACTER_NAME

角色名为空或无效。

```dramark
@   % 警告：空角色名
```

### DEPRECATED_INLINE_CHARACTER_DECLARATION

使用了已弃用的行内角色声明语法。在 `characterDeclarationMode: 'strict'`（默认）下会产生警告。

### EXTERNAL_FRONTMATTER_FETCH_FAILED

无法拉取 `use_frontmatter_from` 指向的外部资源（网络超时、URL 无效等）。

### EXTERNAL_FRONTMATTER_PARSE_FAILED

外部 Frontmatter 拉取成功但 YAML 解析失败。

## 在代码中处理诊断

```javascript
import { parseDraMark } from 'dramark';

const result = parseDraMark(source);

// 检查警告
for (const warning of result.warnings) {
  console.log(`${warning.code}: ${warning.message}`);
  console.log(`  at line ${warning.line}, column ${warning.column}`);
}

// 严格模式：第一个警告会作为 DraMarkParseError 抛出
try {
  const strictResult = parseDraMark(source, { strictMode: true });
} catch (err) {
  console.error(err.code, err.message);
}
```
