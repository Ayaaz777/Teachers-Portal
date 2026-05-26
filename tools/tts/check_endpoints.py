import requests
print('GET /health')
try:
    r=requests.get('http://127.0.0.1:8123/health',timeout=5)
    print(r.status_code)
    print(r.text)
except Exception as e:
    print('health error',e)

print('\nGET /metrics')
try:
    r=requests.get('http://127.0.0.1:8123/metrics',timeout=5)
    print(r.status_code)
    print(r.text[:400])
except Exception as e:
    print('metrics error',e)
