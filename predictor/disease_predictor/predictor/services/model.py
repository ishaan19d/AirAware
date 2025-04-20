import numpy as np
import pandas as pd
import pickle
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import seaborn as sns
from tqdm import tqdm
import torch
from torch import nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset

# Check for CUDA availability
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Define the pollutants and diseases
pollutants = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'NH3']
diseases = [
    'Asthma', 'COPD', 'Bronchitis', 'Emphysema', 'Pneumonia',
    'Lung cancer', 'Allergic rhinitis', 'Sinusitis', 'Respiratory tract infection',
    'Cough and throat irritation', 'Pulmonary fibrosis', 'Tuberculosis',
    'Obstructive sleep apnea'
]

# Define the relationship between diseases and pollutants
disease_pollutant_mapping = {
    'Asthma': ['PM2.5', 'O3', 'NO2'],
    'COPD': ['PM2.5', 'CO', 'O3', 'NO2'],
    'Bronchitis': ['PM2.5', 'PM10', 'NO2', 'SO2'],
    'Emphysema': ['PM2.5', 'PM10', 'O3', 'NO2'],
    'Pneumonia': ['PM2.5', 'NO2', 'SO2'],
    'Lung cancer': ['PM2.5', 'PM10'],
    'Allergic rhinitis': ['PM2.5', 'PM10', 'NO2', 'NH3'],
    'Sinusitis': ['PM2.5', 'PM10', 'NO2', 'NH3'],
    'Respiratory tract infection': ['PM2.5', 'PM10', 'NO2', 'SO2'],
    'Cough and throat irritation': ['O3', 'PM2.5', 'SO2'],
    'Pulmonary fibrosis': ['PM2.5', 'PM10', 'O3'],
    'Tuberculosis': ['PM2.5', 'NO2'],
    'Obstructive sleep apnea': ['PM2.5', 'NO2']
}

# Define pollutant ranges according to Indian standards
pollutant_categories = {
    'PM2.5': {'Good': (0, 30), 'Fair': (31, 60), 'Poor': (61, 120), 'Severe': (121, 350)},
    'PM10': {'Good': (0, 50), 'Fair': (51, 100), 'Poor': (101, 350), 'Severe': (351, 550)},
    'NO2': {'Good': (0, 40), 'Fair': (41, 80), 'Poor': (81, 280), 'Severe': (281, 400)},
    'SO2': {'Good': (0, 40), 'Fair': (41, 80), 'Poor': (81, 800), 'Severe': (801, 1200)},
    'CO': {'Good': (0, 1000), 'Fair': (1001, 2000), 'Poor': (2001, 10000), 'Severe': (10001, 15000)},
    'O3': {'Good': (0, 50), 'Fair': (51, 100), 'Poor': (101, 200), 'Severe': (201, 400)},
    'NH3': {'Good': (0, 200), 'Fair': (201, 400), 'Poor': (401, 1200), 'Severe': (1201, 1800)}
}

# Function to categorize pollutant levels
def get_pollutant_category(pollutant, value):
    categories = pollutant_categories[pollutant]
    for category, (min_val, max_val) in categories.items():
        if min_val <= value <= max_val:
            return category
    return 'Severe'  # Default to Severe if beyond ranges

