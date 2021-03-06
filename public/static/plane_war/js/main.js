var game = {
	myPlane:null,
	allPlane:[],
	allBullet:[],
	planeSpeed:[5,4,3,2],
	planeDensity:[20,200,600,1000],
	interval:1000/24,
	scores:0,
	gameTime:0,
	num:0,
	stageBgY:0,
	gameSet:null,
	stage:null,
	killBossCount:0
};

//初始化我机
game.initMyPlane = function(){
	this.myPlane = new myPlane();
	this.myPlane.class = "myPlane";
	this.myPlane.position = {x:"45%",y:460};
	this.myPlane.show();	
	this.myPlane.move();
};
//运行游戏，一切运动皆依赖此函数
game.run = function(){
	var _this = this;
	_this.num++;
	_this.stage = document.getElementById("container");
	
	//控制开火节奏
	if(_this.num%3==0){
		//我机开火,push子弹		
		_this.myPlane.fire();
		_this.allBullet.push(_this.myPlane.bullets);
	}
	//获取、遍历所有子弹对象
	var allBulletLen = _this.allBullet.length;
	for(var i=0;i<allBulletLen;i++){
		//判断子弹销毁或飞出界面
		if( _this.allBullet[i].bullet.offsetTop<0){
			_this.allBullet[i].die();			
		}		
		if(_this.allBullet[i].outside){
			_this.allBullet.splice(i,1);
			allBulletLen--;
		}
	}	
	//创建敌机
	if(_this.num%_this.planeDensity[0] == 0){	
		var npc = new npcPlane();
		npc.class = "npc1";
		npc.armor = npc.score = 1;
		npc.speed = _this.planeSpeed[0];
		npc.show();
		npc.appear();
		_this.allPlane.push(npc);
	}
	if(_this.num%_this.planeDensity[1] == 0){
		var npc = new npcPlane();
		npc.class = "npc2";	
		npc.armor = npc.score = 1;
		npc.speed = _this.planeSpeed[1];	
		npc.show();
		npc.appear();		
		_this.allPlane.push(npc);
	}
	if(_this.num%_this.planeDensity[2] == 0){
		var npc = new npcPlane();
		npc.class = "npc3";		
		npc.armor = npc.score = 1;
		npc.speed = _this.planeSpeed[2];	
		npc.show();
		npc.appear();
		_this.allPlane.push(npc);		
	}
	if(_this.num%_this.planeDensity[3] == 0){
		var npc = new npcPlane();
		npc.class = "npc4";		
		npc.armor = npc.score = 1;
		npc.speed = _this.planeSpeed[3];	
		npc.show();
		npc.appear();
		_this.allPlane.push(npc);
		_this.num = 0;		
	}	

	//获取、遍历所有飞机对象
	var len = _this.allPlane.length;
	for(var i=0;i<len;i++){
		//判断飞机飞出界面
		if( _this.allPlane[i].plane.offsetTop>_this.stage.offsetHeight){
			_this.allPlane[i].die();
		}	
		//我机敌机碰撞
		if(getCollision(_this.myPlane.plane,_this.allPlane[i].plane)){
			_this.over();
		}
		//从数组清理出界或销毁的飞机	
		if(_this.allPlane[i].outside){
			_this.allPlane.splice(i,1);
			len--;
		}
	}
	//敌机移动
	for(var i=0;i<_this.allPlane.length;i++){
		_this.allPlane[i].plane.style.top = _this.allPlane[i].plane.offsetTop + _this.allPlane[i].speed + "px";
	}
	//敌机与子弹碰撞
	for(var j=0;j<_this.allBullet.length;j++){
		_this.allBullet[j].bullet.style.top = _this.allBullet[j].bullet.offsetTop - _this.allBullet[j].speed + "px";
		//命中
		for(var i=0;i<_this.allPlane.length;i++){
			//子弹敌机相撞
			if(getCollision(_this.allBullet[j].bullet,_this.allPlane[i].plane)){
				//子弹销毁
				_this.allBullet[j].die();
				//飞机护甲减少
				_this.allPlane[i].armor-=_this.allBullet[j].power;
				if(_this.allPlane[i].armor<=0){
					//得分
					_this.scores += _this.allPlane[i].score;
					//击杀boss获得奖励
					// if(_this.allPlane[i].class == "npc4"){
					// 	//第一次击杀
					// 	if(_this.myPlane.lv == 1){
					// 		_this.myPlane.lv++;
					// 	}
					// 	_this.killBossCount++;
					// 	//击杀n次boss得到最终武器
					// 	if(_this.killBossCount == 9){
					// 		_this.myPlane.lv++;
					// 	}
					// }
					//飞机爆炸
					_this.allPlane[i].bang();						
				}				
				return;
			}
		}
	}		
	//记分板
  document.getElementById("scoretext").innerHTML = "：" + _this.scores;
	//背景运动
	_this.stageBgY++;
	_this.stage.style.backgroundPositionY = _this.stageBgY + "px";
	//游戏进度
	if(_this.scores>10 && _this.scores<20){
		_this.planeSpeed = [6,5,4,3];
		_this.planeDensity = [15,200,600,1000];
	}
	if(_this.scores>20 && _this.scores<40){
		_this.planeSpeed = [7,6,5,4];
		_this.planeDensity = [15,100,400,2000];
	}
	if(_this.scores>40 && _this.scores<80){
		_this.planeSpeed = [8,7,6,5];
		_this.planeDensity = [10,200,500,1500];
	}
	if(_this.scores>120){
		_this.planeSpeed = [12,10,8,7];
		_this.planeDensity = [10,150,300,1000];
	}
	if(_this.scores>200){
		_this.planeSpeed = [15,13,11,9];
		_this.planeDensity = [8,100,200,800];
	}	
};
//游戏开始，初始化我机，场景运动开始
game.begin = function(){
	var _this =this;
	// if(!_this.myPlane){
  if(!planeStatus.isPause)
	  _this.initMyPlane();
	// }else{
		// _this.myPlane.move();
	// }
	_this.gameSet = window.setInterval(function(){
		_this.run();
	},_this.interval);	
};
//游戏暂停
game.pause = function(){
	var _this = this;
	_this.myPlane.stop();
	window.clearInterval(_this.gameSet);
};
//游戏结束
game.over = function(){
	var _this = this;
	_this.myPlane.stop();
	_this.myPlane.bang();
	//得分统计
	window.setTimeout(function(){
		window.clearInterval(_this.gameSet);

    var container = document.getElementById("container");
    var p =document.getElementsByTagName("p");
    var t;
    for(t=0;t<p.length;t++){
      container.removeChild(p[0]);
    }

		var info = document.getElementById("info-wrapper"),
        endScroe = document.getElementById("endScroe"),
        update_score = document.getElementById("update_score");
		info.style.display = "block";
		endScroe.innerHTML = _this.scores;

    $("input[ name='name']").eq(0).focus();

	},1500);
};

