kaboom({
    width: 1280,
    height: 720,
    scale: 1.24,
    debug: false
})

loadSprite("background", "assets/background/background_layer_1.png")
loadSprite("trees", "assets/background/background_layer_2.png")
loadSpriteAtlas("assets/oak_woods_tileset.png", {
    "ground-golden": {
        "x": 16,
        "y": 0,
        "width": 16,
        "height": 16,
    },
    "deep-ground": {
        "x": 16,
        "y": 32,
        "width": 16,
        "height": 16
    },
    "ground-silver": {
        "x": 150,
        "y": 0,
        "width": 16,
        "height": 16
    }
})

loadSprite("shop", "assets/shop_anim.png", {
    sliceX: 6,
    sliceY: 1,
    anims: {
        "default": {
            from: 0,
            to: 5,
            speed: 12,
            loop: true
        }
    }
})
loadSprite("fence", "assets/fence_1.png")
loadSprite("sign", "assets/sign.png")

loadSprite("idle-player1", "assets/idle-player1.png", {
    sliceX: 8, sliceY: 1, anims: { "idle": {from: 0, to: 7, speed: 12, loop: true} }
})
loadSprite("jump-player1", "assets/jump-player1.png", {
    sliceX: 2, sliceY: 1, anims: { "jump": { from: 0, to: 1, speed: 2, loop: true} }
})
loadSprite("attack-player1", "assets/attack-player1.png", {
    sliceX: 6, sliceY: 1, anims: { "attack": { from: 1, to: 5, speed: 10} }
})
loadSprite("run-player1", "assets/run-player1.png", {
    sliceX: 8, sliceY: 1, anims: { "run": { from: 0, to: 7, speed: 18} }
})
loadSprite("death-player1", "assets/death-player1.png", {
    sliceX: 6, sliceY: 1, anims: { "death": { from: 0, to: 5, speed: 10} }
})

loadSprite("idle-player2", "assets/idle-player2.png", {
    sliceX: 4, sliceY: 1, anims: { "idle": { from: 0, to: 3, speed: 8, loop: true} }
})
loadSprite("jump-player2", "assets/jump-player2.png", {
    sliceX: 2, sliceY: 1, anims: { "jump": { from: 0, to: 1, speed: 2, loop: true} }
})
loadSprite("attack-player2", "assets/attack-player2.png", {
    sliceX: 4, sliceY: 1, anims: { "attack": { from: 0, to: 3, speed: 10} }
})
loadSprite("run-player2", "assets/run-player2.png", {
    sliceX: 8, sliceY: 1, anims: { "run": { from: 0, to: 7, speed: 18} }
})
loadSprite("death-player2", "assets/death-player2.png", {
    sliceX: 7, sliceY: 1, anims: { "death": { from: 0, to: 6, speed: 10} }
})

// Start Menu Scene
scene("start", () => {
    const startText = add([
        text("Press ENTER to Start", { size: 48 }),
        pos(center()),
        anchor("center"),
        color(255, 255, 255),
    ])

    onKeyPress("enter", () => {
        go("fight") // Transition to the fight scene when the Enter key is pressed
    })
})