# Function to generate a large dataset with realistic values
def generate_dataset(num_samples=1300000):
    print(f"Generating a dataset with {num_samples} samples...")
    
    # Generate pollutant data based on defined ranges
    data = {}
    
    # For each pollutant, generate data with a distribution that spans all categories
    for pollutant in pollutants:
        # Generate with a mixed distribution to ensure coverage across categories
        
        # 25% in Good range
        good_samples = np.random.uniform(
            pollutant_categories[pollutant]['Good'][0],
            pollutant_categories[pollutant]['Good'][1],
            int(num_samples * 0.35)
        )
        
        # 25% in Fair range
        fair_samples = np.random.uniform(
            pollutant_categories[pollutant]['Fair'][0],
            pollutant_categories[pollutant]['Fair'][1],
            int(num_samples * 0.25)
        )
        
        # 30% in Poor range - increased percentage for Poor category
        poor_samples = np.random.uniform(
            pollutant_categories[pollutant]['Poor'][0],
            pollutant_categories[pollutant]['Poor'][1],
            int(num_samples * 0.3)
        )
        
        # 20% in Severe range - increased percentage for Severe category
        severe_samples = np.random.uniform(
            pollutant_categories[pollutant]['Severe'][0],
            pollutant_categories[pollutant]['Severe'][1],
            num_samples - int(num_samples * 0.9)
        )
        
        # Combine and shuffle
        all_samples = np.concatenate([good_samples, fair_samples, poor_samples, severe_samples])
        np.random.shuffle(all_samples)
        
        # Take exactly num_samples
        data[pollutant] = all_samples[:num_samples]
    
    # Create the dataframe
    df = pd.DataFrame(data)
    
    # Add category columns for each pollutant
    for pollutant in pollutants:
        df[f'{pollutant}_category'] = df[pollutant].apply(lambda x: get_pollutant_category(pollutant, x))
    
    # Generate disease labels based on pollutant levels and categories with increased sensitivity
    for disease in diseases:
        related_pollutants = disease_pollutant_mapping[disease]
        
        # Start with zeros
        df[disease] = 0
        
        # Calculate a risk score based on relevant pollutants
        risk_score = np.zeros(num_samples)
        
        for pollutant in related_pollutants:
            # Convert categories to numerical scores with MORE SENSITIVE values
            # Increased sensitivity by raising scores for Fair, Poor, and Severe categories
            category_scores = {'Good': 0.0, 'Fair': 0.4, 'Poor': 0.75, 'Severe': 1.2}
            
            # Add category score to risk score
            for category, score in category_scores.items():
                mask = df[f'{pollutant}_category'] == category
                risk_score[mask] += score
            
            # Additional factor for values that are high within their categories
            # This adds more sensitivity for values approaching the next category
            # A simpler approach that avoids Series issues
            pollutant_value = df[pollutant].values
            
            # Calculate position within category
            for category in ['Good', 'Fair', 'Poor', 'Severe']:
                mask = df[f'{pollutant}_category'] == category
                min_val, max_val = pollutant_categories[pollutant][category]
                range_width = max_val - min_val
                
                if range_width > 0:  # Avoid division by zero
                    # Only apply to rows with this category
                    category_positions = np.zeros(num_samples)
                    category_positions[mask] = (pollutant_value[mask] - min_val) / range_width
                    # Add a small boost based on position (0.0 to 0.2)
                    risk_score += category_positions * 0.2
        
        # Normalize the risk score by the number of pollutants
        risk_score = risk_score / len(related_pollutants)
        
        # Add some randomness to make it more realistic (medical conditions have other factors)
        # Reduced randomness to make model more deterministic
        risk_score = risk_score + np.random.normal(0, 0.08, num_samples)
        
        # Set disease to 1 if risk score exceeds threshold
        # LOWERED threshold to make diseases more common with fair/poor levels
        threshold = 0.4  # Lower base threshold (was 0.5)
        
        # Different diseases have slightly different thresholds
        disease_specific_adjustment = np.random.uniform(-0.08, 0.08)
        threshold += disease_specific_adjustment
        
        df[disease] = (risk_score > threshold).astype(int)
    
    print(f"Dataset generated with {df.shape[1]-len(pollutants)*2} diseases and {len(pollutants)} pollutants.")
    
    # Print some statistics
    print("\nPollutant statistics:")
    print(df[pollutants].describe().round(2))
    
    print("\nPollutant category distribution:")
    for pollutant in pollutants:
        category_counts = df[f'{pollutant}_category'].value_counts(normalize=True) * 100
        print(f"\n{pollutant} categories:")
        for category, percentage in category_counts.items():
            print(f"  {category}: {percentage:.2f}%")
    
    print("\nDisease prevalence:")
    disease_prevalence = df[diseases].mean().sort_values(ascending=False)
    for disease, prevalence in disease_prevalence.items():
        print(f"{disease}: {prevalence*100:.2f}%")
    
    return df

