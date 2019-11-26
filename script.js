var imgSrc = 'qm'
var countdownInterval
let constraintObj = { 
    audio: true, 
    video: { 
        facingMode: "user", 
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 } 
    } 
} 
console.log(navigator.mediaDevices)
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {}
    navigator.mediaDevices.getUserMedia = function(constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject)
        })
    }
}else{
    console.log('else')
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        devices.forEach(device=>{
            console.log(device.kind.toUpperCase(), device.label)
            //, device.deviceId
        })
    })
    .catch(err=>{
        console.log(err.name, err.message)
    })
}
navigator.mediaDevices.getUserMedia(constraintObj)
.then(function(mediaStreamObj) {
    //show stream
    document.getElementById('live').style.display = 'inline'
    //connect the media stream to the first video element
    let video = document.querySelector('video')
    if ("srcObject" in video) {
        video.srcObject = mediaStreamObj
    } else {
        //old version
        video.src = window.URL.createObjectURL(mediaStreamObj)
    }
    
    video.onloadedmetadata = function(ev) {
        //show in the video element what is being captured by the webcam
        video.play()
    }
    
    //add listeners for saving video/audio
    let img = document.getElementById('img')
    let vidSave = document.getElementById('recording')
    let mediaRecorder = new MediaRecorder(mediaStreamObj)
    let chunks = []
    

    img.addEventListener('click', (ev)=>{
        if (imgSrc == 'revealed' && mediaRecorder.state == 'recording') {
            //hide stream, show recording
            document.getElementById('live').style.display = 'none'
            document.getElementById('recording').style.display = 'inline'
            document.getElementById('filter').style.display = 'inline'
            mediaRecorder.stop()
            console.log(mediaRecorder.state)
        }
        if (imgSrc == 'qm') {
            //show stream, hide recording
            document.getElementById('live').style.display = 'inline'
            document.getElementById('recording').style.display = 'none'
            document.getElementById('filter').style.display = 'none'
            mediaRecorder.start()
            console.log(mediaRecorder.state)
            img.src = 'img/3.png'
            imgSrc = 3
            setInterval(function(){
                switch (imgSrc) {
                    case 3:
                        img.src = 'img/2.png'
                        imgSrc = 2
                        break
                    case 2:
                        img.src = 'img/1.webp'
                        imgSrc = 1
                        break
                    case 1:
                        img.src = 'img/meme.jpg'
                        imgSrc = 'revealed'
                        document.getElementsByClassName('message').classList.add('float-on')
                        clearInterval(countdownInterval)
                        break
                }
            }, 1000)
        }
    })
    mediaRecorder.ondataavailable = function(ev) {
        chunks.push(ev.data)
    }
    mediaRecorder.onstop = (ev)=>{
        let blob = new Blob(chunks, { 'type' : 'video/mp4' })
        chunks = []
        let videoURL = window.URL.createObjectURL(blob)
        vidSave.src = videoURL
    }
    var filter = document.getElementById('filter')
    var cssFilters = [
        {name: 'No Filter', css: 'initial'}, 
        {name: 'Blend', css: 'contrast(50%)'}, 
        {name: 'Blur', css: 'blur(3px)'}, 
        {name: 'High Contrast', css: 'contrast(150%)'}, 
        {name: 'Dim', css: 'brightness(50%)'}, 
        {name: 'Bright', css: 'brightness(150%)'}, 
        {name: 'Hue Rotation', css: 'hue-rotate(120deg)'}, 
        {name: 'Invert', css: 'invert(100%)'}, 
        {name: 'High Saturation', css: 'saturate(150%)'}, 
        {name: 'Low Saturation', css: 'saturate(50%)'}, 
        {name: 'Sepia', css: 'sepia(100%)'}
    ]
    var currentFilter = 0
    // cycle through filters on click
    filter.addEventListener('click', (ev)=>{
        currentFilter++
        currentFilter = currentFilter % cssFilters.length
        recording.style.filter = cssFilters[currentFilter].css
        filter.innerHTML = cssFilters[currentFilter].name
    })
    // pause and play recording on click
    recording.addEventListener('click', (ev)=>{
        if (recording.paused) {
            recording.play()
        } else {
            recording.pause()
        }
    })
})
.catch(function(err) { 
    console.log(err.name, err.message) 
})
/*********************************
getUserMedia returns a Promise
resolve - returns a MediaStream Object
reject returns one of the following errors
AbortError - generic unknown cause
NotAllowedError (SecurityError) - user rejected permissions
NotFoundError - missing media track
NotReadableError - user permissions given but hardware/OS error
OverconstrainedError - constraint video settings preventing
TypeError - audio: false, video: false
*********************************/