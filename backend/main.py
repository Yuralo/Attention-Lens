from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn.functional as F
from model import load_model
import numpy as np

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
model, enc = load_model()

class TextRequest(BaseModel):
    text: str
    top_k: int = 10

@app.get("/")
def read_root():
    return {"message": "Mechanistic Interpretability Backend"}

@app.post("/predict")
def predict_next_token(request: TextRequest):
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Encode input
    ids = enc.encode(text)
    # Convert to tensor and add batch dimension
    input_tensor = torch.tensor(ids).unsqueeze(0)
    
    # Forward pass
    with torch.no_grad():
        logits = model(input_tensor)
    
    # Get logits for the last token
    last_token_logits = logits[0, -1, :]
    
    # Calculate probabilities
    probs = F.softmax(last_token_logits, dim=-1)
    
    # Get top-k
    top_k_probs, top_k_indices = torch.topk(probs, request.top_k)
    
    predictions = []
    for i in range(request.top_k):
        token_id = top_k_indices[i].item()
        token_str = enc.decode([token_id])
        prob = top_k_probs[i].item()
        predictions.append({"token": token_str, "prob": prob, "id": token_id})
        
    return {"predictions": predictions}

@app.post("/attention")
def get_attention(request: TextRequest):
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    ids = enc.encode(text)
    input_tensor = torch.tensor(ids).unsqueeze(0)
    
    with torch.no_grad():
        # return_all=True returns: logits, scores, pattern, v, z, hidden_state
        _, _, pattern, _, _, _ = model(input_tensor, return_all=True)
    
    # pattern shape: [B, n_heads, T, T]
    # We want to return it as a list/array
    # Remove batch dim
    attention_matrix = pattern[0].cpu().numpy().tolist()
    
    tokens = [enc.decode([i]) for i in ids]
    
    return {
        "attention": attention_matrix,
        "tokens": tokens
    }

@app.get("/embeddings")
def get_embeddings():
    # Return PCA of embeddings
    # We'll compute PCA on the fly or return raw embeddings if frontend does PCA?
    # The request said "PCA for the embeddings". 
    # Let's do PCA here to save bandwidth, or return a subset.
    # The vocab size is 50k, sending all embeddings is too much.
    # Let's send a subset of interesting words or just top K frequent ones if we had frequencies.
    # For now, let's pick a random subset or a fixed list of common words.
    
    # Actually, let's just return the weights for a small subset of words for visualization
    # or perform PCA on the server.
    
    from sklearn.decomposition import PCA
    
    # Get all embeddings
    W_E = model.W_E.weight.detach().cpu().numpy()
    
    # Pick a subset to visualize to keep it fast
    # Let's take first 1000 tokens or a specific list
    indices = list(range(0, 1000))
    subset = W_E[indices]
    
    pca = PCA(n_components=2)
    coords = pca.fit_transform(subset)
    
    data = []
    for i, idx in enumerate(indices):
        token = enc.decode([idx])
        data.append({
            "token": token,
            "x": float(coords[i, 0]),
            "y": float(coords[i, 1]),
            "id": idx
        })
        
    return {"embeddings": data}

@app.post("/activations")
def get_activations(request: TextRequest):
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    ids = enc.encode(text)
    input_tensor = torch.tensor(ids).unsqueeze(0)
    
    with torch.no_grad():
        # return_all=True returns: logits, scores, pattern, v, z, hidden_state
        _, _, _, _, z, hidden_state = model(input_tensor, return_all=True)
    
    # z shape: [B, T, n_heads * d_head] -> reshape to [B, T, n_heads, d_head]
    # hidden_state shape: [B, T, d_model]
    
    # We'll return the activations for the last token or all tokens?
    # Let's return all for visualization
    
    # Reshape z to separate heads
    B, T, _ = z.shape
    z_reshaped = z.view(B, T, model.n_heads, model.d_head)
    
    return {
        "activations": hidden_state[0].cpu().numpy().tolist(),
        "attention_output": z_reshaped[0].cpu().numpy().tolist(),
        "tokens": [enc.decode([i]) for i in ids]
    }