//文件载入
onload = function(){
	var begin  = document.getElementById("begin"),
		  begin_btn = document.getElementById("begin_btn"),
		  pause  = document.getElementById("pause"),
		  pause_btn = document.getElementById("pause_btn"),
		  again_btn = document.getElementById("again_btn"),
	    score_btn = document.getElementById("score_btn"),
			login_btn = document.getElementById("login_btn"),
			againgame = document.getElementById("againgame"),
      info = document.getElementById("info-wrapper"),
      updatescore_btn = document.getElementById("update_score");
  if (getCookie("isLogin") == "false" || getCookie("isLogin") == null) {
    initUserCookie();
  }

  // 跳转到高分榜页面
	score_btn.onclick = function () {
    window.location.href = 'http://localhost/plane_war/public/plane/index/highscore.html';
  };

	// 上传高分
  updatescore_btn.onclick = function () {
      updateHighScore();
  };

  againgame.onclick = function (e) {
    var container = document.getElementById("container");
    var p =document.getElementsByTagName("p");
    var t;
    for(t=0;t<p.length;t++){
      container.removeChild(p[0]);
    }

    var E = e||event;
    game.scores = 0;
    game.planeSpeed = [6,5,4,3];
    game.planeDensity=[20,200,600,1000],
    document.getElementById("scoretext").innerHTML = "：" + game.scores;
    begin.style.display = "none";
    info.style.display = "none";
    game.begin();
    E.stopPropagation();
    E.cancelBubble = true;
  }

	begin_btn.onclick = function(e){
		var E = e||event;
		begin.style.display = "none";
		game.begin();
		E.stopPropagation();
		E.cancelBubble = true;
	};

	begin.onclick = function(e){
		var E = e||event;
		E.stopPropagation();
		E.cancelBubble = true;
	};

	pause_btn.onclick = function(e){
		var E = e||event;
		game.begin();
		pause.style.display = "none";
		E.stopPropagation();
		E.cancelBubble = true;
		planeStatus.isPause = !planeStatus.isPause;
	};

	again_btn.onclick = function(){
		window.location.reload();
	};
};

	//碰撞检测
	function getCollision(obj1,obj2){
		var l1 = obj1.offsetLeft;
		var r1 = obj1.offsetLeft + obj1.offsetWidth;
		var t1 = obj1.offsetTop;
		var b1 = obj1.offsetTop+ obj1.offsetHeight;
		var l2 = obj2.offsetLeft;
		var r2 = obj2.offsetLeft + obj2.offsetWidth;
		var t2 = obj2.offsetTop;
		var b2 = obj2.offsetTop+ obj2.offsetHeight;				
		if(r1<l2 || l1>r2 || t1>b2 || b1<t2){
			return false;
		}else{
			return true;
		}
	}

