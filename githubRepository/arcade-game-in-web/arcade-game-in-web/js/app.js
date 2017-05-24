//抽象出敌人与玩家的公共类-——Creature
var Creature = function() {};

//使用原型定义敌人与玩家的共同方法 render和update
Creature.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Creature.prototype.update = function(dt) {
  /*
   *因为敌人的玩家的活动范围不一，所以 使用dt参数来分别处理敌人与玩家的位置更新
   *dt > 0，说明是敌人的使用的函数，执行敌人更新位置，并结束此方法
   *否则，便是玩家的位置更新；
   */
  if (dt > 0) {
    this.x += dt * this.speed;
    if (this.x > (dimens.perColWidth * 6)) {
      this.x = 0;
      this.col = getRandomNum(0, 3);
      this.y = dimens.perRowHeight * this.col + dimens.startHeight;
      this.speed = getRandomNum(100, 200);
    }
    if (this.y === player.y) {
      if (this.x < (player.x + dimens.perColWidth) && this.x > (player.x - dimens.perColWidth)) {
        showFaileddTips();

        player.x = dimens.perColWidth * 2;
        player.y = dimens.perRowHeight * 4 + dimens.startHeight;
      }
    }
    return;
  }


  this.canMoveLeft = this.x > 0;
  this.canMoveRight = this.x < (dimens.perColWidth * 4);
  this.canMoveUp = this.y > dimens.startHeight;
  this.canMoveDown = this.y < dimens.perRowHeight * 4 + dimens.startHeight;
}

// 这是我们的玩家要躲避的敌人
var Enemy = function() {
  // 要应用到每个敌人的实例的变量写在这里
  // 我们已经提供了一个来帮助你实现更多
  this.x = 0;
  this.col = getRandomNum(0, 3);
  this.y = dimens.perRowHeight * this.col + dimens.startHeight;
  this.speed = getRandomNum(50, 200);
  // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
  this.sprite = 'images/enemy-bug.png';
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
  this.x = dimens.perColWidth * 2;
  this.y = dimens.perRowHeight * 4 + dimens.startHeight;
  this.canMoveLeft = true;
  this.canMoveRight = true;
  this.canMoveUp = true;
  this.canMoveDown = true;
  this.sprite = 'images/char-boy.png';
  this.handleInput = function(keyEvent) {
    switch (keyEvent) {
      case 'left':
        if (this.canMoveLeft) {
          this.x -= dimens.perColWidth;
        }
        break;
      case 'right':
        if (this.canMoveRight) {
          this.x += dimens.perColWidth;
        }
        break;
      case 'up':
        if (this.canMoveUp) {
          this.y -= dimens.perRowHeight;
        } else {
          showSuccessTips();
          this.x = dimens.perColWidth * 2;
          this.y = dimens.perRowHeight * 4 + dimens.startHeight;
        }
        break;
      case 'down':
        if (this.canMoveDown) {
          this.y += dimens.perRowHeight;
        }
        break;
    }
  };
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
Enemy.prototype = new Creature();
Player.prototype = new Creature();

var allEnemies = getEnemys(4);
var player = new Player();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
//在成功和失败提示窗显示时，不响应按键操作
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  if (!custom.isShowing) {
    player.handleInput(allowedKeys[e.keyCode]);
  }

});

//生成随机方法，用来生成虫子随机列数和随机速度，增加游戏趣味
function getRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

//生成敌人对象数组
function getEnemys(num) {
  var enemys = [];
  for (var i = 0; i < num; i++) {
    enemys[i] = new Enemy();
  }
  return enemys;
}

//展示自定义的alert来提示玩家成功和失败
function showSuccessTips() {
  custom.alert("恭喜！", "您已顺利通过！", "Star");
}

function showFaileddTips() {
  custom.alert("遗憾！", "您被虫子(Bug)击败了...", "enemy-bug");
}
