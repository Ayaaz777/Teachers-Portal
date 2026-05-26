import re
p='tools/tts/chatterbox-server.py'
with open(p,encoding='utf-8') as f:
    lines=f.readlines()
patterns_fp16=['fp16','float16','torch.float16','.half(']
patterns_fp32=['fp32','float32','torch.float32','.float(']

print('--- FP16/HALF matches ---')
for i,l in enumerate(lines,1):
    for pat in patterns_fp16:
        if pat in l:
            print(f'{i}: {l.rstrip()}')
            break
print('\n--- FP32/FLOAT matches ---')
for i,l in enumerate(lines,1):
    for pat in patterns_fp32:
        if pat in l:
            print(f'{i}: {l.rstrip()}')
            break