@app.get("/weights")
def get_weight_analysis():
    # Compute eigenvalues of attention heads (W_OV = W_V @ W_O) or just W_Q, W_K?
    # The user mentioned "eigenvalue of heads". Usually this refers to the OV circuit or QK circuit.
    # OV circuit: W_V @ W_O
    # QK circuit: W_Q @ W_K.T
    
    # Let's compute SVD/Eigenvalues of W_OV for each head
    
    analysis = []
    
    W_Q = model.W_Q.weight # [n_heads * d_head, d_model]
    W_K = model.W_K.weight
    W_V = model.W_V.weight
    W_O = model.W_O.weight # [d_model, n_heads * d_head]
    
    # Reshape to [n_heads, d_head, d_model]
    W_Q_heads = W_Q.view(model.n_heads, model.d_head, model.d_model)
    W_K_heads = W_K.view(model.n_heads, model.d_head, model.d_model)
    W_V_heads = W_V.view(model.n_heads, model.d_head, model.d_model)
    
    # W_O is [d_model, n_heads * d_head]. We need to split the input dim.
    # W_O_heads = W_O.view(d_model, n_heads, d_head).transpose(0, 1) # [n_heads, d_model, d_head]
    # Actually W_O weights are usually stored as [d_model, n_heads * d_head] in PyTorch Linear layer (out, in)
    # But here W_O maps from [n_heads * d_head] to [d_model].
    # So weight shape is [d_model, n_heads * d_head].
    
    W_O_heads = W_O.view(model.d_model, model.n_heads, model.d_head).permute(1, 0, 2) # [n_heads, d_model, d_head]
    
    for h in range(model.n_heads):
        # OV Matrix: W_V[h] @ W_O[h] (approx, depends on definition)
        # W_V[h]: [d_head, d_model]
        # W_O[h]: [d_model, d_head] -> Wait, W_O takes d_head and maps to d_model.
        # So effective OV matrix for head h is W_V[h] (d_model -> d_head) then W_O[h] (d_head -> d_model)
        # Matrix = W_O[h] @ W_V[h] : [d_model, d_model]
        
        w_v = W_V_heads[h] # [d_head, d_model]
        w_o = W_O_heads[h] # [d_model, d_head]
        
        # OV = w_o @ w_v # [d_model, d_model]
        OV = torch.matmul(w_o, w_v)
        
        # Compute eigenvalues (use SVD for stability/singular values)
        # Eigenvalues might be complex. Singular values are real.
        # "Eigenvalue of heads" usually implies checking if they copy or negate.
        
        # Let's return singular values
        U, S, V = torch.svd(OV)
        
        analysis.append({
            "head": h,
            "singular_values": S.detach().cpu().numpy().tolist()[:10] # Top 10
        })
        
    return {"analysis": analysis}

class AnalogyRequest(BaseModel):
    positive: list[str]
    negative: list[str]
    top_k: int = 5

@app.post("/analogy")
def get_analogy(request: AnalogyRequest):
    # Vector arithmetic: pos1 + pos2 - neg1
    # We use the embedding matrix W_E
    
    W_E = model.W_E.weight.detach() # [vocab_size, d_model]
    
    target_vector = torch.zeros(model.d_model)
    
    for word in request.positive:
        ids = enc.encode(word)
        if not ids: continue
        # Use the first token if multiple (simplification)
        idx = ids[0]
        target_vector += W_E[idx]
        
    for word in request.negative:
        ids = enc.encode(word)
        if not ids: continue
        idx = ids[0]
        target_vector -= W_E[idx]
        
    # Find closest vectors (cosine similarity)
    # Normalize target
    target_norm = F.normalize(target_vector.unsqueeze(0), dim=1)
    W_E_norm = F.normalize(W_E, dim=1)
    
    # Similarity: target @ W_E.T
    sims = torch.matmul(target_norm, W_E_norm.T).squeeze()
    
    # Get top-k
    top_k_sims, top_k_indices = torch.topk(sims, request.top_k + len(request.positive) + len(request.negative))
    
    results = []
    input_words = set(request.positive + request.negative)
    
    for i in range(len(top_k_indices)):
        idx = top_k_indices[i].item()
        token = enc.decode([idx])
        
        # Filter out input words to find "new" result
        # This is a rough filter since tokenization might differ
        # But good enough for "King - Man + Woman = Queen"
        if token.strip() in input_words:
            continue
            
        results.append({
            "token": token,
            "score": top_k_sims[i].item(),
            "id": idx
        })
        
        if len(results) >= request.top_k:
            break
            
    return {"results": results}

