# 译配模式

DraMark 内建强大的双语译配工作流，支持原文与译文配对显示。

## 启用译配模式

通过 Frontmatter 启用：

```yaml
---
translation:
  source_lang: zh-CN
  target_lang: en
---
```

## 进入译配

**语法**：`=␠<原文>`（等号后必须跟一个空格）

```dramark
$$ 小帕饿饿歌
@小帕
= 哪里会有夜宵呢
Where to find a bite tonight?
= 哪里有好吃的呢
Where's the tasty in my sight?
= 到了夜里总是会突然肚子饿
It always happens in the midnight -- the hunger strikes
= 便利店已经关门
The stores are closed, I tried the door
= 公园里也没有人
The park is empty, searched the floor
= 我该去哪里找好吃的夜宵呢
Where can I turn to find the snack I am craving more?
$$
```

## 内容结构

TranslationPair 包含：

- `sourceText`：行内文本（原文）
- `target`：块级节点数组（译文）

译文可以包含多段落、列表等复杂结构：

```dramark
@小帕
= 哪里会有夜宵呢
Where to find a bite tonight?
= 哪里有好吃的呢
Where's the tasty in my sight?
```

## 隐式闭合触发

以下条件自动闭合当前 TranslationPair：

- 新的 `=␠`（下一句原文开始）
- `@`（切换角色）
- `$$`（进入唱段）
- `<<<`（进入块级 Tech Cue）
- `---` 或 `#`（根级别结构标记）
- EOF（文档结束）

## 显式退出

**语法**：独占一行的 `=`

```dramark
@小帕
= 哪里会有夜宵呢
Where to find a bite tonight?
=
（无需再配对，直接回到普通对白模式）
```

## 词法约束

| 形式 | 含义 |
|------|------|
| `=␠` | 译配起始（等号+空格+原文） |
| `=`（独占一行） | 译配退出 |
| 普通文本中的 `=` | 按字面文本保留 |

## 完整示例

以下节选自 [《在公园的长椅上睡大觉》](/examples/showcase)：

```dramark
---
translation:
  source_lang: zh-CN
  target_lang: en
casting:
  characters:
    - name: 小帕
      aliases: [帕]
      mic: B1
---

$$ 小帕饿饿歌
@小帕
= 哪里会有夜宵呢
Where to find a bite tonight?
= 哪里有好吃的呢
Where's the tasty in my sight?
= 到了夜里总是会突然肚子饿
It always happens in the midnight -- the hunger strikes
= 便利店已经关门
The stores are closed, I tried the door
= 公园里也没有人
The park is empty, searched the floor
= 我该去哪里找好吃的夜宵呢
Where can I turn to find the snack I am craving more?
$$
```

## 注意事项

1. **必须在角色内**：译配对必须在 CharacterBlock 内才有效
2. **空格要求**：`=␠` 等号后必须跟空格
3. **原文单行**：sourceText 是行内文本，不支持多段落
4. **译文丰富**：target 支持任意 CommonMark 块级内容
