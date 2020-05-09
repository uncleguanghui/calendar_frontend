// 生成-1~0或0~1的伪随机数
function rnd(seed) {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280.0;
}

// 生成-N-1~0或1~N的随机整数，可以自己设置种子，也可以使用默认的随机种子
function rand(number, seed = new Date().getTime()) {
  return Math.ceil(rnd(seed) * number);
}

export default { rnd, rand };
