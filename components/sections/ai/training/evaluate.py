import torch

def evaluate(model, dataloader):

    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in dataloader:

            outputs = model(images)

            _, predicted = torch.max(outputs, 1)

            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    accuracy = 100 * correct / total

    return accuracy