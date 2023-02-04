import cv2
import os
from vidgear.gears import CamGear
stream = CamGear(source='https://www.youtube.com/watch?v=jfKfPfyJRdk', stream_mode =True,  time_delay=1, logging=True).start()

path = "."

currentframe = 0

frame = stream.read() 
if frame is None:
	print("No frame")

cv2.imshow("Output Frame", frame) 

name = path + '/frames' + str(currentframe) + '.jpg'
print ('Creating...' + name) 

cv2.imwrite(name, frame)

cv2.destroyAllWindows()
stream.stop()