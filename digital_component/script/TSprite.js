"use strict";


function TPoint(aX, aY){
    this.x = aX;
    this.y = aY;
}

function TSprite(aSheet, aSpriteInfo, aPos, aIndex = 0, aRow = 0) {
  const sheet = aSheet;
  const si = aSpriteInfo;
  const pos = aPos;
  let spIndex = aIndex;
  const row = aRow;
  let round = 0;
  const scale = {x: 1, y: 1};

  if(si.gap === undefined){
    si.gap = 0;
  }
  if(si.loop === undefined){
    si.loop = 0;
  }

  this.draw = function () {
    const index = Math.floor(spIndex);
    const x = si.x + ((si.w + si.gap) * index);
    const y = si.y + (si.h * row);
    const oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = si.alpha;
    ctx.drawImage(sheet, x , y, si.w, si.h, pos.x, pos.y,  Math.floor(si.w * scale.x), Math.floor(si.h * scale.y));
    ctx.globalAlpha = oldAlpha;
    if (round < si.loop) {
      spIndex += si.speed;
      if (spIndex > si.count) {
        spIndex = 0;
        round++;
      }
    }
  };

  this.setIndex = function (aIndex) {
    round = 0;
    spIndex = aIndex;
  };

  this.getIndex = function(){
    return spIndex;
  };

  this.isDone = function () {
    return round >= si.loop;
  };

  this.incIndex = function () {
    spIndex++;
    if (spIndex > si.count) {
      spIndex = 0;
    }
  };

  this.setScale = function(aScale){
    scale.x = aScale.x;
    scale.y = aScale.y;
  }

}
