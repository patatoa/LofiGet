from datetime import datetime
import cv2
import os
from vidgear.gears import CamGear

def vidget() -> str:
	ytUrl = os.environ['ytUrl']
	stream = CamGear(source=ytUrl, stream_mode =True,  time_delay=1, logging=True).start()

	path = "."

	timestamp = datetime.now().strftime("%d-%b-%Y (%H:%M:%S.%f)")

	frame = stream.read() 
	if frame is None:
		raise ValueError("No frame read from stream")

	name = path + '/frame' + timestamp + '.jpg'

	cv2.imwrite(name, frame)

	stream.stop()
	return name