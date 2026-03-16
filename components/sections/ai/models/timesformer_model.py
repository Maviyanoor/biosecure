import torch
import torch.nn as nn

class TimeSformerModel(nn.Module):
    def __init__(self, num_classes=2):
        super(TimeSformerModel, self).__init__()

        self.fc = nn.Sequential(
            nn.Linear(768, 256),
            nn.ReLU(),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.fc(x)