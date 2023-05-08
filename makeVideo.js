export default class makeVideo {

  constructor(opts) {
    Object.assign(this, opts);
    this.videoList = document.querySelector(".video-list")
    this.playControls = document.querySelector(".video-controls")
    this.playButton = document.querySelector("#play-button")
    this.valX = 0
    this.valY = 0
    this.valScale = 1
    this.settingsOpen = false
    this.isPlaying = false;
    this.timeCurr
    this.timeStart
    this.timeEnd
    this.playbackRate


    /// 1. Take in video data, and create video object with start, end, and duration
    /// 2. Make a settings panel using the objects start, end and duration
    /// 3. When users adjust settings, update the video object
    /// 4. Make functions that handle:
    ///    Play, pause, set start, set end, 

    this.createVideo()
  }

  createVideo() {
    this.id = makeID(5);

    this.videoContainer = document.createElement("div") // Make video container
    this.videoContainer.classList.add("video-container", `id-${this.id}`)
    this.video = document.createElement('video')
    this.video.src = this.url

    this.videoContainer.appendChild(this.video)
    this.videoList.appendChild(this.videoContainer)
    this.videoList.append(document.querySelector(".video-drop-zone"))

    this.video.onloadedmetadata = (e) => { // When the video meta data is present, set times and make settings
      let video = e.target;
      this.timeCurr = video.currentTime
      this.timeStart = video.currentTime
      this.timeEnd = video.duration
      this.createSettings()
    }

    this.settingsButton = document.createElement("button")
      this.settingsButton.classList.add("settings-button", "active")
      this.settingsButton.innerText = "Edit"
      this.videoContainer.appendChild(this.settingsButton)

    this.videoBorder = document.createElement("div")
      this.videoBorder.classList.add("video-border")
      this.videoContainer.appendChild(this.videoBorder)

    this.playControls.classList.add("active")
  }


  createSettings() {
    // Make video settings container
    this.videoSettings = document.createElement("div")
    this.videoSettings.classList.add("video-settings-container")

    // Make multi-range slider (https://codepen.io/MinzCode/pen/MWKgyqb)
    this.multiRangeSliderContainer = document.createElement("div")
      this.multiRangeSliderContainer.classList.add("multi-range-slider")

    this.multiRangeSliderLabel = document.createElement("p")
      this.multiRangeSliderLabel.classList.add("video-settings-label")
      this.multiRangeSliderLabel.innerText = "Trim"
      this.multiRangeSliderContainer.append(this.multiRangeSliderLabel)

    this.inputStart = document.createElement("input")
      this.inputStart.classList.add("range-input")
      this.inputStart.setAttribute("type", "range")
      this.inputStart.setAttribute("min", "0")
      this.inputStart.setAttribute("max", this.timeEnd)
      this.inputStart.setAttribute("value", "0")
      this.inputStart.setAttribute("step", "any")
      this.multiRangeSliderContainer.append(this.inputStart)

    this.inputEnd = document.createElement("input")
      this.inputEnd.classList.add("range-input")
      this.inputEnd.setAttribute("type", "range")
      this.inputEnd.setAttribute("min", "0")
      this.inputEnd.setAttribute("max", this.timeEnd)
      this.inputEnd.setAttribute("value", this.timeEnd)
      this.inputEnd.setAttribute("step", "any")
      this.multiRangeSliderContainer.append(this.inputEnd)

    this.videoSettings.appendChild(this.multiRangeSliderContainer)

    this.fauxSliderContainer = document.createElement("div")
      this.fauxSliderContainer.classList.add("faux-slider-container")

    this.fauxSliderTrack = document.createElement("div")
      this.fauxSliderTrack.classList.add("faux-slider-track")
      this.fauxSliderContainer.append(this.fauxSliderTrack)
    
    this.fauxSliderRange = document.createElement("div")
      this.fauxSliderRange.classList.add("faux-slider-range")
      this.fauxSliderContainer.append(this.fauxSliderRange)
    
    this.fauxSliderThumbLeft = document.createElement("div")
      this.fauxSliderThumbLeft.classList.add("faux-slider-thumb", "left")
      this.fauxSliderContainer.append(this.fauxSliderThumbLeft)

    this.fauxSliderThumbLeftText = document.createElement("div")
      this.fauxSliderThumbLeftText.classList.add("faux-slider-text")
      this.fauxSliderThumbLeftText.innerText = `${this.timeStart.toFixed(2)}s`
      this.fauxSliderThumbLeft.append(this.fauxSliderThumbLeftText)  

    this.fauxSliderThumbRight = document.createElement("div")
      this.fauxSliderThumbRight.classList.add("faux-slider-thumb", "right")
      this.fauxSliderContainer.append(this.fauxSliderThumbRight)
    
    this.fauxSliderThumbRightText = document.createElement("div")
      this.fauxSliderThumbRightText.classList.add("faux-slider-text")
      this.fauxSliderThumbRightText.innerText = `${this.timeEnd.toFixed(2)}s`
      this.fauxSliderThumbRight.append(this.fauxSliderThumbRightText)  

    this.multiRangeSliderContainer.appendChild(this.fauxSliderContainer)

    this.inputStart.addEventListener("input", (e) => this.handleTrimInput(e, "start"));
    this.inputEnd.addEventListener("input", (e) => this.handleTrimInput(e, "end"));

    // Make row with transform inputs
    this.positionInputContainer = document.createElement("div")
    this.positionInputContainer.classList.add("input-row")
    this.videoSettings.append(this.positionInputContainer)

    // Scale input
    this.scaleInputContainer = document.createElement("div")
    this.scaleInputContainer.classList.add("scale-input-container")
    this.positionInputContainer.append(this.scaleInputContainer)

    this.scaleInputLabel = document.createElement("p")
    this.scaleInputLabel.classList.add("video-settings-label")
    this.scaleInputLabel.innerText = "Scale"
    this.scaleInputContainer.append(this.scaleInputLabel)

    this.scaleInput = document.createElement("input")
    this.scaleInput.classList.add("scale-input")
    this.scaleInput.setAttribute("type", "range")
    this.scaleInput.setAttribute("min", "1")
    this.scaleInput.setAttribute("max", "3")
    this.scaleInput.setAttribute("value", "1")
    this.scaleInput.setAttribute("step", "any")
    this.scaleInputContainer.append(this.scaleInput)

    // Translate inputs
    this.translateContainer = document.createElement("div")
    this.translateContainer.classList.add("translate-container")
    this.positionInputContainer.append(this.translateContainer)

    this.translateInputLabel = document.createElement("p")
    this.translateInputLabel.classList.add("video-settings-label")
    this.translateInputLabel.innerText = "Move (x,y)"
    this.translateContainer.append(this.translateInputLabel)

    this.translateXInput = document.createElement("input")
    this.translateXInput.classList.add("transform-x-input")
    this.translateXInput.setAttribute("type", "number")
    this.translateXInput.setAttribute("placeholder", "x")
    this.translateXInput.setAttribute("min", "-100")
    this.translateXInput.setAttribute("max", "100")
    this.translateXInput.setAttribute("value", "0")
    this.translateXInput.setAttribute("step", "5")
    this.translateContainer.append(this.translateXInput)

    this.translateYInput = document.createElement("input")
    this.translateYInput.classList.add("transform-y-input")
    this.translateYInput.setAttribute("type", "number")
    this.translateYInput.setAttribute("placeholder", "y")
    this.translateYInput.setAttribute("min", "-100")
    this.translateYInput.setAttribute("max", "100")
    this.translateYInput.setAttribute("value", "0")
    this.translateYInput.setAttribute("step", "5")
    this.translateContainer.append(this.translateYInput)

    // Event listeners for transforms inputs
    this.scaleInput.addEventListener("input", (e) => this.handleTransform(e, "scale"));
    this.translateXInput.addEventListener("input", (e) => this.handleTransform(e, "x"));
    this.translateYInput.addEventListener("input", (e) => this.handleTransform(e, "y"));

    // Handle opening and closing settings panel
    this.playButton.addEventListener("pointerdown", () => this.toggleSettingsEditButton())
    this.settingsButton.addEventListener("pointerdown", () => this.toggleSettings())
  
    this.videoContainer.appendChild(this.videoSettings)
  }

  handleTrimInput(e, direction) {
    let val = parseFloat(e.target.value)
    let max = parseFloat(this.video.duration)
    let percent = (val / max) * 100

    switch(direction) {
      case "start":
        this.fauxSliderThumbLeft.style.left = `${percent}%`;
        this.fauxSliderRange.style.left = `${percent}%`
        this.fauxSliderThumbLeftText.innerText = `${val.toFixed(2)}s`
        this.timeStart = val
        this.video.currentTime = this.timeStart
      break;
      case "end":
        this.fauxSliderThumbRight.style.right = `${100 - percent}%`
        this.fauxSliderRange.style.right = `${100 - percent}%`
        this.fauxSliderThumbRightText.innerText = `${val.toFixed(2)}s`
        this.timeEnd = val
        this.video.currentTime = this.timeEnd
      break;
    }
  }

  handleTransform(e, type) {
    switch(type) {
      case "scale": this.valScale = e.target.value 
        this.video.style.transform = `scale(${this.valScale}) translate(${this.valX}px , ${this.valY}px)`
        break;
      case "x": this.valX = e.target.value
        this.video.style.transform = `scale(${this.valScale}) translate(${this.valX}px , ${this.valY}px)`
        break;
      case "y": this.valY = e.target.value
        this.video.style.transform = `scale(${this.valScale}) translate(${this.valX}px , ${this.valY}px)`
        break;
    }
  }

  toggleSettings() {
    if (this.settingsOpen) {
      this.settingsOpen = false
      this.videoSettings.classList.remove("active")
      this.settingsButton.innerText = "Edit"
      this.settingsButton.classList.remove("editing")
      this.playControls.classList.add("active")
      this.videoContainer.classList.remove("editing")
    } else {
      this.settingsOpen = true
      this.videoSettings.classList.add("active")
      this.settingsButton.innerText = "Done"
      this.settingsButton.classList.add("editing")
      this.playControls.classList.remove("active")
      this.videoContainer.classList.add("editing")
    }
  }

  toggleSettingsEditButton() {
    if (this.isPlaying) {
      this.isPlaying = false
      this.settingsButton.classList.add("active")
    } else {
      this.isPlaying = true
      this.settingsButton.classList.remove("active")
    }
  }

  setTime() {

  }

  play() {
    /// write the custom play logic here, setting the start, end, duration, and rate
    this.video.play()
  }
  pause() {
    this.video.pause()
  }

}

function slugify(text) {
  return text.toString().toLowerCase()
  .replace(/\s+/g, '-')           // Replace spaces with -
  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  .replace(/\-\-+/g, '-')         // Replace multiple - with single -
  .replace(/^-+/, '')             // Trim - from start of text
  .replace(/-+$/, '');            // Trim - from end of text
}

function makeID(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}