from datetime import datetime
import cv2
import os
from vidgear.gears import CamGear

def vidget() -> str:
	stream = CamGear(source='https://www.youtube.com/watch?v=jfKfPfyJRdk', stream_mode =True,  time_delay=1, logging=True).start()

	path = "."

	currentframe = 0
	# Get the current datetimestamp as string
	timestamp = datetime.now().strftime("%d-%b-%Y (%H:%M:%S.%f)")

	frame = stream.read() 
	if frame is None:
		raise ValueError("No frame read from stream")

	name = path + '/frame' + timestamp + '.jpg'
	print ('Creating...' + name) 

	cv2.imwrite(name, frame)

	stream.stop()
	return name