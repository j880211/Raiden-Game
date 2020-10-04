var cursors;
var username;
var level;
var volume=1;
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
function Enemy1(config,myplane) {
    this.init = function() {
      this.enemys = game.add.group();
      this.enemys.enableBody = true;
      this.enemys.createMultiple(config.selfPool, config.selfPic);
      this.enemys.setAll('outOfBoundsKill', true);
      this.enemys.setAll('checkWorldBounds', true);
  
      this.enemyBullets = game.add.group();
      this.enemyBullets.enableBody = true;
      this.enemyBullets.createMultiple(config.bulletsPool, config.bulletPic);
      this.enemyBullets.setAll('outOfBoundsKill', true);
      this.enemyBullets.setAll('checkWorldBounds', true);
      
      this.maxWidth = game.width - game.cache.getImage(config.selfPic).width;

      game.time.events.loop(Phaser.Timer.SECOND * config.selfTimeInterval, this.generateEnemy, this);

      this.explosions = game.add.group();
      this.explosions.createMultiple(config.explodePool, config.explodePic);
      this.explosions.forEach(function(explosion) {
        explosion.animations.add(config.explodePic);
      }, this);
    }
   
    this.generateEnemy = function() {
      var e = this.enemys.getFirstExists(false);
      if(e) {
        e.reset(game.rnd.integerInRange(0, this.maxWidth), -game.cache.getImage(config.selfPic).height);
        e.life = config.life;
        e.body.velocity.y = config.velocity;
      }
    }
   
    this.enemyFire = function() {
      this.enemys.forEachExists(function(enemy) {
              var bullet = this.enemyBullets.getFirstExists(false);
        if(bullet) {
          if(game.time.now > (enemy.bulletTime || 0)) {
            bullet.reset(enemy.x + config.bulletX, enemy.y + config.bulletY);
            game.physics.arcade.moveToObject(bullet,myplane,config.bulletVelocity)
            bullet.body.velocity.y = config.bulletVelocity;
            enemy.bulletTime = game.time.now + config.bulletTimeInterval;
          }
        }
          }, this);
    };
 
    this.hitEnemy = function(myBullet, enemy) {
      myBullet.kill();
      enemy.life--;
      if(enemy.life <= 0) {
        try {
          config.crashsound.play();
        } catch(e) {}
        enemy.kill();
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(enemy.body.x, enemy.body.y);
        explosion.play(config.explodePic, 30, false, true);
        score += config.score;
      }
    };
    this.update = function() {
      config.crashsound.volume=volume;
      console.log(config.crashsound.volume)
    }; 
  }

  function Enemy2(config) {
    this.init = function() {
      this.enemys = game.add.group();
      this.enemys.enableBody = true;
      this.enemys.createMultiple(config.selfPool, config.selfPic);
      this.enemys.setAll('outOfBoundsKill', true);
      this.enemys.setAll('checkWorldBounds', true);

      this.enemyBullets = game.add.group();
      this.enemyBullets.enableBody = true;
      this.enemyBullets.createMultiple(config.bulletsPool, config.bulletPic);
      this.enemyBullets.setAll('outOfBoundsKill', true);
      this.enemyBullets.setAll('checkWorldBounds', true);
  
      this.maxWidth = game.width - game.cache.getImage(config.selfPic).width;
      
      game.time.events.loop(Phaser.Timer.SECOND * config.selfTimeInterval, this.generateEnemy, this);
      
      this.explosions = game.add.group();
      this.explosions.createMultiple(config.explodePool, config.explodePic);
      this.explosions.forEach(function(explosion) {
        explosion.animations.add(config.explodePic);
      }, this);
    }
    
    this.generateEnemy = function() {
      var e = this.enemys.getFirstExists(false);
      if(e) {
        e.reset(game.rnd.integerInRange(0, this.maxWidth), -game.cache.getImage(config.selfPic).height);
        e.life = config.life;
        e.body.velocity.y = config.velocity;
      }
    }

    this.enemyFire = function() {
      this.enemys.forEachExists(function(enemy) {
              var bullet = this.enemyBullets.getFirstExists(false);
        if(bullet) {
          if(game.time.now > (enemy.bulletTime || 0)) {
            bullet.reset(enemy.x + config.bulletX, enemy.y + config.bulletY);
            bullet.body.velocity.y = config.bulletVelocity;
            enemy.bulletTime = game.time.now + config.bulletTimeInterval;
          }
        }
      }, this);
    };
    
    this.hitEnemy = function(myBullet, enemy) {
      myBullet.kill();
      enemy.life--;
      if(enemy.life <= 0) {
        try {
          config.crashsound.play();
        } catch(e) {}
        enemy.kill();
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(enemy.body.x, enemy.body.y);
        explosion.play(config.explodePic, 30, false, true);
        score += config.score;
      }
    };
    this.update = function() {
      config.crashsound.volume=volume;
    };
  }
  
  var nowlevel;
  var score = 0;
  game.States = {};

  game.States.boot = function() {
    this.preload = function() {
      if(typeof(GAME) !== "undefined") {
        this.load.baseURL = GAME + "/";
      }
      if(!game.device.desktop){
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.forcePortrait = true;
        this.scale.refresh();
      }
      game.load.image('loading', 'assets/preloader.gif');
    };
    this.create = function() {
      game.state.start('preload');
    };
  };
 
  game.States.preload = function() {
    this.preload = function() {
      var preloadSprite = game.add.sprite(10, game.height/2, 'loading');
      game.load.setPreloadSprite(preloadSprite);
      game.load.image('background', 'assets/bg.jpg');
      game.load.image('replaybutton', 'assets/replaybutton.png');
      game.load.image('level1', 'assets/level1.png');
      game.load.image('level2', 'assets/level2.png');
      game.load.image('mybullet', 'assets/mybullet.png');
      game.load.image('bullet1', 'assets/bullet1.png');
      game.load.image('bullet2', 'assets/bullet2.png');
      game.load.image('bullet3', 'assets/bullet3.png');
      game.load.image('enemy1', 'assets/enemy1.png');
      game.load.image('enemy2', 'assets/enemy2.png');
      game.load.image('enemy3', 'assets/enemy3.png');
      game.load.image('back','assets/back.png');
      game.load.image('heart','assets/heart.png');
      game.load.image('pause','assets/pause.png');
      game.load.image('skill','assets/skill.png');
      game.load.image('check','assets/checked.png');
      game.load.image('scoreboard','assets/score.png');
      game.load.image('volumeup','assets/volumeup.png');
      game.load.image('volumedown','assets/volumedown.png');
      game.load.image('previous','assets/previous.png');
      game.load.spritesheet('explode', 'assets/explode.png', 128, 128,16);
      game.load.spritesheet('myexplode', 'assets/explode.png', 128, 128,16);
      game.load.spritesheet('myplane', 'assets/FotoJet.png', 70, 70,4);
      game.load.image('award', 'assets/award.png');
      game.load.audio('shootsound', 'assets/shoot.mp3');
      game.load.audio('bomb', 'assets/bomb.mp3');
    };
    this.create = function() {
      game.state.start('main');
    };
  };
  
  game.States.main = function() {
    this.create = function() {
      //console.log("return back");
      username="";
      username = window.prompt("What's your name?");
      var background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
      this.myplane = game.add.sprite(370, 100, 'myplane');

      this.myplane.animations.add('change');
      this.myplane.animations.play('change', 15, true);
      var highscore=0;
      var style = {font: "40px Arial", fill: "#ffffff"};
      var style1 = {font: "24px Arial", fill: "#ffffff"};
      this.text = game.add.text(340, 370, "LEVEL", style);
      this.level1 = game.add.button(320, 450, 'level1', this.onStartClick1, this, 1, 1, 0);
      this.level2 = game.add.button(420, 450, 'level2', this.onStartClick2, this, 1, 1, 0); 
      this.changetoscoreboard111 = game.add.button(700, 450, 'scoreboard', this.changetoscoreboard, this, 1, 1, 0); 
      console.log("return back");
     
    };
    this.onStartClick1 = function() {
      game.state.start('start1');
      volume=1;
    };
    this.onStartClick2 = function(){
    game.state.start('start2');
    volume=1; 
    }
    this.changetoscoreboard = function(){
      game.state.start('scoreboard');
      volume=1; 
    }
  };

   
  game.States.scoreboard = function() {
    var style = {font: "35px Arial", fill: "#ffffff"};
    var style1 = {font: "59px Arial", fill: "#ffffff"};
    var i=5;
    this.create = function() {
    var background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
    this.text5=game.add.text(220, 50, "Score Board", style1); 
    this.text3=game.add.text(500, 130, "Score", style);   
    this.text4=game.add.text(180, 130, "Name", style);
    this.backtomain = game.add.button(700, 500, 'previous', this.backtomainpage, this, 1, 1, 0); 
    const query = firebase.database().ref('scoreboard')
    .orderByChild('nowscore')
    .limitToLast(5)
    
    query.once('value', function (snapshot) {
      i=5;
    snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        console.log(childData.name);
        console.log(childData.nowscore);
        this.text1=game.add.text(500, 140+50*i, childData.nowscore, style);   
        this.text2=game.add.text( 180, 140+50*i, childData.name, style);
        i--;     
    });
    });
    
   };
   this.backtomainpage = function(){
    game.state.start('main');
   }
  };
 
  game.States.start1 = function() {

    this.create = function() {
      
      game.physics.startSystem(Phaser.Physics.ARCADE);
      cursors = game.input.keyboard.createCursorKeys();
      fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      finalskillbutton = game.input.keyboard.addKey(Phaser.Keyboard.A);
      uniquebutton = game.input.keyboard.addKey(Phaser.Keyboard.U);
      aimbutton = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
     
      
      score = 0;
      
      var style = {font: "35px Arial", fill: "#ffffff"};
      
      this.bomb = game.add.audio('bomb', 10, false);

      var background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
      this.back = game.add.tileSprite(0,500,800,150,'back');
      this.heart1=game.add.image(550,550,'heart');
      this.heart2=game.add.image(600,550,'heart');
      this.heart3=game.add.image(650,550,'heart');
      this.heart4=game.add.image(700,550,'heart');
      this.heart5=game.add.image(750,550,'heart');
     
     
      this.shootsound = game.add.audio('shootsound', 1, false);

      this.text = game.add.text(20, 550, "Score: 0", style);
      this.pauseButton = game.add.button(330, 545, 'pause', this.update, this, 1, 1, 0);
      this.volumeup = game.add.button(200, 545, 'volumeup', this.volumeupfunction, this, 1, 1, 0);
      this.volumedown = game.add.button(250, 545, 'volumedown', this.volumedownfunction, this, 1, 1, 0);
      background.autoScroll(0, 20);

      this.myplane = game.add.sprite(370,100, 'myplane');
      this.myplane.animations.add('change');
      this.myplane.animations.play('change', 15, true);
      game.physics.arcade.enable(this.myplane);
      this.myplane.body.collideWorldBounds = true;
      this.myplane.level = 5;
      this.myplane.final_skill=0;
      var tween = game.add.tween(this.myplane).to({y: game.height - 150}, 1000, Phaser.Easing.Sinusoidal.InOut, true);

      tween.onComplete.add(this.onStart, this);
      
    };
    this.onStart = function() {
        
      this.mybullets = game.add.group();
      this.mybullets.enableBody = true;
      this.mybullets.createMultiple(50, 'mybullet');
      this.mybullets.setAll('outOfBoundsKill', true);
      this.mybullets.setAll('checkWorldBounds', true);
      this.myStartFire = true;
      this.bulletTime = 0;
    
      this.awards = game.add.group();
      this.awards.enableBody = true;
      this.awards.createMultiple(5, 'award');
      this.awards.setAll('outOfBoundsKill', true);
      this.awards.setAll('checkWorldBounds', true);
      this.awardMaxWidth = game.width - game.cache.getImage('award').width;
      game.time.events.loop(Phaser.Timer.SECOND * 10, this.generateAward, this);

      var enemyTeam = {
        enemy1: {
          game: this,
          selfPic: 'enemy1',
          bulletPic: 'bullet1',
          explodePic: 'explode',
          selfPool: 10,
          bulletsPool: 100,
          explodePool: 10,
          life: 1,
          velocity: 40,
          bulletX: 9,
          bulletY: 20,
          bulletVelocity: 100,
          selfTimeInterval: 5,
          bulletTimeInterval: 1000,
          score: 10,
          crashsound: this.bomb
        },
        enemy2: {
          game: this,
          selfPic: 'enemy2',
          bulletPic: 'bullet2',
          explodePic: 'explode',
          selfPool: 10,
          bulletsPool: 50,
          explodePool: 10,
          life: 2,
          velocity: 50,
          bulletX: 13,
          bulletY: 30,
          bulletVelocity: 200,
          selfTimeInterval: 15,
          bulletTimeInterval: 1200,
          score: 20,
          crashsound: this.bomb
        },
        
      }
      this.enemy1 = new Enemy2(enemyTeam.enemy1,this.myplane);
      this.enemy1.init();
      this.enemy2 = new Enemy2(enemyTeam.enemy2,this.myplane);
      this.enemy2.init();
    };
    this.generateAward = function() {
      var award = this.awards.getFirstExists(false);
      if(award) {
        award.reset(game.rnd.integerInRange(0, this.awardMaxWidth), -game.cache.getImage('award').height);
        award.body.velocity.y = 200;
      }
    };

    this.volumeupfunction = function() {
      if(volume>=1)volume=1;
      else volume+=0.1;
      //console.log(volume);
    };
    this.volumedownfunction = function() {
      if(volume<=0)volume=0;
      else volume-=0.1;
      //console.log(volume);
    };
    this.myFireBullet = function() {
        var bullet;
        bullet = this.mybullets.getFirstExists(false);
        if (bullet && fireButton.isDown)
        {
            bullet.reset(this.myplane.x+25, this.myplane.y + 8);
            bullet.body.velocity.y = -400;
            this.bulletTime = game.time.now + 200;
            this.shootsound.play();
        }
        if(bullet && uniquebutton.isDown && score>100)
        {
          console.log("button down");
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -400;
              bullet.body.velocity.x = -120;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -600;
              bullet.body.velocity.x = -200;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -700;
              bullet.body.velocity.x = -100;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -600;
              bullet.body.velocity.x = 200;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -700;
              bullet.body.velocity.x = 100;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -600;
              bullet.body.velocity.x = -200;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -600;
              bullet.body.velocity.x = 200;
              this.bulletTime = game.time.now + 200;
          }
        }
        if(bullet && finalskillbutton.isDown&&this.myplane.final_skill>0)
        {

           if(this.myplane.final_skill==3){
            this.skill1.destroy();
            this.skill2.destroy();
            this.skill3.destroy();
            this.skill1=game.add.image(500,545,'skill');
            this.skill2=game.add.image(450,545,'skill');
           }
           else if(this.myplane.final_skill==2){
            this.skill1.destroy();
            this.skill2.destroy();
            this.skill1=game.add.image(500,545,'skill');
           }
           else if(this.myplane.final_skill==1){
            this.skill1.destroy();
           }
           
           
           this.myplane.final_skill-=1;
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = -200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = -100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = -200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = -500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = -100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -450;
                bullet.body.velocity.x = 500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -450;
                bullet.body.velocity.x = -500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -630;
                bullet.body.velocity.x = 630;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -630;
                bullet.body.velocity.x = -630;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -750;
                bullet.body.velocity.x = 100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -750;
                bullet.body.velocity.x = -100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -620;
                bullet.body.velocity.x = 500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -620;
                bullet.body.velocity.x = 500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = -80;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = -60;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = -40;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 0;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 40;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 60;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 80;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 120;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -300;
                bullet.body.velocity.x = -200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -300;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = -250;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 250;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -670;
                bullet.body.velocity.x = 100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -670;
                bullet.body.velocity.x = -200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -300;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -720;
                bullet.body.velocity.x = -450;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = -150;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -410;
                bullet.body.velocity.x = 700;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = -530;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -680;
                bullet.body.velocity.x = 620;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -680;
                bullet.body.velocity.x = -620;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 110;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -770;
                bullet.body.velocity.x = -130;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -610;
                bullet.body.velocity.x = 520;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = 400;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -200;
                bullet.body.velocity.x = -800;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = -100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = -400;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -410;
                bullet.body.velocity.x = 600;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -430;
                bullet.body.velocity.x = 400;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 600;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = 280;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -290;
                bullet.body.velocity.x = 900;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -320;
                bullet.body.velocity.x = 190;
                this.bulletTime = game.time.now + 200;
            }
            this.shootsound.play();
        }
    };

    this.hitMyplane = function(myplane, bullet) {
        bullet.kill();
      
      if(myplane.level > 1) {
        //console.log(myplane.level);
        myplane.level -= 1 ;
        if(myplane.level==4) this.heart1.destroy();
        else if (myplane.level==3) this.heart2.destroy();
        else if (myplane.level==2) this.heart3.destroy();
        else if (myplane.level==1) this.heart4.destroy();
        //else if (myplane.level==0) this.heart5.destroy();
      } 
      else {
        this.heart5.destroy();
        myplane.kill();
        this.dead();  
      }
    };

    this.crashMyplane = function(myplane, enemy) {
      myplane.kill();
      this.dead();
    }

    this.getAward = function(myplane, award) {
      award.kill();
      if(myplane.final_skill < 3) {
        if(myplane.final_skill ==2)
        {
          this.skill1.destroy();
          this.skill2.destroy();
          this.skill1=game.add.image(500,545,'skill');
          this.skill2=game.add.image(450,545,'skill');
          this.skill3=game.add.image(400,545,'skill');
        }
        else if(myplane.final_skill==1){
          this.skill1.destroy();
          this.skill1=game.add.image(500,545,'skill');
          this.skill2=game.add.image(450,545,'skill');
        }
        else if(myplane.final_skill==0){
          this.skill1=game.add.image(500,545,'skill');
        }
        myplane.final_skill++;
      }     
    };
    
    this.dead = function() {
      this.bomb.play();
      var myexplode = game.add.sprite(this.myplane.x, this.myplane.y, 'myexplode');
      var anim = myexplode.animations.add('myexplode');
      myexplode.animations.play('myexplode', 30, false, true);
      anim.onComplete.add(this.gotoOver, this);
    };

    this.gotoOver = function() {
      game.state.start('over');
    };
  
    this.update = function() {
      this.text.setText("Score: " + score);
      this.pauseButton.inputEnabled=true;
      this.pauseButton.events.onInputUp.add(function(){
        game.paused = true;
      },this);
      game.input.onDown.add(function(){
        if(game.paused){
          game.paused=false;
        }
      },this);
      this.pauseButton.fixedToCamera =true;
      
      this.shootsound.volume=volume;
      this.bomb.volume=volume;

      //volumeup = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
      //volumedown = game.input.keyboard.addKey(Phaser.Keyboard.ONE);


      if(this.myStartFire) {
        this.myFireBullet();
        this.enemy1.enemyFire();
        this.enemy2.enemyFire();
        if (cursors.left.isDown)
        {   
            this.myplane.body.x -= 10;
        }
        else if (cursors.right.isDown)
        {
            this.myplane.body.x += 10;
        }
        else if (cursors.up.isDown)
        {
            this.myplane.body.y -= 10;
        }
        else if (cursors.down.isDown&& this.myplane.body.y<game.height-150)
        {
            this.myplane.body.y += 10;
        }

       
        game.physics.arcade.overlap(this.enemy1.enemyBullets, this.myplane, this.hitMyplane, null, this);
        game.physics.arcade.overlap(this.enemy2.enemyBullets, this.myplane, this.hitMyplane, null, this);
        game.physics.arcade.overlap(this.mybullets, this.enemy1.enemys, this.enemy1.hitEnemy, null, this.enemy1);
        game.physics.arcade.overlap(this.mybullets, this.enemy2.enemys, this.enemy2.hitEnemy, null, this.enemy2);
        game.physics.arcade.overlap(this.enemy1.enemys, this.myplane, this.crashMyplane, null, this);
        game.physics.arcade.overlap(this.enemy2.enemys, this.myplane, this.crashMyplane, null, this);
        game.physics.arcade.overlap(this.awards, this.myplane, this.getAward, null, this);
      }
    };
  };
  game.States.start2 = function() {

    this.create = function() {
      
      game.physics.startSystem(Phaser.Physics.ARCADE);
      cursors = game.input.keyboard.createCursorKeys();
      fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      finalskillbutton = game.input.keyboard.addKey(Phaser.Keyboard.A);
      uniquebutton = game.input.keyboard.addKey(Phaser.Keyboard.U);
      aimbutton = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
     
      score = 0;
      
      var style = {font: "35px Arial", fill: "#ffffff"};
      
      this.bomb = game.add.audio('bomb', 10, false);

      var background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
      this.back = game.add.tileSprite(0,500,800,150,'back');
      this.heart1=game.add.image(550,550,'heart');
      this.heart2=game.add.image(600,550,'heart');
      this.heart3=game.add.image(650,550,'heart');
      this.heart4=game.add.image(700,550,'heart');
      this.heart5=game.add.image(750,550,'heart');
     
     
      this.shootsound = game.add.audio('shootsound', 1, false);

      this.text = game.add.text(20, 550, "Score: 0", style);
      this.pauseButton = game.add.button(330, 545, 'pause', this.update, this, 1, 1, 0);
      this.volumeup = game.add.button(200, 545, 'volumeup', this.volumeupfunction, this, 1, 1, 0);
      this.volumedown = game.add.button(250, 545, 'volumedown', this.volumedownfunction, this, 1, 1, 0);
      background.autoScroll(0, 20);

      this.myplane = game.add.sprite(370,100, 'myplane');
      this.myplane.animations.add('change');
      this.myplane.animations.play('change', 15, true);
      game.physics.arcade.enable(this.myplane);
      this.myplane.body.collideWorldBounds = true;
      this.myplane.level = 5;
      this.myplane.final_skill=0;
      var tween = game.add.tween(this.myplane).to({y: game.height - 150}, 1000, Phaser.Easing.Sinusoidal.InOut, true);

      tween.onComplete.add(this.onStart, this);
      
    };
    this.onStart = function() {
        
      this.mybullets = game.add.group();
      this.mybullets.enableBody = true;
      this.mybullets.createMultiple(50, 'mybullet');
      this.mybullets.setAll('outOfBoundsKill', true);
      this.mybullets.setAll('checkWorldBounds', true);
      this.myStartFire = true;
      this.bulletTime = 0;
    
      this.awards = game.add.group();
      this.awards.enableBody = true;
      this.awards.createMultiple(5, 'award');
      this.awards.setAll('outOfBoundsKill', true);
      this.awards.setAll('checkWorldBounds', true);
      this.awardMaxWidth = game.width - game.cache.getImage('award').width;
      game.time.events.loop(Phaser.Timer.SECOND * 10, this.generateAward, this);

      var enemyTeam = {
        enemy1: {
          game: this,
          selfPic: 'enemy1',
          bulletPic: 'bullet1',
          explodePic: 'explode',
          selfPool: 10,
          bulletsPool: 100,
          explodePool: 10,
          life: 1,
          velocity: 40,
          bulletX: 9,
          bulletY: 20,
          bulletVelocity: 100,
          selfTimeInterval: 5,
          bulletTimeInterval: 1000,
          score: 10,
          crashsound: this.bomb
        },
        enemy2: {
          game: this,
          selfPic: 'enemy2',
          bulletPic: 'bullet2',
          explodePic: 'explode',
          selfPool: 10,
          bulletsPool: 50,
          explodePool: 10,
          life: 2,
          velocity: 50,
          bulletX: 13,
          bulletY: 30,
          bulletVelocity: 200,
          selfTimeInterval: 15,
          bulletTimeInterval: 1200,
          score: 20,
          crashsound: this.bomb
        },
        enemy3: {
          game: this,
          selfPic: 'enemy3',
          bulletPic: 'bullet3',
          explodePic: 'explode',
          selfPool: 5,
          bulletsPool: 25,
          explodePool: 5,
          life: 10,
          velocity: 70,
          bulletX: 22,
          bulletY: 50,
          bulletVelocity: 300,
          selfTimeInterval: 20,
          bulletTimeInterval: 1500,
          score: 50,
          crashsound: this.bomb
        }
      }
      this.enemy1 = new Enemy2(enemyTeam.enemy1,this.myplane);
      this.enemy1.init();
      this.enemy2 = new Enemy2(enemyTeam.enemy2,this.myplane);
      this.enemy2.init();
      this.enemy3 = new Enemy1(enemyTeam.enemy3,this.myplane);
      this.enemy3.init();
    };
    this.generateAward = function() {
      var award = this.awards.getFirstExists(false);
      if(award) {
        award.reset(game.rnd.integerInRange(0, this.awardMaxWidth), -game.cache.getImage('award').height);
        award.body.velocity.y = 200;
      }
    };

    this.volumeupfunction = function() {
      if(volume>=1)volume=1;
      else volume+=0.1;
      //console.log(volume);
    };
    this.volumedownfunction = function() {
      if(volume<=0)volume=0;
      else volume-=0.1;
      //console.log(volume);
    };
    this.myFireBullet = function() {
        var bullet;
        bullet = this.mybullets.getFirstExists(false);
        if (bullet && fireButton.isDown)
        {
            bullet.reset(this.myplane.x+25, this.myplane.y + 8);
            bullet.body.velocity.y = -400;
            this.bulletTime = game.time.now + 200;
            this.shootsound.play();
        }
        if(bullet && uniquebutton.isDown && score>100)
        {
          console.log("button down");
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -400;
              bullet.body.velocity.x = -120;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -600;
              bullet.body.velocity.x = -200;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -700;
              bullet.body.velocity.x = -100;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -600;
              bullet.body.velocity.x = 200;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -700;
              bullet.body.velocity.x = 100;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -600;
              bullet.body.velocity.x = -200;
              this.bulletTime = game.time.now + 200;
          }
          bullet = this.mybullets.getFirstExists(false);  
          if(bullet) {
              bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
              bullet.body.velocity.y = -600;
              bullet.body.velocity.x = 200;
              this.bulletTime = game.time.now + 200;
          }
        }
        if(bullet && finalskillbutton.isDown&&this.myplane.final_skill>0)
        {

           if(this.myplane.final_skill==3){
            this.skill1.destroy();
            this.skill2.destroy();
            this.skill3.destroy();
            this.skill1=game.add.image(500,545,'skill');
            this.skill2=game.add.image(450,545,'skill');
           }
           else if(this.myplane.final_skill==2){
            this.skill1.destroy();
            this.skill2.destroy();
            this.skill1=game.add.image(500,545,'skill');
           }
           else if(this.myplane.final_skill==1){
            this.skill1.destroy();
           }
           
           
           this.myplane.final_skill-=1;
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = -200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = -100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = -200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = -500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = -100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -450;
                bullet.body.velocity.x = 500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -450;
                bullet.body.velocity.x = -500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -630;
                bullet.body.velocity.x = 630;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -630;
                bullet.body.velocity.x = -630;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -750;
                bullet.body.velocity.x = 100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -750;
                bullet.body.velocity.x = -100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -620;
                bullet.body.velocity.x = 500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -620;
                bullet.body.velocity.x = 500;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = -80;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = -60;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = -40;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 0;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 40;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 60;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 80;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 120;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -300;
                bullet.body.velocity.x = -200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -300;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = -250;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 250;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -670;
                bullet.body.velocity.x = 100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -670;
                bullet.body.velocity.x = -200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -300;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -720;
                bullet.body.velocity.x = -450;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -400;
                bullet.body.velocity.x = 200;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = -150;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -410;
                bullet.body.velocity.x = 700;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = -530;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -680;
                bullet.body.velocity.x = 620;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -680;
                bullet.body.velocity.x = -620;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 110;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -770;
                bullet.body.velocity.x = -130;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -610;
                bullet.body.velocity.x = 520;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = 400;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -200;
                bullet.body.velocity.x = -800;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = -100;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -420;
                bullet.body.velocity.x = -400;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -410;
                bullet.body.velocity.x = 600;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -430;
                bullet.body.velocity.x = 400;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -700;
                bullet.body.velocity.x = 600;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -600;
                bullet.body.velocity.x = 280;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);  
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -290;
                bullet.body.velocity.x = 900;
                this.bulletTime = game.time.now + 200;
            }
            bullet = this.mybullets.getFirstExists(false);
            if(bullet) {
                bullet.reset(this.myplane.x + 30, this.myplane.y - 15);
                bullet.body.velocity.y = -320;
                bullet.body.velocity.x = 190;
                this.bulletTime = game.time.now + 200;
            }
            this.shootsound.play();
        }
    };

    this.hitMyplane = function(myplane, bullet) {
        bullet.kill();
      
      if(myplane.level > 1) {
        //console.log(myplane.level);
        myplane.level -= 1 ;
        if(myplane.level==4) this.heart1.destroy();
        else if (myplane.level==3) this.heart2.destroy();
        else if (myplane.level==2) this.heart3.destroy();
        else if (myplane.level==1) this.heart4.destroy();
        //else if (myplane.level==0) this.heart5.destroy();
      } 
      else {
        this.heart5.destroy();
        myplane.kill();
        this.dead();  
      }
    };

    this.crashMyplane = function(myplane, enemy) {
      myplane.kill();
      this.dead();
    }

    this.getAward = function(myplane, award) {
      award.kill();
      if(myplane.final_skill < 3) {
        if(myplane.final_skill ==2)
        {
          this.skill1.destroy();
          this.skill2.destroy();
          this.skill1=game.add.image(500,545,'skill');
          this.skill2=game.add.image(450,545,'skill');
          this.skill3=game.add.image(400,545,'skill');
        }
        else if(myplane.final_skill==1){
          this.skill1.destroy();
          this.skill1=game.add.image(500,545,'skill');
          this.skill2=game.add.image(450,545,'skill');
        }
        else if(myplane.final_skill==0){
          this.skill1=game.add.image(500,545,'skill');
        }
        myplane.final_skill++;
      }     
    };
    
    this.dead = function() {
      this.bomb.play();
      var myexplode = game.add.sprite(this.myplane.x, this.myplane.y, 'myexplode');
      var anim = myexplode.animations.add('myexplode');
      myexplode.animations.play('myexplode', 30, false, true);
      anim.onComplete.add(this.gotoOver, this);
    };

    this.gotoOver = function() {
      game.state.start('over');
    };
  
    this.update = function() {
      this.text.setText("Score: " + score);
      this.pauseButton.inputEnabled=true;
      this.pauseButton.events.onInputUp.add(function(){
        game.paused = true;
      },this);
      game.input.onDown.add(function(){
        if(game.paused){
          game.paused=false;
        }
      },this);
      this.pauseButton.fixedToCamera =true;
      
      this.shootsound.volume=volume;
      this.bomb.volume=volume;

      //volumeup = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
      //volumedown = game.input.keyboard.addKey(Phaser.Keyboard.ONE);


      if(this.myStartFire) {
        this.myFireBullet();
        this.enemy1.enemyFire();
        this.enemy2.enemyFire();
        this.enemy3.enemyFire();
        if (cursors.left.isDown)
        {   
            this.myplane.body.x -= 10;
        }
        else if (cursors.right.isDown)
        {
            this.myplane.body.x += 10;
        }
        else if (cursors.up.isDown)
        {
            this.myplane.body.y -= 10;
        }
        else if (cursors.down.isDown&& this.myplane.body.y<game.height-150)
        {
            this.myplane.body.y += 10;
        }

       
        game.physics.arcade.overlap(this.enemy1.enemyBullets, this.myplane, this.hitMyplane, null, this);
        game.physics.arcade.overlap(this.enemy2.enemyBullets, this.myplane, this.hitMyplane, null, this);
        game.physics.arcade.overlap(this.enemy3.enemyBullets, this.myplane, this.hitMyplane, null, this);
        game.physics.arcade.overlap(this.mybullets, this.enemy1.enemys, this.enemy1.hitEnemy, null, this.enemy1);
        game.physics.arcade.overlap(this.mybullets, this.enemy2.enemys, this.enemy2.hitEnemy, null, this.enemy2);
        game.physics.arcade.overlap(this.mybullets, this.enemy3.enemys, this.enemy3.hitEnemy, null, this.enemy3);
        game.physics.arcade.overlap(this.enemy1.enemys, this.myplane, this.crashMyplane, null, this);
        game.physics.arcade.overlap(this.enemy2.enemys, this.myplane, this.crashMyplane, null, this);
        game.physics.arcade.overlap(this.enemy3.enemys, this.myplane, this.crashMyplane, null, this);
        game.physics.arcade.overlap(this.awards, this.myplane, this.getAward, null, this);
      }
    };
  };
  
  game.States.over = function() {
    this.create = function() {
      
      
      var bg = game.add.tileSprite(0, 0, game.width, game.height, 'background');
      var style1 = {font: "bold 50px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle"};
      var style = {font: "bold 24px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle"};
      this.text2 = game.add.text (270,100,"Game Over",style1);
      this.text3 = game.add.text(350, 200, "Score: " + score, style);
      this.replaybutton = game.add.button(350, 400, 'replaybutton', this.onReplayClick, this, 0, 0, 1);

      firebase.database().ref('scoreboard').push({
        name : username,
        nowscore : score
      });
  
    }
    
    this.onReplayClick = function() {
      game.state.start('main');
      //console.log("return");
    };
  }
  
  game.state.add('boot', game.States.boot);
  game.state.add('preload', game.States.preload);
  game.state.add('main', game.States.main);
  game.state.add('start1', game.States.start1);
  game.state.add('start2', game.States.start2)
  game.state.add('over', game.States.over);
  game.state.add('scoreboard',game.States.scoreboard);
  
  game.state.start('boot');



