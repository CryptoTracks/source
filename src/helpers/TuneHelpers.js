import * as Tone from 'tone'
import possibleBars from './possibleBars.json'

const synths = {
  'Drum 1': Tone.MembraneSynth,
  'Drum 2': Tone.MembraneSynth,
  'Base 1': Tone.Synth,
  'Base 2': Tone.Synth,
  'String 1': Tone.PluckSynth,
  'String 2': Tone.PluckSynth,
  'Synth 1': Tone.Synth,
  'Synth 2': Tone.Synth
}

const synthOptions = {
  'Drum 1': {
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4,
      attackCurve: 'exponential'
    }
  },
  'Drum 2': {
    pitchDecay: 0.008,
    octaves: 2,
    envelope: {
      attack: 0.0006,
      decay: 0.5,
      sustain: 0,
      release: 1
    }
  },
  'Base 1': {
    oscillator: {
      type: 'triangle3'
    },
    volume: 0,
    envelope: {
      attack: 0.3,
      decay: 0.2,
      sustain: 0.5,
      release: 0.5
    }
  },
  'Base 2': {
    oscillator: {
      type: 'triangle'
    },
    volume: 0,
    envelope: {
      attack: 0.3,
      decay: 0.2,
      sustain: 0.5,
      release: 0.5
    }
  },
  'String 1': {
    attackNoise: 1,
    dampening: 4000,
    resonance: 0.95
  },
  'String 2': {
    attackNoise: 2,
    dampening: 6000,
    resonance: 0.9
  },
  'Synth 1': {
    oscillator: {
      type: 'pulse',
      width: 0.8
    },
    envelope: {
      attack: 0.01,
      decay: 0.05,
      sustain: 0.2,
      release: 0.4
    }
  },
  'Synth 2': {
    oscillator: {
      type: 'sine',
      modulationType: 'sawtooth'
    },
    envelope: {
      attack: 0.1,
      decay: 0.02,
      sustain: 1,
      release: 0.5
    }
  }
}

const synthOctaves = {
  'Drum 1': 1,
  'Drum 2': 4,
  'Base 1': 1,
  'Base 2': 2,
  'String 1': 2,
  'String 2': 4,
  'Synth 1': 4,
  'Synth 2': 4
}

const synthDurations = {
  'Drum 1': '16n',
  'Drum 2': '16n',
  'Base 1': '8n',
  'Base 2': '8n',
  'String 1': '16n',
  'String 2': '16n',
  'Synth 1': '8n',
  'Synth 2': '8n'
}

const notes = [
  'C', 'C#', 'D', 'D#',
  'E', 'F', 'F#', 'G',
  'G#', 'A', 'A#', 'B'
]

const durations = [
  '1n', '2n', '4n', '8n', '16n'
]

const chunkString = (str, length) => {
  return str.match(new RegExp('.{1,' + length + '}', 'g'))
}

const twoDigit = (num, mod = 99, mult = 100) => {
  let result = parseInt(Math.abs(num * mult) % mod)
  if (result < 10) {
    result = `0${result}`
  } else {
    result = result.toString()
  }
  return result
}