# Define SVM model using PyTorch for CUDA support
class SVMModel(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(SVMModel, self).__init__()
        self.linear = nn.Linear(input_dim, output_dim)
        
    def forward(self, x):
        return self.linear(x)

# Custom loss function for SVM (Hinge Loss)
def hinge_loss(outputs, labels, C=1.0):
    batch_size = outputs.size(0)
    # Compute hinge loss: max(0, 1 - y*f(x))
    loss = torch.clamp(1 - outputs * labels, min=0)
    loss = torch.sum(loss) / batch_size
    
    # Add regularization term
    reg = 0.5 * torch.sum(torch.square(outputs)) / batch_size
    return loss + C * reg

# Train the ML model using PyTorch-based SVM with CUDA
def train_model(df, model_filename='air_pollution_disease_model_cuda_svm.pkl'):
    print("\nPreparing and training the CUDA-accelerated SVM model...")
    
    # For demonstration with large dataset, use a subsample
    sample_size = min(1000000, len(df))  # Can use more samples with GPU acceleration
    print(f"Using {sample_size} samples for SVM training")
    df_sample = df.sample(sample_size, random_state=42)
    
    # Split features and target variables
    X = df_sample[pollutants].values
    y = df_sample[diseases].values
    
    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Standardize features - very important for SVM
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Convert to PyTorch tensors
    X_train_tensor = torch.FloatTensor(X_train_scaled)
    y_train_tensor = torch.FloatTensor(y_train)
    X_test_tensor = torch.FloatTensor(X_test_scaled)
    y_test_tensor = torch.FloatTensor(y_test)
    
    # Move to GPU if available
    X_train_tensor = X_train_tensor.to(device)
    y_train_tensor = y_train_tensor.to(device)
    X_test_tensor = X_test_tensor.to(device)
    y_test_tensor = y_test_tensor.to(device)
    
    # Create DataLoader for batch training
    train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
    train_loader = DataLoader(train_dataset, batch_size=1024, shuffle=True)
    
    # Training parameters
    input_dim = len(pollutants)
    output_dim = len(diseases)
    learning_rate = 0.01
    num_epochs = 10
    
    # Initialize model for each disease (separate SVM for each)
    models = []
    optimizers = []
    
    for i in range(output_dim):
        model = SVMModel(input_dim, 1).to(device)
        optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)
        models.append(model)
        optimizers.append(optimizer)
    
    # Train with progress visualization
    print("Training the SVM models with CUDA acceleration (green line indicates progress):")
    
    with tqdm(total=num_epochs * len(models), colour='green', ncols=100) as pbar:
        for epoch in range(num_epochs):
            for i, (model, optimizer) in enumerate(zip(models, optimizers)):
                model.train()
                epoch_loss = 0.0
                
                for batch_X, batch_y in train_loader:
                    # Extract label for current disease
                    batch_y_disease = batch_y[:, i].view(-1, 1)
                    
                    # Convert 0/1 to -1/1 for SVM
                    batch_y_disease = 2 * batch_y_disease - 1
                    
                    # Forward pass
                    outputs = model(batch_X)
                    
                    # Compute loss
                    loss = hinge_loss(outputs, batch_y_disease)
                    epoch_loss += loss.item()
                    
                    # Backward and optimize
                    optimizer.zero_grad()
                    loss.backward()
                    optimizer.step()
                
                pbar.update(1)
                
    # Evaluate models
    y_pred = np.zeros((len(X_test), output_dim))
    y_pred_proba = np.zeros((len(X_test), output_dim))
    
    for i, model in enumerate(models):
        model.eval()
        with torch.no_grad():
            outputs = model(X_test_tensor)
            outputs = outputs.cpu().numpy()
            
            # Convert SVM raw scores to probabilities using sigmoid with a factor to make predictions more sensitive
            # Adjusted sigmoid function to be more sensitive in the middle ranges
            proba = 1 / (1 + np.exp(-1.2 * outputs))  # Increased factor from 1.0 to 1.2 for more sensitivity
            y_pred_proba[:, i] = proba.flatten()
            y_pred[:, i] = (proba > 0.45).astype(int).flatten()  # Lowered threshold from 0.5 to 0.45
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nCUDA SVM model overall accuracy: {accuracy:.4f}")
    
    # Per-disease accuracy
    print("\nPer-disease performance:")
    for i, disease in enumerate(diseases):
        disease_acc = accuracy_score(y_test[:, i], y_pred[:, i])
        print(f"{disease}: {disease_acc:.4f}")
    
    # Save the trained models, scaler, and related information
    model_data = {
        'models': models,
        'scaler': scaler,
        'diseases': diseases,
        'pollutants': pollutants,
        'pollutant_categories': pollutant_categories,
        'device': str(device)
    }
    
    with open(model_filename, 'wb') as file:
        torch.save(model_data, file)
    
    print(f"\nCUDA-accelerated SVM model saved to {model_filename}")
    
    # Visualize training results
    plt.figure(figsize=(12, 6))
    plt.bar(diseases, [accuracy_score(y_test[:, i], y_pred[:, i]) for i in range(len(diseases))])
    plt.title('Disease Prediction Accuracy')
    plt.xticks(rotation=90)
    plt.tight_layout()
    plt.savefig('disease_prediction_accuracy.png')
    print("Accuracy chart saved to 'disease_prediction_accuracy.png'")
    
    return models, scaler

