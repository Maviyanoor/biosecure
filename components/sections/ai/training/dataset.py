import os
import cv2
import torch
from torch.utils.data import Dataset

class DeepfakeDataset(Dataset):

    def __init__(self, folder):

        self.images = []
        self.labels = []

        for label in ["real", "fake"]:

            path = os.path.join(folder, label)

            for file in os.listdir(path):

                self.images.append(os.path.join(path, file))
                self.labels.append(0 if label == "real" else 1)

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):

        img = cv2.imread(self.images[idx])
        img = cv2.resize(img, (224,224))

        img = torch.tensor(img).permute(2,0,1).float()/255

        label = torch.tensor(self.labels[idx])

        return img, label