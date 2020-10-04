# Software Studio 2019 Spring Assignment_02

## Topic
* Project Name : /Assignment_02_106062231

## Basic Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Completed game process|15%|Y|
|Basic rules|20%|Y|
|Jucify mechanisms|15%|Y|
|Animation|10%|Y|
|Particle Systems|10%|Y|
|Sound effects|5%|Y|
|UI|5%|Y|
|Leaderboard|5%|Y|
|Appearance|5%||

## Bonus
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Multi-player|20%|N|
|Bullet automatic aiming|5%|N|
|Unique bullet|5%|Y|
|Little helper|5%|N|
|Boss|5%|N|

# 作品網址： https://106062231.gitlab.io/Assignment_02

# Components Description : 
1. completed game process->一開始，即進入了遊戲主畫面，可以選level 1 or level 2 or scoreboard ，而點選level 1 or level 2 即可進入遊戲，遊戲結束則會進到game over的state，而在game over的state可以按restart回到遊戲主畫面。
2. Basic rules->
   • player : 按空白鍵可以做最基礎的發射，按上下左右鍵可以上下左右移動，並且在觸及敵人發出的子彈會  生命值減少
   • Enemy : 系統會自動產生enemy 並且任一個enemy會自動移動並且發射子彈
   • Map : 背景會緩慢移動
3. Jucify mechanisms->
   •Level : 有level 1 跟 level 2 可以玩，在level 2 時有第三種怪物會出現，而第三種怪物會追隨你在哪裡而將子彈往那發射
   •Skill : 當你的分數到達100分以上後，你即可使用Ultimate skills，而使用ultimate skills的方法為按U這個鍵，只要按一次，即可發射5發子彈去攻擊怪物
4. Animations -> 飛機的尾巴的火會一直噴射
5. Particle Systems -> 當怪獸輩子彈攻擊時即會產生爆炸的效果，而當player死掉時也會發生爆炸的效果
6. Sound effects -> 
   (1)發射子彈時
   (2)怪獸或玩家爆炸時
   (3)在下面那條工具列可以調音量大小
7. UI->
   •Player health->下面那列的愛心
   •Ultimate skill number or power-> 只要吃到愛心圖案即能有skill，上限為三個，圖案為小怪物
   •Score->左下角
   •volume control->下面那列的音量鍵
   •Game paus->下面那列的暫停鍵
8. Leaderboard -> 在主頁面按右下的的score圖是即可進入scoreboard，那裡會顯示目前分數最高的五個玩家及分數

# Bonus : 
1. Enhanced items ->當玩家吃到愛心時，他的skill值會增加，而skill值的上限為3，每使用一次就會少一
   • Unique bullet :當自己有skill值時，按按鍵A即可發射散射彈，往四面噴射
2. 怪獸的子彈會跟隨player-> 在level2時，第三種怪獸的子彈會發射至現在player的位置 ，讓player被射中的機率提高
  
![alt text](example.gif)
