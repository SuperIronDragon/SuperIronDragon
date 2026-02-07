// music.js
let A, started

export function startMusic(){
  if(started) return
  started = 1
  A = new AudioContext()
  music()
}

// soft pad chord
function chord(fs, when, len=6, v=.02){
  fs.forEach(f=>{
    let o=A.createOscillator(),
        g=A.createGain()
    o.type="triangle"
    o.frequency.value=f*(1+(Math.random()-.5)*.001)
    g.gain.setValueAtTime(0,when)
    g.gain.linearRampToValueAtTime(v,when+1)
    g.gain.linearRampToValueAtTime(v*.6,when+len-1)
    g.gain.linearRampToValueAtTime(0,when+len)
    o.connect(g)
    g.connect(A.destination)
    o.start(when)
    o.stop(when+len)
  })
}

// piano-like note
function note(f, when, len=1.5, v=.015){
  let o=A.createOscillator(),
      g=A.createGain()
  o.type="sine"
  o.frequency.value=f*(1+(Math.random()-.5)*.002)
  g.gain.setValueAtTime(0,when)
  g.gain.linearRampToValueAtTime(v,when+.05)
  g.gain.exponentialRampToValueAtTime(.0001,when+len)
  o.connect(g)
  g.connect(A.destination)
  o.start(when)
  o.stop(when+len)
}

// semitone steps → freqs
let steps=(r,a)=>a.map(s=>r*Math.pow(2,s/12))

function music(){
  let t=A.currentTime,
      bpm=180,
      beat=60/bpm,
      root=230,
      prog=[
        [0,4,7,12],
        [0,5,7,12],
        [0,4,9,12],
        [0,2,7,12]
      ]

  let time=t

  for(let p=0;p<prog.length;p++){
    let base=steps(root,prog[p])
    chord(base,time,8*beat)

    for(let i=0;i<4;i++){
      note(
        base[(i+p)%base.length]*2,
        time+(i*2+1)*beat,
        2*beat
      )
    }
    time+=8*beat
  }

  setTimeout(music,(time-t)*1000)
}
