(function starField(Rx){
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.id = 'game-canvas';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);

  const paintStars = (stars) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';

    stars.forEach((star) => {
      ctx.fillRect(star.x, star.y, star.size, star.size);
      //ctx.moveTo(star.x, star.y);
      //ctx.arc(star.x, star.y, star.size / 2, 0, 2 * Math.PI, true);
      //ctx.fill();
    });
  };
  const SPEED = 40;
  const STAR_NUMBER = 250;
  const StarStream = Rx.Observable
    .range(1, STAR_NUMBER)
    .map(() => ({
      x: parseInt(Math.random() * canvas.width, 10),
      y: parseInt(Math.random() * canvas.height, 10),
      size: Math.random() * 3 + 1
    }))
    .toArray()
    .flatMap((starArray) => {
      return Rx.Observable.interval(SPEED)
        .map(() => {
          starArray.forEach((star) => {
            if (star.y >= canvas.height){
              star.y = 0;
            }
            star.y += star.size;
          });

          return starArray;
        });
    });
    /*.subscribe((starArray) => {
      paintStars(starArray);
    });*/

  // Hero.js
  const HERO_Y = canvas.height - 30;
  const drawTriangle = (x, y, width, color, direction) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - width, y);
    ctx.lineTo(x, direction === 'up' ? y - width : y + width);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x - width, y);
    ctx.fill();
  };
  const paintSpaceShip = (x, y) => {
    var yBoundaries = Math.max(Math.min(y, HERO_Y), 30);
    drawTriangle(x, yBoundaries, 20, '#ff0000', 'up');
  };

  const mouseMoveStream = Rx.Observable.fromEvent(canvas, 'mousemove');
  const SpaceShip = mouseMoveStream
    .map((event) => ({
      x: event.clientX,
      y: event.clientY
    }))
    .startWith({
      x: canvas.width / 2,
      y: HERO_Y
    });

  // Enemies.js
  const ENEMY_FREQ = 1500;
  const Enemies = Rx.Observable
    .interval(ENEMY_FREQ)
    .scan((enemyArray) => {
      enemyArray.push({
        x: parseInt(Math.random() * canvas.width),
        y: -30
      });
      return enemyArray;
    }, []);

  const paintEnemies = (enemies) => {
    enemies.forEach((enemy) => {
      enemy.x += getRandomInt(-10, 10);
      enemy.y += 5;

      drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
    });
  };

  // Utilities.js
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const renderScene = (actors) => {
    paintStars(actors.stars);
    paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
    paintEnemies(actors.enemies);
  };

  // Game.js
  const Game = Rx.Observable
    .combineLatest(
      StarStream, SpaceShip, Enemies,
      (stars, spaceship, enemies) => ({ stars, spaceship, enemies })
    )
    .sample(SPEED);

  Game.subscribe(renderScene);




})(Rx);
