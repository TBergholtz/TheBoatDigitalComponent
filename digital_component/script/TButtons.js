function TButtons(aSpi, aX, aY) {
    const EButtonState = { Up: 0, Down: 1 };
    const pos = Object.create(Position);
    pos.x = aX;
    pos.y = aY;
    let spi = aSpi;
    const sp = new TSprite(imgSheet, spi, pos);
    let state = EButtonState.Up;
    const bounds = {
        left: pos.x + 5,
        top: pos.y + 5,
        right: pos.x + spi.w - 5,
        bottom: pos.y + spi.h - 5
    };
    this.draw = function () {
        sp.setIndex(state);
        sp.draw();
    };
    this.setDown = function () {
        state = EButtonState.Down;
        this.draw();
    };
    this.setUp = function () {
        if (state === EButtonState.Down) {
            state = EButtonState.Up;
            this.draw();
        }
    };
    this.isMouseOver = function () {
        return !((mousePos.x < bounds.left) || (mousePos.y < bounds.top) || (mousePos.x > bounds.right) || (mousePos.y > bounds.bottom));
    };
}