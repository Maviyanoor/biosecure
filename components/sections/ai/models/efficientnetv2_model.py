import torch
import torch.nn as nn
from torchvision import models

class EfficientNetV2Model(nn.Module):
    def __init__(self, num_classes=2):
        super(EfficientNetV2Model, self).__init__()

        self.model = models.efficientnet_v2_s(weights="DEFAULT")

        in_features = self.model.classifier[1].in_features
        self.model.classifier[1] = nn.Linear(in_features, num_classes)

    def forward(self, x):
        return self.model(x)