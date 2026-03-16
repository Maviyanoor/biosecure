import cv2
import numpy as np

def generate_gradcam(image, heatmap):

    heatmap = cv2.resize(heatmap, (image.shape[1], image.shape[0]))
    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    output = heatmap * 0.4 + image

    return output