scene("fight", () => {
    let player1TotalAttacks = 0
    let player1Hits = 0
    let player2TotalAttacks = 0
    let player2Hits = 0
    const background = add([
        sprite("background"),
        scale(4)
    ])

    background.add([
        sprite("trees"),
    ])

    const groundTiles = addLevel([
        "","","","","","","","","",
        "------#######-----------",
        "dddddddddddddddddddddddd",
        "dddddddddddddddddddddddd"
    ], {
        tileWidth: 16,
        tileHeight: 16,
        tiles: {
            "#": () => [
                sprite("ground-golden"),
                area(),
                body({isStatic: true})
            ],
            "-": () => [
                sprite("ground-silver"),
                area(),
                body({isStatic: true}),
            ],
            "d": () => [
                sprite("deep-ground"),
                area(),
                body({isStatic: true})
            ]
        }
    })
    
    groundTiles.use(scale(4))

    const shop = background.add([
        sprite("shop"),
        pos(170, 15),
    ])

    shop.play("default")

    // left invisible wall
    add([
        rect(16, 720),
        area(),
        body({isStatic: true}),
        pos(-20,0)
    ])

    // right invisible wall
    add([
        rect(16, 720),
        area(),
        body({isStatic: true}),
        pos(1280,0)
    ])

    background.add([
        sprite("fence"),
        pos(85, 125)
    ])

    background.add([
        sprite("fence"),
        pos(10, 125)
    ])

    background.add([
        sprite("sign"),
        pos(290, 115)
    ])

    // Life bars
    const player1LifeBar = add([
        rect(200, 20),
        pos(50, 20),
        color(255, 0, 0),
        { value: 500 }
    ])

    const player2LifeBar = add([
        rect(200, 20),
        pos(1030, 20),
        color(0, 0, 255),
        { value: 500 }
    ])

    function updateLifeBar() {
        player1LifeBar.width = player1.health / 500 * 200
        player2LifeBar.width = player2.health / 500 * 200
    }

    // Timer
    let timeRemaining = 60 // Time in seconds
    const timerLabel = add([
        text("Time: " + timeRemaining, { size: 24 }),
        pos(center().x, 20),
        anchor("center"),
        color(255, 255, 255),
    ])

    // Countdown Timer
    loop(1, () => {
        if (timeRemaining > 0) {
            timeRemaining--
            timerLabel.text = "Time: " + timeRemaining
        } else if (timeRemaining === 0) {
            console.log("Time's up!")
            go("start") // Go back to start menu if time runs out
        }
    })

    function makePlayer(posX, posY, width, height, scaleFactor, id) {
        return add([
            pos(posX, posY),
            scale(scaleFactor),
            area({ shape: new Rect(vec2(0), width, height) }),
            anchor("center"),
            body({ stickToPlatform: true }),
            {
                isCurrentlyJumping: false,
                isInvincible: false,
                health: 500,
                sprites: {
                    run: "run-" + id,
                    idle: "idle-" + id,
                    jump: "jump-" + id,
                    attack: "attack-" + id,
                    death: "death-" + id
                }
            }
        ])
    }

    setGravity(1200)

    const player1 = makePlayer(200, 100, 16, 42, 4, "player1")
    player1.use(sprite(player1.sprites.idle))
    player1.play("idle")

    function run(player, speed, flipPlayer) {
        if (player.health === 0) {
            return
        }
    
        if (player.curAnim() !== "run"
            && !player.isCurrentlyJumping) {
            player.use(sprite(player.sprites.run))
            player.play("run")
        }
        player.move(speed, 0)
        player.flipX = flipPlayer
    }

    function resetPlayerToIdle(player) {
        player.use(sprite(player.sprites.idle))
        player.play("idle")
    }

    onKeyDown("d", () => {
        run(player1, 500, false)
    })
    onKeyRelease("d", () => {
        if (player1.health !== 0) {
            resetPlayerToIdle(player1)
            player1.flipX = false
        }
    })

    onKeyDown("a", () => {
        run(player1, -500, true)
    })
    onKeyRelease("a", () => {
        if (player1.health !== 0) {
            resetPlayerToIdle(player1)
            player1.flipX = true
        }
    })

    function makeJump(player) {
        if (player.health === 0) return;
    
        if (player.isGrounded()) {
            const currentFlip = player.flipX
            player.jump(900)
            player.use(sprite(player.sprites.jump))
            player.flipX = currentFlip
            player.play("jump")
            player.isCurrentlyJumping = true
    
            // Make the player invincible for 0.10 seconds
            player.isInvincible = true
            wait(0.10, () => {
                player.isInvincible = false
            })
        }
    }

    function resetAfterJump(player) {
        if (player.isGrounded() && player.isCurrentlyJumping) {
            player.isCurrentlyJumping = false
            if (player.curAnim() !== "idle") {
                resetPlayerToIdle(player)
            }
        }
    }

    onKeyDown("w", () => {
        makeJump(player1)
    })

    player1.onUpdate(() => resetAfterJump(player1))

    function attack(player, excludedKeys) {
        if (player.health === 0) {
            return
        }
    
        for (const key of excludedKeys) {
            if (isKeyDown(key)) {
                return
            }
        }
    
        const currentFlip = player.flipX
        if (player.curAnim() !== "attack") {
            player.use(sprite(player.sprites.attack))
            player.flipX = currentFlip
            const slashX = player.pos.x + 30
            const slashXFlipped = player.pos.x - 350
            const slashY = player.pos.y - 200
            
            add([
                rect(300, 300),
                area(),
                pos(currentFlip ? slashXFlipped : slashX, slashY),
                opacity(0),
                player.id + "attackHitbox"
            ])
            if (player === player1) player1TotalAttacks++
            if (player === player2) player2TotalAttacks++

            player.play("attack", {
                onEnd: () => {
                    resetPlayerToIdle(player)
                    player.flipX = currentFlip
                }
            }) 
        }
    }

    onKeyPress("space", () => {
        attack(player1, ["a", "d", "w"])
    })

    onKeyRelease("space", () => {
        destroyAll(player1.id + "attackHitbox")
    })

    const player2 = makePlayer(1000, 200, 16, 52, 4, "player2")
    player2.use(sprite(player2.sprites.idle))
    player2.play("idle")
    player2.flipX = true

    onKeyDown("right", () => {
        run(player2, 500, false)
    })
    onKeyRelease("right", () => {
        if (player2.health !== 0) {
            resetPlayerToIdle(player2)
            player2.flipX = false
        }
    })

    onKeyDown("left", () => {
        run(player2, -500, true)
    })
    onKeyRelease("left", () => {
        if (player2.health !== 0) {
            resetPlayerToIdle(player2)
            player2.flipX = true
        }
    })

    onKeyDown("up", () => {
        makeJump(player2)
    })

    player2.onUpdate(() => resetAfterJump(player2))

    onKeyPress("down", () => {
        attack(player2, ["left", "right", "up"])
    })

    onKeyRelease("down", () => {
        destroyAll(player2.id + "attackHitbox")
    })

    // Restart functionality when the game is over
    let gameOver = false
    onKeyDown("r", () => {
        gameOver = false
        go("fight")
    })

    // Game over check
    player1.onUpdate(() => {
        if (player1.health <= 0 && !gameOver) {
            gameOver = true
            console.log("Player 2 wins!")
            go("start") // Go back to the start menu when the game ends
        }
    })
    player2.onUpdate(() => {
        if (player2.health <= 0 && !gameOver) {
            gameOver = true
            console.log("Player 1 wins!")
            go("start") // Go back to the start menu when the game ends
        }
    })
})

go("start") // Start the game with the start menu scene