# Function to predict diseases from pollutant data with increased sensitivity
def predict_diseases(pollutant_dict, model_filename='air_pollution_disease_model_cuda_svm.pkl'):
    # Load the model and related data
    model_data = torch.load(model_filename, weights_only=False)
    models = model_data['models']
    scaler = model_data['scaler']
    diseases_list = model_data['diseases']
    pollutants_list = model_data['pollutants']
    pollutant_categories = model_data['pollutant_categories']
    
    # Check if all required pollutants are in the input
    for pollutant in pollutants_list:
        if pollutant not in pollutant_dict:
            print(f"Warning: Missing pollutant {pollutant}. Setting to 0.")
            pollutant_dict[pollutant] = 0
    
    # Determine category for each pollutant
    print("\nInput air quality parameters:")
    pollutant_categories_list = []  # Store categories for sensitivity adjustment
    for pollutant in pollutants_list:
        value = pollutant_dict[pollutant]
        category = get_pollutant_category(pollutant, value)
        pollutant_categories_list.append(category)
        print(f"{pollutant}: {value:.1f} μg/m³ ({category})")
    
    # Convert input to array for prediction
    X = np.array([pollutant_dict[p] for p in pollutants_list]).reshape(1, -1)
    
    # Scale the input
    X_scaled = scaler.transform(X)
    
    # Convert to PyTorch tensor and move to device
    X_tensor = torch.FloatTensor(X_scaled).to(device)
    
    # Get predictions from each model
    y_pred_proba = np.zeros((1, len(diseases_list)))
    
    for i, model in enumerate(models):
        model.eval()
        with torch.no_grad():
            outputs = model(X_tensor)
            outputs = outputs.cpu().numpy()
            
            # Apply more sensitive sigmoid scaling (factor 1.2 instead of 1.0)
            proba = 1 / (1 + np.exp(-1.2 * outputs))
            y_pred_proba[0, i] = proba.flatten()[0]
    
    # Apply additional sensitivity based on pollutant categories
    # Check how many pollutants are in Poor or Severe categories
    poor_severe_count = pollutant_categories_list.count('Poor') + pollutant_categories_list.count('Severe')
    
    # Apply additional sensitivity boost based on poor/severe pollutant count
    sensitivity_boost = min(0.15, poor_severe_count * 0.03)  # Max boost of 15%
    
    # Boost disease probabilities if pollutants are in concerning ranges
    # but ensure we don't exceed 100%
    y_pred_proba = np.minimum(y_pred_proba + sensitivity_boost, 1.0)
    
    # Adjust probabilities based on proximity to next category threshold
    for i, disease in enumerate(diseases_list):
        # Get related pollutants for this disease
        related_pollutants = disease_pollutant_mapping[disease]
        
        # Calculate a factor based on how close each pollutant is to the next threshold
        threshold_factor = 0
        relevant_pollutant_count = 0
        
        for pollutant in related_pollutants:
            value = pollutant_dict[pollutant]
            category = get_pollutant_category(pollutant, value)
            
            # Only apply for Good and Fair categories
            if category in ['Good', 'Fair']:
                relevant_pollutant_count += 1
                
                # Get the range values
                min_val, max_val = pollutant_categories[pollutant][category]
                range_width = max_val - min_val
                
                # Position within range (0 to 1)
                position = (value - min_val) / range_width if range_width > 0 else 0.5
                
                # Higher position means closer to next threshold
                threshold_factor += position * 0.1  # Scale by 0.1 to keep the effect modest
        
        # Normalize and apply the threshold factor
        if relevant_pollutant_count > 0:
            avg_threshold_factor = threshold_factor / relevant_pollutant_count
            y_pred_proba[0, i] = min(y_pred_proba[0, i] + avg_threshold_factor, 1.0)
    
    # Prepare results
    results = []
    proba_disease_pairs = [(prob, disease) for prob, disease in zip(y_pred_proba[0], diseases_list)]
    proba_disease_pairs.sort(reverse=True)
    
    # Print top 5 diseases with probabilities
    print("\nTop 5 potential diseases based on provided air quality (CUDA SVM predictions):")
    for prob, disease in proba_disease_pairs[:5]:
        status = "HIGH RISK" if prob > 0.75 else "MODERATE RISK" if prob > 0.4 else "LOW RISK"
        print(f"{disease}: {prob*100:.2f}% ({status})")
        if prob > 0.4:  # Lower threshold from 0.5 to 0.4 to include more diseases in results
            results.append(disease)
    
    return results

