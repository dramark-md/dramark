# 唱段

唱段是音乐剧剧本的核心。DraMark 使用 `$$` 标记唱段的开始和结束。

## 进入唱段

**语法**：独占一行的 `$$` 或 `$$ 标题文本`

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

标题存储在 `SongContainer.title` 字段中。

## 唱段内部规则

### 角色切换

在唱段内遇到 `@角色名` 不会退出唱段，仅切换演唱者：

```dramark
$$ 小帕饿饿歌
@小帕
= 哪里会有夜宵呢
Where to find a bite tonight?

---

小帕发现了躺着的小塔。

@小塔
什么情况
谁告诉我 这是 什么情况
难道是睡得太久
有些迷糊
$$
```

### 场景分隔

在唱段内，`---` 不会退出唱段，仅将表演状态切回 GlobalBlock：

```dramark
$$ 小帕饿饿歌
@小帕
= 哪里会有夜宵呢
Where to find a bite tonight?
= 到了夜里总是会突然肚子饿
It always happens in the midnight -- the hunger strikes

---

小帕发现了躺着的小塔。

@小帕 [惊喜地]
人类 人类
竟然是没见过的人类
$$
```

### 块级 Tech Cue

唱段内可以包含块级 Tech Cue：

```dramark
$$
@小塔
这怎么聊
不如问我 为何 这还不跑

@@
<<<
LX: SPOT_DUO 灯光变化同时打亮二人。
>>>

@小塔 @小帕
看着她 粉白色的脸｜$夜宵先生$
$$
```

## 退出唱段

### 显式退出

独占一行的 `$$`：

```dramark
$$ 小帕饿饿歌
@小帕
= 哪里会有夜宵呢
Where to find a bite tonight?
$$

回到普通对白模式。
```

### 隐式退出

根级别的 `#` 或 `##` 等级别标题会穿透 SongContainer。

## 行内唱段

在念白模式中使用 `$唱词$` 插入短促唱词：

```dramark
@小塔 @小帕
看着她 粉白色的脸｜$夜宵先生$
她 清澈的双眼｜$你为什么不说话$
我 无法移开视线｜$你从哪里来的呀$
```

**语义切换**：
- 在 GlobalBlock 中：`$...$` 表示**行内唱段**（`inline-song`）
- 在 SongContainer 中：`$...$` 表示**行内念白**（`inline-spoken`）

```dramark
@小塔 @小帕
回想她 轻灵的动作｜你为什么不说话
她 俏皮地诉说｜你从哪里来的呀
我饿了 饿了 饿了｜嘟嘟 小塔 咘咘
然后 我就被咬了｜{打断} $搭理我一下！$
$$
```

在上面的例子中，`$搭理我一下！$` 出现在 SongContainer 内，因此是行内念白。
