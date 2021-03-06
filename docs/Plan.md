# 开发计划

目前还在第一阶段，总体进度 20%

- [阶段 1：开发日历与计划两个核心模块（30%）](#阶段-1)
  - [Part 1：日历](#part-1：日历)
  - [Part 2：计划](#part-2：计划)
  - [Part 3：其他](#part-3：其他)
- [阶段 2：开发其他辅助模块（20%）](#阶段-2)
  - [Part 1：用户](#part-1：用户)
  - [Part 2：通知](#part-2：通知)
  - [Part 3：帮助](#part-3：帮助)
  - [Part 4：关于](#part-4：关于)
  - [Part 5：Logo](#part-5：Logo)
  - [Part 6：计划书](#part-6：计划书)
  - [Part 7：其他](#part-7：其他)
- [阶段 3：后端开发（40%）](#阶段-3)
  - [Part 1：数据库设计](#part-1：数据库设计)
  - [Part 2：API 设计](#part-2：API设计)
  - [Part 3：定时任务](#part-3：定时任务)
- [阶段 4：部署上线（10%）](#阶段-4)
  - [Part 1：单元测试](#part-1：单元测试)
  - [Part 2：压力测试](#part-2：压力测试)
  - [Part 3：系统优化](#part-3：系统优化)
  - [Part 4：增加监控](#part-4：增加监控)
  - [Part 5：开发后台管理系统](#part-5：开发后台管理系统)
  - [Part 6：部署上线](#part-6：部署上线)
- [阶段 5：移动端开发（100%）](#阶段-5)
  - [Part 1：学习课程](#part-1：学习课程)
  - [Part 2：移动端开发](#part-2：移动端开发)

## 阶段 1

🎉 **核心目标**：实现`日历`、`计划`（也就是日程管理）两大模块的基本功能与页面设计

### Part 1：日历

- [x] ‼️ 日历：从各日历网站上面找一些节日、调休等数据，作为 mock 数据
- [ ] ‼️ 日历：正确地展示日期、农历、节假日、调休、周数等基本信息
- [x] ‼️ 日历：支持常规的日期操作：修改年份、月份、跳转到今天
- [x] ‼️ 日历：页面布局美观
- [x] ‼️ 日历：节假日、工作日、休息日、调休状态等信息容易区分（通过样式）
- [x] ‼️ 日历：正确地展示今天的天气，以及未来一段时间的天气
- [x] ‼️ 日历：天气与日历联动，支持展示历史一段时间的天气
- [ ] ‼️ 日历：正确地展示用户的计划
- [ ] ‼️ 日历：支持在日历页对计划进行简单的编辑：日期、颜色、完成状态、其他一些重要属性

### Part 2：计划

- [x] ‼️ 计划：侧边栏、列表页、详情页的展示内容可以正确地联动
- [ ] ‼️ 计划：侧边栏除了系统设定的几个计划书（今天、最近 7 天、我的收藏、全部、已完成、垃圾桶），还支持用户自定义计划书并对其进行增删改操作（修改计划书名称、说明）
- [ ] ‼️ 计划：列表页支持常规的操作：增删改查、排序、编辑计划的重要属性
- [x] ‼️ 计划：列表页可以正确地对计划进行分组
- [x] ‼️ 计划：列表页可以正确地展示计划的状态
- [x] ‼️ 计划：详情页可以正确地展示计划的详情
- [x] ‼️ 计划：详情页支持常规的操作：删除、收藏、保存、修改计划详情、修改计划状态
- [ ] ‼️ 计划：增加模板：纪念日、清单、课程、任务、日记

### Part 3：其他

- [ ] 合并`日历`与`计划`在一个父路由下，日历模块合并到计划模块里。
- [ ] 丰富鼠标操作与键盘操作：增加不同组件的右键编辑功能，增加`ctrl + S` 保存任务的功能，增加鼠标悬停提示，支持拖动计划到其他计划书中。

## 阶段 2

🎉 **核心目标**：实现`用户`、`通知`、`帮助`、`关于`这 4 个辅助模块的基本功能与页面设计，并对`计划`模块增加一些与多用户场景有关的功能。

目标拆分：

### Part 1：用户

- [ ] ‼️ 用户：完成注册、登录、用户设置等页面
- [ ] ‼️ 用户：支持修改名称、头像、个人说明等个人信息
- [ ] ‼️ 用户：支持绑定手机号与邮箱
- [ ] 用户：支持绑定社交账号：微信、QQ、微博
- [ ] ‼️ 用户：支持简单的偏好设置：时间格式（24 小时/12 小时）、每周开始时间、对计划列表页的分组的排序、日历要素的显示（农历、节假日、调休、周数）、主题颜色
- [ ] 用户：支持复杂的偏好设置：语言、时区
- [ ] ‼️ 用户：请求用户定位以正确地显示本地天气，同时也支持修改城市
- [ ] 用户：支持定制系统主题（如春日、夏日、动漫、汽车等），相对应地各元素也要大改了（非极度无聊不做）

### Part 2：通知

- [ ] ‼️ 通知：基于各计划的提醒时间，主动在页面上提醒用户
- [ ] ‼️ 通知：区分任务提醒、系统提醒、已读提醒
- [ ] ‼️ 通知：对各提醒增加已读状态，设置已读后主动将通知移到已读列表

### Part 3：帮助

- [ ] ‼️ 帮助：设计帮助页面，对于不同模块，图文并茂地简单说明如何使用
- [ ] 帮助：对于新注册用户，增加引导功能，且允许跳过
- [ ] 帮助：可以在帮助模块里，重新触发引导功能
- [ ] ‼️ 帮助 + 关于：在底部添加评论功能，以降低用户提交意见或建议的门槛，两个模块里的评论区是同步的

### Part 4：关于

- [ ] ‼️ 关于：简单介绍一下自己：头像、名称、联系方式、技术栈、工作经历等（不就是简历吗）

### Part 5：Logo

- [ ] ‼️ Logo：是时候设计一个好的 Logo 了

### Part 6：计划书

下面有些功能，仅限于该计划书内有多个成员的时候才显示，如头像展示等。

- [ ] ‼️ 计划书：支持邀请成员，其中管理员可以看到邀请状态和进度。
- [ ] ‼️ 计划书：支持转让管理员，其中管理员可以看到转让状态，被邀请人可以收到通知，其他人没有任何提示
- [ ] ‼️ 计划书：支持退出计划书
- [ ] ‼️ 计划书：列表页增加公告板块
- [ ] ‼️ 计划书：支持更多的自定义设置：侧边栏颜色、侧边栏封面、列表页背景色、公告内容
- [ ] ‼️ 计划书：支持权限管理，基于 RBAC 模型，角色有 3 个（管理员、普通用户、计划创建者、计划参与者），不同角色对于不同的资源有着不同的权限
- [ ] ‼️ 计划书：支持对各计划书进行分组，以方便管理，并在侧边栏呈现
- [ ] ‼️ 计划书：支持对单独的计划分配成员
- [ ] ‼️ 计划书：列表页增加新的分组、“我的”开关，优先将与我有关的计划放在最上面。
- [ ] ‼️ 计划书：左侧栏显示成员头像，列表页和详情页均显示参与人头像
- [ ] ‼️ 计划书：增加操作日志页，记录每一次创建、编辑、完成、取消完成、删除的日期。
- [ ] 计划书：支持导出计划书为 excel 文件
- [ ] 计划书：支持导入 excel 计划书，需按照指定格式
- [ ] 计划书：支持其他日程管理 APP 的计划导入（这个要一个个定制，非特别无聊不做）

### Part 8：其他计划

- [ ] 计划：侧边栏增加标签组，可按照标签来对所有计划进行分组，个人计划书与多人计划书的同名标签要区分开。
- [ ] 计划：对计划增加分享状态，支持分享给他人（以导出图片或分享 URL 的方式），支持在列表页对分享的计划进行有效期的编辑，他人可以无需登录访问被分享的计划页。

## 阶段 3

🎉 **目标**：完成后端的数据库设计及 API 开发

### Part 1：数据库设计

计划：

- [ ] 计划：详情
- [ ] 计划-用户-角色

计划书组：

- [ ] 计划书组-用户
- [ ] 计划书组-计划书

计划书：

- [ ] 计划书：详情，包括管理员 ID、创建者 ID、管理员转让状态
- [ ] 计划书-用户-角色：包括邀请状态、分组 ID
- [ ] 计划书-角色-权限：
- [ ] 计划书-计划：
- [ ] 计划书-日志：

日志：

- [ ] 日志：详情

用户：

- [ ] 用户：详情
- [ ] 用户：偏好

日历：

- [ ] 日历：天气
- [ ] 日历：节气
- [ ] 日历：调休

通知：

- [ ] 通知：系统（所有人都会收到），如版本更新、新活动
- [ ] 通知：定向，通过“通知类型”区分是任务（如任务已经到时间了，任务被别人添加了说明），还是事件（如被添加到某个日记本、管理员被转让），还是其他系统通知（如提醒绑定邮箱）等等

评论：

- [ ] 评论：详情

权限管理（针对于计划书）

- [ ] 角色：详情，包括创建者、管理员、普通成员、任务负责人、任务成员
- [ ] 资源：详情，包括修改公告、邀请成员到计划书、为计划添加成员

### Part 2：API 设计

日历

- [ ] 日历：节气，GET，可缓存，返回所有数据
- [ ] 日历：调休，GET，可缓存，返回所有数据
- [ ] 日历：天气，GET，可缓存，返回前后一个月数据

通知

- [ ] 通知：查，GET，返回用户的所有通知（系统+定向）
- [ ] 通知：增，POST，仅限 Admin
- [ ] 通知：删，DELETE，仅限 Admin
- [ ] 通知：改，POST，仅限 Admin

用户

- [ ] 用户：增，POST
- [ ] 用户：删，DELETE，需校验用户是否还有多人协同的计划书，若有则要求先转让。
- [ ] 用户：查，GET
- [ ] 用户：改，POST，包括名称、个人说明
- [ ] 用户：添加头像图片，POST
- [ ] 用户：修改登录密码，POST
- [ ] 用户：修改登录 ID，POST，包括手机号与邮箱
- [ ] 用户：添加社交账号，POST，包括微信、QQ、微博
- [ ] 用户：修改个人偏好，POST，包括时间格式、每周开始时间、计划列表页的分组排序、日历要素的显示、时区、语言、城市、系统主题颜色、~~系统主题~~，此外，还有一些使用上的习惯，如列表页的排序规则、是否显示任务详情等。

评论（关于页 + 帮助页）

- [ ] 评论：增，POST
- [ ] 评论：删，DELETE
- [ ] 评论：查，GET，翻页接口

计划

- [ ] 计划：增，POST
- [ ] 计划：删，DELETE
- [ ] 计划：查，GET，批量接口
- [ ] 计划：改，POST，包括分享状态、完成状态、收藏状态等
- [ ] 计划：绑定计划书，POST
- [ ] 计划：添加成员，POST，需对计划书、权限、成员身份等进行多重校验。

计划书

- [ ] 计划书：增，POST
- [ ] 计划书：删，DELETE
- [ ] 计划书：查，GET，批量接口
- [ ] 计划书：改，POST，名称、说明、侧边栏颜色、主题色、侧边栏封面、列表页背景色、公告内容
- [ ] 计划书：添加侧边栏图片，POST
- [ ] 计划书：转让管理员，POST
- [ ] 计划书：发送邀请，POST
- [ ] 计划书：退出，POST，需校验用户角色是否是管理员。
- [ ] 计划书：查日志，GET
- [ ] 计划书：导出，POST
- [ ] 计划书：导入，POST

计划书组

- [ ] 计划书组：增，POST
- [ ] 计划书组：删，DELETE
- [ ] 计划书组：查，GET，批量接口
- [ ] 计划书组：改，POST，包括修改名称
- [ ] 计划书组：添加计划书，POST

### Part 3：定时任务

- [ ] 全国各地历史天气爬虫
- [ ] 全国各地未来天气爬虫

## 阶段 4

🎉 **目标**：成功部署上线

以下环节按必要性进行打分，最高 5 个 ★。

一开始的时候就直接部署到生产环境，然后再慢慢地完成单元测试、系统优化、监控、后台系统开发、压测。

### Part 1：单元测试

★★★★★：无论对于当前产品的质量，还是今后的迭代，都是十分必要的。

- [ ] 前端完成单元测试
- [ ] 后端完成单元测试

### Part 2：压力测试

★：该环节等量起来了再做吧。

- [ ] 前端完成压力测试
- [ ] 后端完成压力测试

### Part 3：系统优化

★★★★：考虑到个人服务器就那么点大小和性能，不做优化的话自己用着可能都不爽。当然，有些优化可以先不做，毕竟没有那么大的访问量，哈哈哈哈。

- [ ] 前端优化：减少 HTTP 请求次数、设置 HTTP 缓存、前端缓存图片、减少重定向、增加 loading 提示
- [ ] 后端优化：对于高频读+低频改的数据用 redis 缓存、部署 CDN

### Part 4：增加监控

★★★：对于系统稳定性而言还是比较有必要的。

- [ ] 前端增加心跳检测
- [ ] 后端增加心跳检测
- [ ] 部署定时任务的任务平台增加心跳检测

### Part 5：开发后台管理系统

★★：不开发个系统呢，也可以通过观察日志和数据库的使用情况，来看服务的状态，就是不太美观和直观。

- [ ] 前端开发：历史监控：基于 echarts 开发一个图即可，表示过去一年、一个月、一星期的用户增长情况、服务器使用情况（磁盘、CPU、内存）、各接口的访问情况、心跳接口每小时的反馈情况
- [ ] 后端开发：将心跳检测的结果保存在一张表里，以 API 的形式对外提供服务；对于关心的一些数据，单独开发 API 来提供。

### Part 6：部署上线

★★★★★：部署是肯定要部署的，否则给鬼用啊。

- [ ] 制定部署流程：由于是一个人的项目，就手动点好了，不用 Jenkisn。对于前端和后端，本地分别制作成 docker 镜像推送到私有源，然后再登录服务器，拉取镜像并运行容器。以后每次迭代时，都这么操作两次就可以了。

## 阶段 5

🎉 **目标**：基于 flutter 进行移动端开发，优先级是 小程序 > iOS > MacOS > Android > Windows。

小程序最轻最简单所以是第一个，最后是安卓和 Windows，是因为确实从来没用过安卓，至于 Windows 都有电脑了，用网页不好吗，不想开发……

### Part 1：学习课程

- [ ] 买个 Flutter 课程，跟着课程老师搭建开发环境、开发项目，变学习边看官方文档、学习 Dart 语法。该任务完成条件是学完并能够做出一个小 demo 。
- [ ] 买个小程序课程，同上，同步进行……

### Part 2：移动端开发

- [ ] 学完了，搞就完事了，用代码说话，闷头就是干。
