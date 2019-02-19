import Tone from 'tone'

class Audios {
    constructor() {
        this.synth = new Tone.Synth().toMaster()
    }

    playBeep() {
        this.synth.triggerAttackRelease('E4', 0.5)
    }
}

export default new Audios()
