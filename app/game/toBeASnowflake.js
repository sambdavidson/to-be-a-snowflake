window.onload = function() {
    var gameWidth = 400;
    var gameHeight = 300;
    var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    
    var gamePhase = 0;
    var stepPhase = 0;
    var textTitleObj, textSubTitleObj;
    var leftKey, rightKey, spaceKey;
    var stars = [];
    var mainCloud;
    var snowflake;
    var reminderText;
    var reminderTexts = [
        'press space to be a snowflake',
        'press space to fall like a snowflake',
        'press space to feel the breeze',
        'press space to go with the wind',
        'press space to spin and fall',
        'press space to do snowflake things'
    ];
    var reminderTextIndex = 0;

    function preload () {
        //game.world.setBounds(0,0,1280, 3000);
        game.stage.backgroundColor = '#040404';
        game.load.image('star1', 'images/star1.png');
        game.load.image('star2', 'images/star2.png');
        game.load.image('mainCloud', 'images/cloudpuff.png');
        game.load.image('snowflake', 'images/snowflake.png');
    }

    function create () {
        var title = "To Be A Snowflake";
        var subtitle = "Press Space";
        var titleStyle = { font: "40px Times New Roman", fill: "#fff", align: "center" };
        var subtitleStyle = { font: "15px Times New Roman", fill: "#fff", align: "center" };
        textTitleObj = game.add.text(game.world.centerX, 20, title, titleStyle);
        textTitleObj.anchor.set(0.5);
        textSubTitleObj = game.add.text(game.world.centerX-40, gameHeight - 30, subtitle, subtitleStyle);
        
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
        
        var starCount = 50;
        for(var x = 0; x < starCount; x++) {
            var rx = Math.random();
            var ry = Math.random();
            var star = game.add.sprite(gameWidth*rx, gameHeight*ry, rx > ry ? 'star1' : 'star2');
            star.alpha = 0;
            stars.push(star);
        }
        
        mainCloud = game.add.sprite(0,gameHeight,'mainCloud');
        mainCloud.z = 10;
        
        
    }
    function update () {
        switch(gamePhase){
            case 0:
                titleUpdate();
                break;
            case 1:
                openingUpdate();
                break;
            case 2:
                mainGame();
                break;
            case 3:
                endGame();
                break;
        }
    }
    
    function titleUpdate() {
        if(spaceKey.isDown) {
            gamePhase = 1;
            stepPhase = 0;
            game.world.remove(textTitleObj);
            game.world.remove(textSubTitleObj);
        }
    }
    var topText;
    var topTextTween;
    function openingUpdate() {
        if(stepPhase == 0) {
            stepPhase = -1;
            var style = { font: "20px Times New Roman", fill: "#fff", align: "center", weight: "lighter"};
            topText = game.add.text(game.world.centerX, game.world.centerY, "you are a snowflake", style);
            topText.anchor.set(0.5);
            topText.alpha = 0.0;
            
            setTimeout(function() {
                topTextTween = game.add.tween(topText)
                topTextTween.to( { alpha: 1 }, 2000, "Linear", true);
                topTextTween.onComplete.add(function(){
                    stepPhase = 1;
                });
                topTextTween.start();
            }, 2000);   
        } else if(stepPhase == 1) {
            stepPhase = -1;
            setTimeout(function() {
                topTextTween.to( { alpha: 0 }, 1000, "Linear", true);
                topTextTween.onComplete.add(function(){
                    stepPhase = 2;
                });
                topTextTween.start();
            }, 1000);
        } else if(stepPhase == 2) {
            stepPhase = -1;
            stars.forEach(function(star) {
                game.add.tween(star).to( { alpha: 1 }, 2000, 'Linear', true);
            });
            setTimeout(function() {
                stepPhase = 3;
            }, 2000);
        } else if(stepPhase == 3) {
            stepPhase = -1;
            game.add.tween(mainCloud).to( {y: -450}, 3000, 'Linear', true);
            setTimeout(function() {
                snowflake = game.add.sprite(gameWidth/2, 0, 'snowflake');
                game.add.tween(snowflake).to( {y: 150}, 1000, 'Linear', true);
                var tw = game.add.tween(snowflake).to( {angle: 360}, 5000, 'Linear', true);
                var tw1 = game.add.tween(snowflake).to( {x: 100}, 4500, 'Linear', true);
                var tw2 = game.add.tween(snowflake).to( {x: 300}, 3500, 'Linear', true);
                tw1.chain(tw2);
                tw2.chain(tw1);
                tw1.start();              
                tw.repeat(-1);
                game.add.tween(mainCloud).to( {y: -600}, 2000, 'Linear', true);
                setTimeout(function() {
                    gamePhase = 2;
                    stepPhase = 0;
                    var subtitleStyle = { font: "15px Times New Roman", fill: "#fff", align: "center"};
                    reminderText = game.add.text(game.world.centerX, gameHeight - 30, reminderTexts[0], subtitleStyle);
                    reminderText.alpha = 0;
                    reminderText.anchor.set(0.5);
                    cycleReminderText();
                }, 2200);
            }, 5000);
        };
    }
    function cycleReminderText() {
        var inTween = game.add.tween(reminderText).to({alpha: 1}, 2000, 'Linear', true);
        inTween.onComplete.add(function() {
            setTimeout(function() {
               var outTween =  game.add.tween(reminderText).to({alpha: 0}, 2000, 'Linear', true);
               outTween.onComplete.add(function() {
                   reminderTextIndex++;
                   if(reminderTextIndex < reminderTexts.length) {
                        var text = reminderTexts[reminderTextIndex];
                        reminderText.setText(text);
                        setTimeout(cycleReminderText, 4000);   
                   } else {
                        gamePhase = 2;   
                   }
               });
            }, 2000)
        })
    }
    function mainGame() {
        
    }
    function endGame() {
        if(stepPhase = 1) {
            stepPhase = -1;
            stars.forEach(function(star) {
                game.add.tween(star).to( { alpha: 0 }, 2000, 'Linear', true);
            });
            setTimeout(function() {
                game.add.tween(snowflake).to({alpha: 0}, 2000, 'Linear', true);  
            }, 2000);
            setTimeout(function() {
                topText.setText('you are now one with the snowflake');
                topTextTween.to({alpha: 1}, 1000, 'linear', true);
            }, 3000);
        }
    }
    
}