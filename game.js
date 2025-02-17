let camera, scene, renderer, player;
let enemies = [];
let bullets = [];
let health = 100;
let score = 0;
let moveSpeed = 0.2;
let mouseX = 0;
let mouseY = 0;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 0);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Player
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(geometry, material);
    player.position.y = 1;
    scene.add(player);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI/2;
    scene.add(floor);

    // Camera position
    camera.position.set(0, 5, 5);
    camera.lookAt(player.position);

    // Controls
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', shoot);

    // Spawn enemies
    setInterval(spawnEnemy, 3000);
}

function spawnEnemy() {
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geometry, material);
    
    enemy.position.x = (Math.random() - 0.5) * 20;
    enemy.position.z = (Math.random() - 0.5) * 20;
    enemy.position.y = 0.5;
    
    scene.add(enemy);
    enemies.push(enemy);
}

function onKeyDown(event) {
    switch(event.key) {
        case 'w': player.position.z -= moveSpeed; break;
        case 's': player.position.z += moveSpeed; break;
        case 'a': player.position.x -= moveSpeed; break;
        case 'd': player.position.x += moveSpeed; break;
    }
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function shoot() {
    const bulletGeometry = new THREE.SphereGeometry(0.1);
    const bulletMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    bullet.position.copy(player.position);
    bullet.position.y += 1;
    
    const direction = new THREE.Vector3(mouseX, mouseY, -1);
    direction.unproject(camera);
    direction.sub(bullet.position).normalize();
    
    bullet.velocity = direction.multiplyScalar(0.5);
    scene.add(bullet);
    bullets.push(bullet);
}

function update() {
    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.position.add(bullet.velocity);
        
        // Check collisions
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.position.distanceTo(enemy.position) < 1) {
                scene.remove(enemy);
                scene.remove(bullet);
                enemies.splice(enemyIndex, 1);
                bullets.splice(index, 1);
                score += 10;
                document.getElementById('score').textContent = score;
            }
        });

        // Remove old bullets
        if (bullet.position.length() > 50) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });

    // Update enemies
    enemies.forEach(enemy => {
        const direction = new THREE.Vector3();
        direction.subVectors(player.position, enemy.position).normalize();
        enemy.position.add(direction.multiplyScalar(0.02));
        
        // Enemy collision with player
        if (enemy.position.distanceTo(player.position) < 1) {
            health -= 1;
            document.getElementById('health').textContent = health;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});