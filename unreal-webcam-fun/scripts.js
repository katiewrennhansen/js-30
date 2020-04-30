const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        }) 
        .catch(err => {
            console.error(err)
        })
}

function setVideo(){
    const height = video.videoHeight;
    const width = video.videoWidth;
    canvas.height = height;
    canvas.width = width;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        //remove pixels
        let pixels = ctx.getImageData(0, 0, width, height);

        //red filter
        // pixels = redFilter(pixels);

        //color split filter
        // pixels = colorSplitFilter(pixels);
        // ctx.globalAlpha = 0.1;

        //green screen
        pixels = greenScreen(pixels)

        //put pixels back 
        ctx.putImageData(pixels, 0, 0);

    }, 16)
}

function takePhoto(){
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'Image');
    link.innerHTML = `<img src="${data}" alt="Image">`
    strip.insertBefore(link, strip.firstChild);
}

function redFilter(pixels){
    for(i = 0; i < pixels.data.length; i+=4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100 // Red
        pixels.data[i + 1] = pixels.data[i + 1] - 100 // Green
        pixels.data[i + 2] = pixels.data[i + 2] - 200 // Blue
    }
    return pixels
}

function colorSplitFilter(pixels){
    for(i = 0; i < pixels.data.length; i+=4){
        pixels.data[i + 100] = pixels.data[i + 0] // Red
        pixels.data[i - 200] = pixels.data[i + 1] // Green
        pixels.data[i + 200] = pixels.data[i + 2] // Blue
    }
    return pixels
}

function greenScreen(pixels){
    const levels = {};

    [...document.querySelectorAll('.rgb input')].forEach((input) => {
        levels[input.name] = input.value
    });

    for(i = 0; i < pixels.data.length; i+=4){
        red = pixels.data[i + 1];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if(red >= levels.rmin 
            && green >= levels.gmin 
            && blue >= levels.bmin
            && red <= levels.bmax
            && green <= levels.gmax
            && blue <= levels.bmax){
                pixels.data[i + 3] = 0;
            }
    }
    return pixels;
}


getVideo();

video.addEventListener('canplay', setVideo);