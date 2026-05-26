import os, subprocess, time
ct = subprocess.check_output(['git','show','-s','--format=%ci','6715fc0']).decode().strip()
print('commit 6715fc0 time:', ct)
files=['tools/tts/test_outputs/test_011.wav','tools/tts/test_outputs/test_013.wav','tools/tts/test_outputs/test_014.wav','tools/tts/test_outputs/test_015.wav','tools/tts/test_outputs/test_016.wav']
for f in files:
    if os.path.exists(f):
        m=os.path.getmtime(f)
        print(f, 'mtime:', time.ctime(m))
    else:
        print(f, 'missing')
logs=['tools/tts/server_stdout_long.log','tools/tts/bench_results/2026-05-26/server_stdout_long.log']
for l in logs:
    if os.path.exists(l):
        print(l, 'mtime', time.ctime(os.path.getmtime(l)))
    else:
        print(l, 'missing')
