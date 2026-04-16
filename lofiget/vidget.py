from datetime import datetime
import cv2
import os
import yt_dlp
from vidgear.gears import CamGear

def vidget():
	ytUrl = os.environ['ytUrl']
	ydl_opts = {
		'cookiefile': '/secrets/yt-cookies.txt',
		'format': 'best[ext=mp4]/best',
		'quiet': True,
	}
	with yt_dlp.YoutubeDL(ydl_opts) as ydl:
		info = ydl.extract_info(ytUrl, download=False)
		stream_url = info.get('url') or info['formats'][-1]['url']
	stream = CamGear(source=stream_url, logging=True).start()

	path = "."

	timestamp = datetime.now().strftime("%d-%b-%Y (%H:%M:%S.%f)")

	frame = stream.read() 
	if frame is None:
		raise ValueError("No frame read from stream")

	name = path + '/frame' + timestamp + '.jpg'

	cv2.imwrite(name, frame)

	stream.stop()
	return name, frame