import torch
import torch.nn as nn
from torchvision.models import vit_b_16

class ViTModel(nn.Module):
    def __init__(self, num_classes=2):
        super(ViTModel, self).__init__()

        self.model = vit_b_16(weights="DEFAULT")
        in_features = self.model.heads.head.in_features
        self.model.heads.head = nn.Linear(in_features, num_classes)

    def forward(self, x):
        return self.model(x)