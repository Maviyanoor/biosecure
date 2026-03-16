import numpy as np

def weighted_fusion(pred1, pred2, pred3, weights=[0.4, 0.3, 0.3]):
    
    final_score = (
        pred1 * weights[0] +
        pred2 * weights[1] +
        pred3 * weights[2]
    )

    label = np.argmax(final_score)

    return label, final_score