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
        pos(-20, 0)
    ])

    // right invisible wall
    add([
        rect(16, 720),
        area(),
        body({isStatic: true}),
        pos(1280, 0)
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
    
        if (player.curAnim() !== "run" && !player.isCurrentlyJumping) {
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
            player.play("attack")
            player.flipX = currentFlip
        }
    }
    
    function checkCollision(player, enemy) {
        if (player.health === 0 || enemy.health === 0) {
            return
        }
    
        if (player.isTouching(enemy)) {
            if (!player.isInvincible) {
                enemy.health -= 25
            }
        }
    }
    
    onKeyDown("space", () => {
        attack(player1, ["a", "d", "w"])
    })

    player1.onUpdate(() => checkCollision(player1, player2))

    function restartGame() {
        go("fight")
    }

    const restartButton = add([
        text("Restart", { size: 32 }),
        pos(center().x, center().y + 200),
        anchor("center"),
        color(0, 255, 0),
        area(),
        scale(1.5)
    ])

    restartButton.onClick(() => restartGame())
})

go("start")