export default {
  randomTune: () => {
    const tracks = []
    for (let i = 0; i < 8; i++) {
      tracks[i] = {
        synth: Object.keys(synths)[i],
        bars: []
      }
      for (let j = 0; j < 16; j++) {
        tracks[i].bars[j] = {
          note: notes[parseInt(Math.random() * notes.length)],
          octave: Math.floor(Math.random() * 8) + 1,
          play: (Math.random() <= 0.25),
          duration: durations[parseInt(Math.random() * durations.length)]
        }
      }
    }

    return tracks
  },
  blankTune: () => {
    const tracks = []
    for (let i = 0; i < 8; i++) {
      tracks[i] = {
        synth: Object.keys(synths)[i],
        volume: 0,
        attack: 0.1,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1,
        attackNoise: 5,
        dampening: 4000,
        resonance: 0.9,
        bars: []
      }
      for (let j = 0; j < 16; j++) {
        tracks[i].bars[j] = {
          note: 'C',
          octave: synthOctaves[tracks[i].synth],
          play: false,
          duration: synthDurations[tracks[i].synth]
        }
      }
    }

    return tracks
  },
  sequence: (vm) => {
    return new Tone.Sequence((time, col) => {
      Tone.Draw.schedule(() => {
        vm.currentBar = col
      }, time)
      for (let i = 0; i < 8; i++) {
        const currentBar = vm.tracks[i].bars[col]
        if (currentBar.play) {
          vm.synths[i].triggerAttackRelease(`${currentBar.note}${currentBar.octave}`, currentBar.duration, time)
        }
      }
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n')
  },
  initSynth: (name, overrides = {}) => {
    const options = synthOptions[name]
    for (let key of Object.keys(overrides)) {
      options[key] = overrides[key]
    }
    return new synths[name](options).toMaster()
  },
  encoder: (tracks) => {
    const encoded = []
    try {
      for (let track of tracks) {
        let result = ''
        for (let bar of track.bars) {
          if (bar.play) {
            let thisBar = possibleBars.find(pb => pb[0] === bar.note && pb[1] === parseInt(bar.octave) && pb[2] === bar.duration)
            thisBar = possibleBars.indexOf(thisBar).toString()
            while (thisBar.length < 3) {
              thisBar = '0' + thisBar
            }
            result = `${result}${thisBar}`
          } else {
            result = `${result}000`
          }
        }
        const volume = twoDigit(track.volume + 15, 31, 1)
        if (encoded.length === 4 || encoded.length === 5) {
          const attackNoise = twoDigit(track.attackNoise, 11, 1)
          const resonance = twoDigit(track.resonance)
          let dampening = twoDigit(track.dampening, 10001, 1)
          while (dampening.length < 5) {
            dampening = `0${dampening}`
          }
          result = `${volume}${attackNoise}${resonance}${dampening}${result}`
        } else {
          const attack = twoDigit(track.attack)
          const decay = twoDigit(track.decay)
          const sustain = twoDigit(track.sustain)
          const release = twoDigit(track.release)
          console.info(volume)
          result = `${volume}${attack}${decay}${sustain}${release}${result}`
        }
        encoded.push(result)
      }
    } catch (err) {
      console.error(err)
    }
    return encoded
  },
  decoder: (tracks) => {
    const decoded = []
    for (let i = 0; i < 8; i++) {
      let track = tracks[i].toString(10)
      while (track.length < 77) {
        track = `0${track}`
      }
      let settings
      if (i === 4 || i === 5) {
        settings = chunkString(track.toString().substring(track.length - 59, track.length - 48), 2)
      } else {
        settings = chunkString(track.toString().substring(track.length - 58, track.length - 48), 2)
      }
      console.info(track)
      console.info(settings)
      decoded[i] = {
        synth: Object.keys(synths)[i],
        volume: parseInt(settings[0]) % 31 - 15,
        attack: parseInt(settings[1]) / 100,
        decay: parseInt(settings[2]) / 100,
        sustain: parseInt(settings[3]) / 100,
        release: parseInt(settings[4]) / 100,
        attackNoise: parseInt(settings[1]) % 11,
        dampening: parseInt(settings[3] + settings[4] + (settings[5] ? settings[5] : '')) % 10001,
        resonance: parseInt(settings[2]) / 100,
        bars: []
      }
      const bars = chunkString(track.toString().substring(track.length - 48), 3)
      // console.info('bars -> ', bars)
      for (let j = 0; j < 16; j++) {
        const barIndex = parseInt(bars[j])
        // console.info(`bar ${barIndex} - bar ${j + 1}`)
        const bar = possibleBars[barIndex]
        // console.info('bar ->', bar)
        if (bar && bar[0] != null) {
          decoded[i].bars[j] = {
            note: bar[0],
            octave: bar[1],
            play: true,
            duration: bar[2]
          }
        } else {
          decoded[i].bars[j] = {
            note: 'C',
            octave: synthOctaves[decoded[i].synth],
            play: false,
            duration: synthDurations[decoded[i].synth]
          }
        }
      }
    }

    return decoded
  },
  notes,
  synths,
  synthOptions,
  durations
}
