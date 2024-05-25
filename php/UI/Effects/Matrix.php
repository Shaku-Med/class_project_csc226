<canvas style="z-index: -1" class="bg-[transparent]" width="500" height="200" id="canv"></canvas>

<script>
    const canvas = document.getElementById('canv');
    const ctx = canvas.getContext('2d');

    if (canvas) {
        let interval

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        let cols = Math.floor(canvas.width / 20) + 1;
        let ypos = Array(cols).fill(0);

        let setCanvasSize = () => {
            clearInterval(interval);
            // 
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            cols = Math.floor(canvas.width / 20) + 1;
            ypos = Array(cols).fill(0);

            interval = setInterval(matrix, 50);
        };


        let matrix = () => {
            let theme = window.matchMedia(`(prefers-color-scheme: light)`)
            ctx.fillStyle = theme.matches ? `#ffffff16` : `#00000012`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = theme.matches ? `#000` : `#0f0`;
            ctx.font = '15pt monospace';

            ypos.forEach((y, ind) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = ind * 20;
                ctx.fillText(text, x, y);

                if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
                else ypos[ind] = y + 20;
            });
        };

        let resizeCanvas = () => {
            setCanvasSize();
        };

        window.addEventListener('resize', resizeCanvas);

        interval = setInterval(matrix, 50);
    }
</script>