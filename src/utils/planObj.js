import dateFormat from "./dateFormat";

export default function(plan) {
  var obj = new Object();

  // 基础属性
  obj.id = plan.id;
  obj.groupId = plan.groupId;
  obj.title = plan.title;
  obj.star = plan.star;
  obj.alarmStrategy = plan.alarmStrategy;
  obj.typeId = plan.typeId;
  obj.status = plan.status;
  obj.allDay = plan.allDay;
  obj.position = plan.position;
  obj.level = plan.level;
  obj.tags = plan.tags;
  obj.backgroundColor = plan.backgroundColor;
  obj.description = plan.description;
  obj.attachments = plan.attachments;
  obj.start = plan.start;
  obj.end = plan.end;
  obj.isDeleted = plan.isDeleted;
  obj.subTasks = plan.subTasks;

  // 附加属性
  obj.startString = dateFormat("m月d日", new Date(obj.start));
  obj.endString = dateFormat("m月d日", new Date(obj.end));
  obj.startDate = new Date(obj.start); //开始时间
  obj.endDate = new Date(obj.end); //结束时间
  obj.finishDate = obj.finish ? new Date(obj.finish) : undefined; //完成时间

  // 计算函数
  obj.isExpired = function() {
    return obj.status === 0 && obj.endDate <= new Date();
  };
  obj.isFinished = function() {
    return obj.status === 1;
  };
  obj.isFinishedToday = function() {
    if (obj.isFinished()) {
      const today0 = new Date(new Date().setHours(0, 0, 0, 0)); // 今天0点
      const tomorrow0 = new Date(today0).setDate(today0.getDate() + 1); // 明天0点
      return (
        (obj.endDate >= today0 && obj.endDate < tomorrow0) ||
        (obj.finishDate &&
          obj.finishDate >= today0 &&
          obj.finishDate < tomorrow0)
      );
    } else {
      return false;
    }
  };
  obj.isFinishedRecent = function() {
    if (obj.isFinished()) {
      const today0 = new Date(new Date().setHours(0, 0, 0, 0)); // 今天0点
      const future0 = new Date(today0).setDate(today0.getDate() + 7); // 7天后的0点
      return (
        (obj.endDate >= today0 && obj.endDate < future0) ||
        (obj.finishDate && obj.finishDate >= today0 && obj.finishDate < future0)
      );
    } else {
      return false;
    }
  };
  obj.isGoing = function() {
    return obj.status === 0 && obj.endDate > new Date();
  };
  obj.isGoingToday = function() {
    if (obj.isGoing()) {
      const today0 = new Date(new Date().setHours(0, 0, 0, 0)); // 今天0点
      const tomorrow0 = new Date(today0).setDate(today0.getDate() + 1); // 明天0点
      return !(obj.startDate > tomorrow0);
    } else {
      return false;
    }
  };
  obj.isGoingRecent = function() {
    if (obj.isGoing()) {
      const today0 = new Date(new Date().setHours(0, 0, 0, 0)); // 今天0点
      const future0 = new Date(today0).setDate(today0.getDate() + 7); // 7天后的0点
      return !(obj.startDate > future0);
    } else {
      return false;
    }
  };
  obj.belongToday = function() {
    return (
      !obj.isDeleted &&
      (obj.isExpired() || obj.isFinishedToday() || obj.isGoingToday())
    );
  };
  obj.belongRecent = function() {
    return (
      !obj.isDeleted &&
      (obj.isExpired() || obj.isFinishedRecent() || obj.isGoingRecent())
    );
  };
  obj.belongStar = function() {
    return !obj.isDeleted && obj.star;
  };
  obj.belongFinished = function() {
    return !obj.isDeleted && obj.isFinished();
  };

  return obj;
}
