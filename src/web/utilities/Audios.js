import Tone from 'tone'

class Audios {
    constructor() {
        this.synth = new Tone.Synth().toMaster()
    }

    playBeep() {
        this.synth.triggerAttack('C4', '0.02')
        this.synth.triggerAttackRelease('C4', 0.1, 0)
        this.synth.triggerAttackRelease('C5', 0.1, 0.2)
        this.synth.triggerAttackRelease('E4', 0.1, 0.2)
        this.synth.triggerAttackRelease('F4', 0.1, 0.3)
    }
}

export default new Audios()
