(function starField(Rx){
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

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
  const starStream = Rx.Observable
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
    })
    .subscribe((starArray) => {
      paintStars(starArray);
    });

})(Rx);
