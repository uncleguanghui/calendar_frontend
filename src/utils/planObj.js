import moment from "moment";

export default function(plan) {
  var obj = new Object();

  // 基础属性
  obj.id = plan.id;
  obj.groupId = plan.groupId;
  obj.title = plan.title;
  obj.star = plan.star;
  obj.advancedDays = plan.advancedDays;
  obj.alarmTime = plan.alarmTime;
  obj.typeId = plan.typeId;
  obj.status = plan.status;
  obj.position = plan.position;
  obj.level = plan.level;
  obj.tags = plan.tags;
  obj.backgroundColor = plan.backgroundColor;
  obj.description = plan.description;
  obj.attachments = plan.attachments;
  obj.start = plan.start;
  obj.end = plan.end;
  obj.allDay = plan.allDay;
  obj.isDeleted = plan.isDeleted;
  obj.subTasks = plan.subTasks;
  obj.finish = plan.finish;

  // 附加属性
  obj.startDate = moment(obj.start); // 开始时间
  obj.endDate = moment(obj.end); // 结束时间
  obj.finishDate = moment(obj.finish); // 完成时间
  // 时间字符串（如："true__2020-01-01 10:10:10__2020-01-02 20:20:20" 或 "true__2020-01-01 10:10:10" 或 ""）
  if (obj.allDay !== null && obj.start) {
    obj.time = obj.allDay + "__" + obj.start;
    if (obj.end) {
      obj.time += "__" + obj.end;
    }
  } else {
    obj.time = "";
  }
  // 提醒字符串（如："3 9:00" 或 ""）
  if (obj.advancedDays !== null && obj.alarmTime) {
    obj.alarm = obj.advancedDays + " " + obj.alarmTime;
  } else {
    obj.alarm = "";
  }

  // 计算函数
  // 已过期：状态为0，且结束时间早于今天0点（如果没有结束时间，则开始时间早于今天0点）
  obj.isExpired = function() {
    const today0 = moment().startOf("day");
    return (
      obj.status === 0 &&
      ((obj.endDate._isValid && obj.endDate < today0) ||
        (!obj.endDate._isValid &&
          obj.startDate._isValid &&
          obj.startDate < today0))
    );
  };
  // 已完成：状态为1
  obj.isFinished = function() {
    return obj.status === 1;
  };
  // 进行中：状态为0，且结束时间晚于今天0点（如果没有结束时间，则开始时间晚于今天0点）
  obj.isGoing = function() {
    const today0 = moment().startOf("day");
    return (
      obj.status === 0 &&
      ((obj.endDate._isValid && obj.endDate >= today0) ||
        (!obj.endDate._isValid &&
          obj.startDate._isValid &&
          obj.startDate >= today0))
    );
  };

  // 分组
  // 属于今天分组：未删除，且开始时间在今天0点~明天0点（或结束时间/完成时间在这个范围）
  obj.belongToday = function() {
    const today0 = moment().startOf("day");
    const tomorrow0 = moment()
      .startOf("day")
      .add(1, "days");
    return (
      !obj.isDeleted &&
      ((obj.endDate._isValid &&
        obj.endDate >= today0 &&
        obj.endDate < tomorrow0) ||
        (obj.startDate._isValid &&
          obj.startDate >= today0 &&
          obj.startDate < tomorrow0) ||
        (obj.finishDate._isValid &&
          obj.finishDate >= today0 &&
          obj.finishDate < tomorrow0))
    );
  };
  // 属于最近分组：未删除，且开始时间在今天0点~7天后的0点（或结束时间/完成时间在这个范围）
  obj.belongRecent = function() {
    const today0 = moment().startOf("day");
    const future0 = moment()
      .startOf("day")
      .add(7, "days");
    return (
      !obj.isDeleted &&
      ((obj.endDate._isValid &&
        obj.endDate >= today0 &&
        obj.endDate < future0) ||
        (obj.startDate._isValid &&
          obj.startDate >= today0 &&
          obj.startDate < future0) ||
        (obj.finishDate._isValid &&
          obj.finishDate >= today0 &&
          obj.finishDate < future0))
    );
  };
  // 属于收藏分组：未删除，且状态为收藏
  obj.belongStar = function() {
    return !obj.isDeleted && obj.star;
  };
  // 属于全部分组：未删除
  obj.belongAll = function() {
    return !obj.isDeleted;
  };
  // 属于已完成分组：未删除，且状态为已完成
  obj.belongFinished = function() {
    return !obj.isDeleted && obj.isFinished();
  };
  // 属于已删除分组：已删除
  obj.belongTrash = function() {
    return obj.isDeleted;
  };

  return obj;
}
