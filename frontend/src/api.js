import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const predictNextToken = async (text, top_k = 5) => {
        const response = await axios.post(`${API_URL}/predict`, { text, top_k });
        return response.data;
};

export const getAttention = async (text) => {
        const response = await axios.post(`${API_URL}/attention`, { text });
        return response.data;
};

export const getEmbeddings = async () => {
        const response = await axios.get(`${API_URL}/embeddings`);
        return response.data;
};

export const getActivations = async (text) => {
        const response = await axios.post(`${API_URL}/activations`, { text });
        return response.data;
};

export const getWeights = async () => {
        const response = await axios.get(`${API_URL}/weights`);
        return response.data;
};

export const getAnalogy = async (positive, negative) => {
        const response = await axios.post(`${API_URL}/analogy`, { positive, negative });
        return response.data;
};

export const getTokenPredictions = async (text, top_k = 5) => {
        const response = await axios.post(`${API_URL}/token-predictions`, { text, top_k });
        return response.data;
};

export const getEigenvalues = async (text) => {
        const response = await axios.post(`${API_URL}/eigenvalues`, { text });
        return response.data;
};

export const getInductionScore = async (text) => {
        const response = await axios.post(`${API_URL}/induction-score`, { text });
        return response.data;
};

export const getLogitLens = async (text, top_k = 5) => {
        const response = await axios.post(`${API_URL}/logit-lens`, { text, top_k });
        return response.data;
};
