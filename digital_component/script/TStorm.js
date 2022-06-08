function TStorm(aIndex){
    const spi = SPRITESHEET.STORMS;
    const pos = Object.create(Position);
    pos.x = 930;
    pos.y = 400;
    const sprite = new TSprite(imgSheet, spi, pos);
    let index = aIndex;
        
    this.draw = function(index){
            sprite.setIndex(index);
            sprite.draw();
    };
}