@app.post("/token-predictions")
def get_token_predictions(request: TextRequest):
    """Get predictions for each token position in the sequence"""
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    ids = enc.encode(text)
    input_tensor = torch.tensor(ids).unsqueeze(0)
    
    with torch.no_grad():
        logits = model(input_tensor)  # [B, T, vocab_size]
    
    # For each position, get the top-k predictions
    token_predictions = []
    
    for pos in range(len(ids)):
        pos_logits = logits[0, pos, :]
        probs = F.softmax(pos_logits, dim=-1)
        
        # Get top-k
        top_k_probs, top_k_indices = torch.topk(probs, request.top_k)
        
        predictions = []
        for i in range(request.top_k):
            token_id = top_k_indices[i].item()
            token_str = enc.decode([token_id])
            prob = top_k_probs[i].item()
            predictions.append({"token": token_str, "prob": prob, "id": token_id})
        
        # Also get the actual token's probability
        actual_token_id = ids[pos]
        actual_prob = probs[actual_token_id].item()
        
        token_predictions.append({
            "position": pos,
            "actual_token": enc.decode([actual_token_id]),
            "actual_token_id": actual_token_id,
            "actual_prob": actual_prob,
            "top_k": predictions
        })
    
    return {
        "tokens": [enc.decode([i]) for i in ids],
        "predictions": token_predictions
    }

@app.post("/eigenvalues")
def get_eigenvalues(request: TextRequest):
    """Compute eigenvalues of attention patterns for each head"""
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    ids = enc.encode(text)
    input_tensor = torch.tensor(ids).unsqueeze(0)
    
    with torch.no_grad():
        _, _, pattern, _, _, _ = model(input_tensor, return_all=True)
    
    # pattern shape: [B, n_heads, T, T]
    pattern = pattern[0]  # Remove batch dim: [n_heads, T, T]
    
    eigenvalue_data = []
    
    for h in range(model.n_heads):
        attn_matrix = pattern[h]  # [T, T]
        
        # Compute eigenvalues
        eigenvalues = torch.linalg.eigvals(attn_matrix)
        
        # Sort by magnitude
        eigenvalues_sorted = torch.sort(torch.abs(eigenvalues), descending=True)[0]
        
        eigenvalue_data.append({
            "head": h,
            "eigenvalues": eigenvalues_sorted.real.cpu().numpy().tolist(),
            "num_significant": int((eigenvalues_sorted > 0.1).sum().item()),  # Count eigenvalues > 0.1
            "rank_estimate": int((eigenvalues_sorted > 0.01).sum().item())  # Effective rank
        })
    
    return {
        "eigenvalues": eigenvalue_data,
        "tokens": [enc.decode([i]) for i in ids]
    }

