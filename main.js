kaboom({
    width: 1280,
    height: 720,
    scale: 1.24,
    debug: false
})

// [Previous asset loading code remains exactly the same...]

// Game Scene
scene("fight", () => {
    let player1TotalAttacks = 0
    let player1Hits = 0
    let player2TotalAttacks = 0
    let player2Hits = 0
    let gameOver = false
    let countInterval
    
    const background = add([
        sprite("background"),
        scale(4)
    ])

    // [Previous level setup code remains the same until player creation...]

    // Create players first
    const player1 = makePlayer(200, 100, 16, 42, 4, "player1")
    player1.use(sprite(player1.sprites.idle))
    player1.play("idle")

    const player2 = makePlayer(1000, 200, 16, 52, 4, "player2")
    player2.use(sprite(player2.sprites.idle))
    player2.play("idle")
    player2.flipX = true

    // Health bars must be created after players exist
    const player1HealthContainer = add([
        rect(500, 70),
        area(),
        outline(5),
        pos(90, 20),
        color(200,0,0)
    ])
       
    const player1HealthBar = player1HealthContainer.add([
        rect(498, 65),
        color(0,180,0),
        pos(498, 70 - 2.5),
        rotate(180)
    ])

    const player2HealthContainer = add([
        rect(500, 70),
        area(),
        outline(5),
        pos(690, 20),
        color(200,0,0)
    ])
       
    const player2HealthBar = player2HealthContainer.add([
        rect(498, 65),
        color(0,180,0),
        pos(2.5, 2.5),
    ])

    // Collision detection - must be after players are created
    player1.onCollide(player2.id + "attackHitbox", () => {
        if (gameOver || player1.isInvincible) return;
    
        if (player1.health !== 0) {
            player1.health -= 50
            player2Hits++
    
            tween(player1HealthBar.width, player1.health, 1, (val) => {
                player1HealthBar.width = val
            }, easings.easeOutSine)
        }
    
        if (player1.health === 0) {
            clearInterval(countInterval)
            declareWinner(winningText, player1, player2)
            gameOver = true
        }
    })
    
    player2.onCollide(player1.id + "attackHitbox", () => {
        if (gameOver || player2.isInvincible) return;
    
        if (player2.health !== 0) {
            player2.health -= 50
            player1Hits++
    
            tween(player2HealthBar.width, player2.health, 1, (val) => {
                player2HealthBar.width = val
            }, easings.easeOutSine)
        }
    
        if (player2.health === 0) {
            clearInterval(countInterval)
            declareWinner(winningText, player1, player2)
            gameOver = true
        }
    })

    // [Rest of the game code remains the same...]
})

// Start with the start menu
go("start")
