kaboom({
    width: 1280,
    height: 720,
    scale: 1.24,
    debug: false
})

loadSprite("background", "assets/background/background_layer_1.png")
// (other sprite loads)

function createStartMenu() {
    const startMenu = add([
        rect(width(), height()),
        color(0, 0, 0),
        opacity(0.7),
        pos(0, 0)
    ])

    const title = add([
        text("Fighting Game", { size: 64 }),
        pos(center().x, center().y - 100),
        anchor("center"),
        color(255, 255, 255)
    ])

    const tutorialText = add([
        text("Controls:\nA/D - Move\nW - Jump\nSpace - Attack\nArrow Keys - Player 2\nEnter - Restart", { size: 24 }),
        pos(center().x, center().y + 50),
        anchor("center"),
        color(255, 255, 255)
    ])

    const startButton = add([
        text("Start Game", { size: 32 }),
        pos(center().x, center().y + 150),
        anchor("center"),
        color(255, 255, 0),
        area(),
        scale(1.5)
    ])

    startButton.onClick(() => {
        go("fight")
        destroy(startMenu)
        destroy(title)
        destroy(tutorialText)
        destroy(startButton)
    })
}

scene("start", () => {
    createStartMenu()
})

scene("fight", () => {
    let player1TotalAttacks = 0
    let player1Hits = 0
    let player2TotalAttacks = 0
    let player2Hits = 0

    // (Your existing fight scene code here)

    const restartButton = add([
        text("Restart", { size: 32 }),
        pos(center().x, center().y + 200),
        anchor("center"),
        color(0, 255, 0),
        area(),
        scale(1.5)
    ])

    restartButton.onClick(() => {
        go("fight")
        gameOver = false
    })

    // (Rest of your game logic)
})

go("start")  // Starting the game at the start scene
