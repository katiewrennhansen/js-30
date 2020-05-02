window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const msg = new SpeechSynthesisUtterance();
const recognition = new SpeechRecognition();

let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const campContainer = document.querySelector('.campgrounds-container');
const campgrounds = document.querySelector('.campgrounds');
const campTitle = document.querySelector('h2');
const camps = document.querySelectorAll('.camp');

//populate select menu with voices
function populateVoices(){
    voices = this.getVoices();
    const voiceOptions = voices
        .map(voice => `<option value="${voice.name}">${voice.name} - ${voice.lang}</option>"`)
        .join()
    voicesDropdown.innerHTML = voiceOptions;
}

//voice active voice
function setVoice(){
    msg.voice = voices.find(voice => voice.name === this.value);
}

//change voice options
function changeOptions(){
    msg[this.name] = this.value;
}

//start/stop voice
function toggle(startOver = true){
    speechSynthesis.cancel();
    if(startOver){
        speechSynthesis.speak(msg);
    }
}

function changeInfo(){
    const el = event.target
    if(el.classList.contains('camp')){
        const info = event.target.querySelector('.info')
        const img = event.target.querySelector('img')
        if(info.style.display === 'block'){
            info.style.display = 'none';
            img.style.display = 'block';
        } else {
            info.style.display = 'block';
            img.style.display = 'none';
        }
    }
}
   

function fetchCampgrounds(){
    fetch('https://developer.nps.gov/api/v1/parks?stateCode=CO&api_key=1Yj4y2ro1kFcX7neOlaZejbfA9H14d8BCKubGmO4')
        .then(res => res.json())
        .then(resJson => {
            campTitle.innerText = 'Campgrounds';
            const data = resJson.data;
            data.map(camp => {
                const newCamp = document.createElement('div');
                newCamp.classList.add('camp')

                //Create title
                const name = document.createElement('h3');
                name.textContent = camp.fullName;
                newCamp.appendChild(name);

                //create photo
                const photo = document.createElement('img');
                photo.setAttribute('src', camp.images[0].url);
                newCamp.appendChild(photo);

                //create information
                const info = document.createElement('div');
                info.classList.add('info');
                const address = document.createElement('address')
                address.textContent = `${camp.addresses[0].line1}, ${camp.addresses[0].city}, ${camp.addresses[0].stateCode} ${camp.addresses[0].postalCode}`
                info.appendChild(address)
                const description = document.createElement('p')
                description.textContent = camp.description;
                info.appendChild(description)

                newCamp.appendChild(info)
                //append
                campgrounds.appendChild(newCamp);
            })
        })
        .catch(err => console.log(err))
}


//event listeners
document.addEventListener('click', changeInfo);
speechSynthesis.addEventListener('voiceschanged', populateVoices)
voicesDropdown.addEventListener('change', setVoice)
recognition.addEventListener('result', function(e){
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join(' ')

    if(transcript.includes('voice person')){
        msg.text = 'hello Katie, how can i help';
        toggle();
    }
    if(transcript.includes('good morning' || 'hi' || 'hello')){
        msg.text = 'Hello';
        toggle();
    }
    if(transcript.includes('how are you')){
        msg.text = 'I am well, and you?';
        toggle();
    }
    if(transcript.includes('find campgrounds')){
        fetchCampgrounds();
    }

});
recognition.addEventListener('end', recognition.start);
recognition.start();