# SVG visualization function to show the training progress (for compatibility with requirement)
def create_training_progress_svg(progress_percentage):
    svg_code = f"""
    <svg width="400" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="30" fill="#f0f0f0" rx="5" ry="5"/>
        <rect width="{progress_percentage * 4}" height="30" fill="#00cc00" rx="5" ry="5"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#000000">
            Training Progress: {progress_percentage}%
        </text>
    </svg>
    """
    return svg_code

# Main function to run the entire pipeline
def main():
    # Step 1: Generate a large dataset
    df = generate_dataset(num_samples=1500000)
    
    # Save the dataset to CSV (optional)
    df.to_csv('air_pollution_disease_dataset.csv', index=False)
    print("Dataset saved to 'air_pollution_disease_dataset.csv'")
    
    # Step 2: Train the CUDA SVM model and save it
    models, scaler = train_model(df)
    
    # Step 3: Example usage of the prediction function with Fair/near Poor levels
    example_input = {
        'PM2.5': 58.0,    # High Fair (near Poor threshold)
        'PM10': 98.0,     # High Fair (near Poor threshold)
        'NO2': 78.0,      # High Fair (near Poor threshold)
        'SO2': 40.3,      # Fair
        'CO': 1950.0,     # High Fair (near Poor threshold)
        'O3': 85.5,       # Fair
        'NH3': 300.0      # Fair
    }
    
    print("\nExample prediction with more sensitive CUDA SVM model:")
    predicted_diseases = predict_diseases(example_input)
    
    print(f"\nPredicted diseases: {predicted_diseases}")
    
    # Step 4: Example with Poor/Severe levels
    example_severe_input = {
        'PM2.5': 120.5,  # Poor (near Severe threshold)
        'PM10': 180.0,   # Poor
        'NO2': 90.2,     # Poor
        'SO2': 40.3,     # Fair
        'CO': 2500.0,    # Poor
        'O3': 85.5,      # Fair
        'NH3': 300.0     # Fair
    }
    
    print("\nExample prediction with Poor/Severe levels:")
    predicted_severe_diseases = predict_diseases(example_severe_input)
    
    print(f"\nPredicted diseases: {predicted_severe_diseases}")
    
    print("\nReady to use! You can call predict_diseases() with your own pollutant values.")

if __name__ == "__main__":
    main()