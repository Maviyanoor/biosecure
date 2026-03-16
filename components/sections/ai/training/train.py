import torch
from torch.utils.data import DataLoader
from dataset import DeepfakeDataset
from models.efficientnetv2_model import EfficientNetV2Model

dataset = DeepfakeDataset("data")

loader = DataLoader(dataset, batch_size=8, shuffle=True)

model = EfficientNetV2Model()

criterion = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

for epoch in range(10):

    for images, labels in loader:

        outputs = model(images)

        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    print("Epoch:", epoch, "Loss:", loss.item())