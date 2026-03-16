import shap
import numpy as np

def explain_prediction(model, sample):

    explainer = shap.Explainer(model)
    shap_values = explainer(sample)

    return shap_values