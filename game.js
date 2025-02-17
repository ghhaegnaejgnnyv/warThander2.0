const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Constants
const BLOCK_SIZE = 40;
const WORLD_WIDTH = 20;
const WORLD_HEIGHT = 10;
const GRAVITY = 0.5;
const PLAYER_SPEED = 3;
const JUMP_FORCE = 10;

// Variables
let world = [];
let player = { x: 100, y: 100, vx: 0, vy: 0, width: 30, height: 60, onGround: false };
let selectedBlock = 'grass';
let hotbarSlots = document.querySelectorAll('.hotbar-slot');

// Generate world
function generateWorld() {
    for (let y = 0; y < WORLD_HEIGHT; y++) {
        world[y] = [];
        for (let x = 0; x < WORLD_WIDTH; x++) {
            if (y === WORLD_HEIGHT - 1) {
                world[y][x] = 'grass';
            } else if (y > WORLD_HEIGHT - 3) {
                world[y][x] = 'dirt';
            } else if (y > WORLD_HEIGHT - 6) {
                world[y][x] = 'stone';
            } else {
                world[y][x] = null;
            }
        }
    }
}

// Draw world
function drawWorld() {
    for (let y = 0; y < WORLD_HEIGHT; y++) {
        for (let x = 0; x < WORLD_WIDTH; x++) {
            if (world[y][x]) {
                ctx.fillStyle = getBlockColor(world[y][x]);
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#000';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Block colors
function getBlockColor(block) {
    switch (block) {
        case 'grass': return '#00aa00';
        case 'dirt': return '#8B4513';
        case 'stone': return '#808080';
        default: return '#000';
    }
}

// Player movement
function movePlayer() {
    player.x += player.vx;

    // Collision detection (X axis)
    let playerCol = Math.floor(player.x / BLOCK_SIZE);
    let playerRow = Math.floor(player.y / BLOCK_SIZE);
    if (world[playerRow][playerCol] || world[playerRow][playerCol + 1]) {
        player.x -= player.vx;
    }

    player.y += player.vy;

    // Collision detection (Y axis)
    playerCol = Math.floor(player.x / BLOCK_SIZE);
    playerRow = Math.floor(player.y / BLOCK_SIZE);
    if (world[playerRow][playerCol] || world[playerRow][playerCol + 1]) {
        player.y -= player.vy;
        player.vy = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }

    // Gravity
    if (!player.onGround) {
        player.vy += GRAVITY;
    }
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': player.vx = -PLAYER_SPEED; break;
        case 'ArrowRight': player.vx = PLAYER_SPEED; break;
        case ' ': if (player.onGround) player.vy = -JUMP_FORCE; break;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        player.vx = 0;
    }
});

// Handle hotbar selection
hotbarSlots.forEach(slot => {
    slot.addEventListener('click', () => {
        hotbarSlots.forEach(s => s.classList.remove('active'));
        slot.classList.add('active');
        selectedBlock = slot.getAttribute('data-block');
    });
});

// Handle mouse clicks (place/remove blocks)
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const blockX = Math.floor(mouseX / BLOCK_SIZE);
    const blockY = Math.floor(mouseY / BLOCK_SIZE);

    if (e.button === 0) { // Left click (remove block)
        world[blockY][blockX] = null;
    } else if (e.button === 2) { // Right click (place block)
        world[blockY][blockX] = selectedBlock;
    }
});

// Prevent context menu on right click
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWorld();
    movePlayer();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

// Start game
generateWorld();
gameLoop();
