import urllib.request
import cv2
import numpy as np

def download_image(url):
    response = urllib.request.urlopen(url)
    img_array = np.asarray(bytearray(response.read()), dtype=np.uint8)
    return cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)

def mean_brightness(img):
    return np.mean(img)

def is_night_scene(img):
    brightness = mean_brightness(img)
    threshold = 60
    return brightness < threshold

def main():
    url = "https://www.ft.com/__origami/service/image/v2/images/raw/https://d1e00ek4ebabms.cloudfront.net/production/5e0b4328-ff30-4ed3-a2e2-7feaebda9fa0.png?source=next&fit=scale-down&quality=highest&width=720&dpr=2"
    # url = "https://storage.googleapis.com/lofigirlframes/frame06-Feb-2023%20(02%3A00%3A09.387373).jpg"
    img = download_image(url)
    if is_night_scene(img):
        print("The image is a night scene.")
    else:
        print("The image is a day scene.")

if __name__ == "__main__":
    main()