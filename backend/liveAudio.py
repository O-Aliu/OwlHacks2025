import sounddevice as sd
from scipy.io.wavfile import write
import wavio as wv
import os

freq= 16000
dur = 7
maxNum =-1
record = sd.rec(int(dur*freq),samplerate=freq, channels=1)
print("recording audio")
sd.wait()
print("recording finished")

print("audio saving")
files = os.listdir("audio/")
for file in files:
    num = int(file.replace("audio","").replace(".wav", ""))
    if (num>maxNum):
        maxNum=num
     
nextNum= maxNum+1
newFileName= f"audio/audio{nextNum}.wav"
try:
    write(newFileName,freq,record)
except Exception as e:
    print("Err", e)
print("audio saved")
