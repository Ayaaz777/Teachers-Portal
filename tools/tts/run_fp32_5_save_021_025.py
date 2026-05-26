import os, time, io, wave, requests, threading, subprocess
import soundfile as sf
import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display

OUT='tools/tts/test_outputs'
os.makedirs(OUT, exist_ok=True)
BASE='http://127.0.0.1:8123/v1/audio/speech'

phrases = [
    ("Hello.",'test_021.wav'),
    ("This payslip shows your gross pay, deductions, and net pay for the month. If you have questions, contact payroll.",'test_022.wav'),
    ("Welcome to Recruit My English. Your interview with Talking Global is confirmed for tomorrow at three p.m. South African time. Please make sure your camera and microphone are working before the call.",'test_023.wav'),
    ("Okay, this is the longest one. I want to check whether real-time-factor stays under one for a paragraph-length response. Imagine this is the AI replying to a teacher who has just asked how their next payment will be calculated, including the U S D to Z A R rate, the platform fee, and the timing of the bank transfer. The audio should sound natural throughout, and the synthesis should still finish in less time than the audio itself plays.",'test_024.wav'),
    ("Long paragraph: I want to check whether real-time-factor stays under one for a paragraph-length response. Imagine this is the AI replying to a teacher who has just asked how their next payment will be calculated, including the U S D to Z A R rate, the platform fee, and the timing of the bank transfer. The audio should sound natural throughout, and the synthesis should still finish in less time than the audio itself plays.",'test_025.wav')
]

results=[]

# helper to capture nvidia-smi once after a short delay
def capture_nvidia_snapshot(delay, out_path):
    time.sleep(delay)
    try:
        p = subprocess.run(['nvidia-smi','--query-gpu=memory.used,memory.total,utilization.gpu','--format=csv,noheader,nounits'], capture_output=True, text=True, timeout=10)
        with open(out_path,'w') as f:
            f.write(p.stdout)
    except Exception as e:
        with open(out_path,'w') as f:
            f.write('ERROR:'+str(e))

snap_path='tools/tts/bench_results/nvidia_snapshot_test021_phrase5.txt'
if not os.path.exists(os.path.dirname(snap_path)):
    os.makedirs(os.path.dirname(snap_path), exist_ok=True)

for idx,(text,fn) in enumerate(phrases, start=1):
    out_path=os.path.join(OUT,fn)
    payload={'input': text}
    print('Posting phrase', idx)
    if idx==5:
        t_snap = threading.Thread(target=capture_nvidia_snapshot, args=(1.0, snap_path))
        t_snap.start()
    t0=time.perf_counter()
    r=requests.post(BASE, json=payload, timeout=900)
    t1=time.perf_counter()
    synth=t1-t0
    if r.status_code!=200:
        print('Error', r.status_code, r.text)
        continue
    with open(out_path,'wb') as f:
        f.write(r.content)
    # duration
    try:
        with wave.open(io.BytesIO(r.content),'rb') as w:
            dur = w.getnframes()/float(w.getframerate())
    except Exception:
        dur=None
    rtf = synth/dur if dur and dur>0 else None
    results.append((idx, len(text), dur, synth, rtf, out_path))
    print(f'Phrase {idx}: saved {out_path} dur={dur:.3f} synth={synth:.3f} rtf={rtf:.3f}')
    # create spectrogram via librosa
    try:
        y, sr = librosa.load(out_path, sr=None)
        S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
        S_db = librosa.amplitude_to_db(S, ref=np.max)
        png = out_path.replace('.wav','_spectrogram.png')
        plt.figure(figsize=(10,4))
        librosa.display.specshow(S_db, sr=sr, hop_length=512, x_axis='time', y_axis='hz', cmap='magma')
        plt.colorbar(format='%+2.0f dB')
        plt.title(os.path.basename(out_path))
        plt.tight_layout()
        plt.savefig(png, dpi=150)
        plt.close()
        print('Wrote', png)
    except Exception as e:
        print('Spectrogram failed', e)
    if idx==5:
        t_snap.join()

# write simple CSV
csvp='tools/tts/bench_results/2026-05-26/retest_021_025_fp32.csv'
os.makedirs(os.path.dirname(csvp), exist_ok=True)
with open(csvp,'w') as f:
    f.write('phrase_num,chars,audio_duration_s,synth_time_s,rtf,spectrogram\n')
    for r in results:
        f.write(f"{r[0]},{r[1]},{r[2]:.3f},{r[3]:.3f},{r[4]:.3f},{r[5].replace('.wav','_spectrogram.png')}\n")
print('Wrote', csvp)
