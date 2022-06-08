function TArrow(aDir) {
    const spi = SPRITESHEET.ARROWS;
    const pos = Object.create(Position);
    pos.x = 975;
    pos.y = 150;
    const sprite = new TSprite(imgSheet, spi, pos);
    let direction = aDir;

    this.draw = function () {
        sprite.setIndex(direction);
        sprite.draw();
    };
}