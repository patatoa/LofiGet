from datetime import datetime
import cv2
import os
import shutil
import tempfile
import yt_dlp
from vidgear.gears import CamGear

def vidget():
	ytUrl = os.environ['ytUrl']
	# Copy read-only secret to a writable temp file so yt-dlp can update it
	cookies_tmp = tempfile.mktemp(suffix='.txt')
	shutil.copy('/secrets/yt-cookies.txt', cookies_tmp)
	ydl_opts = {
		'cookiefile': cookies_tmp,
		'format': 'best[ext=mp4]/best',
		'quiet': True,
		'extractor_args': {'youtube': {'player_client': ['web']}},
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