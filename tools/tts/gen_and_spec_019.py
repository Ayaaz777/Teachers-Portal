import requests, io, wave, os, time
import librosa
import matplotlib.pyplot as plt
import numpy as np

OUT='tools/tts/test_outputs'
os.makedirs(OUT, exist_ok=True)
URL='http://127.0.0.1:8123/v1/audio/speech'
phrase='Welcome to Recruit My English. Your interview with Talking Global is confirmed for tomorrow at three p.m. South African time. Please make sure your camera and microphone are working before the call.'
print('Posting phrase 3...')
try:
    t0=time.perf_counter()
    r=requests.post(URL, json={'input': phrase}, timeout=600)
    t1=time.perf_counter()
    synth=t1-t0
    print('HTTP', r.status_code)
    if r.status_code!=200:
        print('Error', r.text)
        raise SystemExit(1)
    out_path=os.path.join(OUT,'test_019.wav')
    open(out_path,'wb').write(r.content)
    print('Saved', out_path, 'synth', synth)
except Exception as e:
    print('Request failed', e)
    raise

# Load audio with librosa
y, sr = librosa.load(out_path, sr=None)
# Produce STFT
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
S_db = librosa.amplitude_to_db(S, ref=np.max)
# Save spectrogram
png = os.path.join(OUT,'test_019_spectrogram.png')
plt.figure(figsize=(10,4))
librosa.display.specshow(S_db, sr=sr, hop_length=512, x_axis='time', y_axis='hz', cmap='magma')
plt.colorbar(format='%+2.0f dB')
plt.title('test_019.wav spectrogram')
plt.tight_layout()
plt.savefig(png, dpi=150)
plt.close()
print('Wrote', png)
