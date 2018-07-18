
var bear;
var IsWet = false;
var mission = true;
var enemy = {
    Etype,
}
var story = {
    main,
}
var Dryer = {
    fire,
    wind,
}

$(document).ready(function(){
    
    if(IsWet){ // Wet
        bear.hp; // reduce more slower
        bear.speed; // slow
        bear.weight; // heavy
        bear.jump; // low
        bear.powerUps;// true
    }
    else{ // Dry
        bear.hp; // reduce more faster
        bear.speed; // fast
        bear.weight; // thin
        bear.jump; // high
        bear.powerUps;// false
    }
    
    mission.need = true;
    
    while(mission){
          if(mission.need == IsWet){
              //bear need to find water to get wet
          }
        else{
            //bear should be dry to acess the mission
        }
    mission.type = IsWet || mission.type != IsWet;
    //might meet strong wind, bear need to get water to against wind.
    //might trigger some switch, it may ask the weight.
    //might need power to open something, thus bear need be wet at that time.
    //In some mission might have trap need to avoid, at that time bear need to think how to using the wet or not to avoid the trap
    }
    
    /* some bad guy steal something from kingdom. Make the kingdom raining, the cotton will not able to live.*/
    story.main;
    
    
    
}); // end ready

/*布偶熊
布偶熊公主
吸水的熊 慢但不容易噴棉花
烘乾熊 快但容易噴棉花
利用熊有沒有濕掉來應對
*/