@app.post("/induction-score")
def get_induction_score(request: TextRequest):
    """Detect in-context learning behaviors: copying and induction heads"""
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    ids = enc.encode(text)
    input_tensor = torch.tensor(ids).unsqueeze(0)
    
    with torch.no_grad():
        _, _, pattern, _, _, _ = model(input_tensor, return_all=True)
    
    # pattern shape: [B, n_heads, T, T]
    pattern = pattern[0].cpu().numpy()  # [n_heads, T, T]
    
    tokens = [enc.decode([i]) for i in ids]
    
    head_behaviors = []
    
    for h in range(model.n_heads):
        attn = pattern[h]  # [T, T]
        
        # Detect copying behavior: high attention to previous identical tokens
        copying_score = 0.0
        copying_examples = []
        
        # Detect induction behavior: attention to token after previous occurrence
        induction_score = 0.0
        induction_examples = []
        
        # For each position
        for i in range(len(ids)):
            # Look for previous occurrences of the same token
            for j in range(i):
                if ids[j] == ids[i]:
                    # Found a repeat! Check attention weight
                    copying_score += attn[i, j]
                    if attn[i, j] > 0.3:  # Significant attention
                        copying_examples.append({
                            "from_pos": j,
                            "to_pos": i,
                            "token": tokens[i],
                            "attention": float(attn[i, j])
                        })
                    
                    # Check for induction: does position i attend to j+1?
                    if j + 1 < len(ids):
                        induction_score += attn[i, j + 1]
                        if attn[i, j + 1] > 0.3:
                            induction_examples.append({
                                "pattern_pos": j,
                                "query_pos": i,
                                "attend_to": j + 1,
                                "pattern_token": tokens[j],
                                "next_token": tokens[j + 1],
                                "attention": float(attn[i, j + 1])
                            })
        
        # Normalize scores
        num_tokens = len(ids)
        copying_score = copying_score / max(num_tokens, 1)
        induction_score = induction_score / max(num_tokens, 1)
        
        # Detect diagonal attention (attending to self)
        diagonal_score = np.mean([attn[i, i] for i in range(len(ids))])
        
        # Detect previous token attention
        prev_token_score = 0.0
        if len(ids) > 1:
            prev_token_score = np.mean([attn[i, i-1] for i in range(1, len(ids))])
        
        head_behaviors.append({
            "head": h,
            "copying_score": float(copying_score),
            "induction_score": float(induction_score),
            "diagonal_score": float(diagonal_score),
            "prev_token_score": float(prev_token_score),
            "copying_examples": copying_examples[:5],  # Top 5
            "induction_examples": induction_examples[:5],
            "behavior_type": classify_head_behavior(copying_score, induction_score, diagonal_score, prev_token_score)
        })
    
    return {
        "behaviors": head_behaviors,
        "tokens": tokens
    }

def classify_head_behavior(copying, induction, diagonal, prev_token):
    """Classify the primary behavior of an attention head"""
    scores = {
        "copying": copying,
        "induction": induction,
        "diagonal": diagonal,
        "prev_token": prev_token
    }
    
    max_behavior = max(scores, key=scores.get)
    max_score = scores[max_behavior]
    
    if max_score < 0.1:
        return "diffuse"
    elif max_behavior == "copying":
        return "copying"
    elif max_behavior == "induction":
        return "induction"
    elif max_behavior == "diagonal":
        return "self-attention"
    elif max_behavior == "prev_token":
        return "previous-token"
    else:
        return "mixed"

@app.post("/logit-lens")
def get_logit_lens(request: TextRequest):
    """Apply logit lens: show predictions at intermediate computation stages"""
    text = request.text
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    ids = enc.encode(text)
    input_tensor = torch.tensor(ids).unsqueeze(0)
    
    with torch.no_grad():
        # Get intermediate states
        logits, _, _, _, z, hidden_state = model(input_tensor, return_all=True)
        
        # We have:
        # - After embedding + positional: input to attention
        # - After attention (z): attention output
        # - After residual (hidden_state): final hidden state
        # - After unembedding (logits): final logits
        
        # Let's compute predictions at different stages
        # Stage 1: Direct from embeddings (before attention)
        pos = torch.arange(len(ids))
        embeddings = model.W_E(input_tensor) + model.W_pos(pos).unsqueeze(0)
        logits_pre_attn = model.W_U(embeddings)
        
        # Stage 2: After attention but before adding residual
        # This would be: embeddings + attention_output
        # But we already have hidden_state which is embeddings + attn_out
        
        # Stage 3: Final logits (already have this)
    
    # For each position, get top-k at each stage
    lens_data = []
    
    for pos in range(len(ids)):
        # Pre-attention predictions
        pre_probs = F.softmax(logits_pre_attn[0, pos, :], dim=-1)
        pre_top_k_probs, pre_top_k_indices = torch.topk(pre_probs, request.top_k)
        
        # Final predictions
        final_probs = F.softmax(logits[0, pos, :], dim=-1)
        final_top_k_probs, final_top_k_indices = torch.topk(final_probs, request.top_k)
        
        lens_data.append({
            "position": pos,
            "token": enc.decode([ids[pos]]),
            "pre_attention": [
                {"token": enc.decode([idx.item()]), "prob": prob.item()}
                for prob, idx in zip(pre_top_k_probs, pre_top_k_indices)
            ],
            "final": [
                {"token": enc.decode([idx.item()]), "prob": prob.item()}
                for prob, idx in zip(final_top_k_probs, final_top_k_indices)
            ]
        })
    
    return {
        "lens": lens_data,
        "tokens": [enc.decode([i]) for i in ids]
    }
