import { useState, useEffect } from 'react'
import TokenPrediction from './components/TokenPrediction'
import AttentionMap from './components/AttentionMap'
import EmbeddingSpace from './components/EmbeddingSpace'
import WeightAnalysis from './components/WeightAnalysis'
import VectorArithmetic from './components/VectorArithmetic'
import TokenSequence from './components/TokenSequence'
import EigenvalueAnalysis from './components/EigenvalueAnalysis'
import InContextLearning from './components/InContextLearning'
import LogitLens from './components/LogitLens'
import { predictNextToken, getAttention, getEmbeddings, getActivations, getWeights } from './api'

function App() {
  const [inputText, setInputText] = useState("The cat sat on the")
  const [predictions, setPredictions] = useState([])
  const [attentionData, setAttentionData] = useState(null)
  const [embeddings, setEmbeddings] = useState([])
  const [activations, setActivations] = useState(null)
  const [weights, setWeights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('prediction')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [predRes, attnRes, actRes] = await Promise.all([
        predictNextToken(inputText),
        getAttention(inputText),
        getActivations(inputText)
      ])
      setPredictions(predRes.predictions)
      setAttentionData(attnRes)
      setActivations(actRes)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    // Initial fetch for static data
    getEmbeddings().then(res => setEmbeddings(res.embeddings))
    getWeights().then(res => setWeights(res.analysis))

    // Fetch dynamic data
    fetchData()
  }, [])

  const handleRun = () => {
    fetchData()
  }

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-logo">
            <div className="logo-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="header-title">
              Mechanistic Interpretability
            </h1>
          </div>

          <nav className="nav-tabs">
            {['prediction', 'attention', 'tokens', 'eigenvalues', 'induction', 'logit-lens', 'embeddings', 'weights', 'arithmetic'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-container">
        {/* Input Section */}
        <div className="input-section">
          <div className="input-inner">
            <label className="input-label">
              Model Input
            </label>
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="text-input"
                  placeholder="Enter text to analyze..."
                />
                <div className="input-glow" />
              </div>
              <button
                onClick={handleRun}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </>
                ) : (
                  <>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Run Model
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-600">
          {activeTab === 'prediction' && (
            <div className="fade-in">
              <TokenPrediction predictions={predictions} />
            </div>
          )}
          {activeTab === 'attention' && attentionData && (
            <div className="fade-in">
              <AttentionMap data={attentionData} />
            </div>
          )}
          {activeTab === 'embeddings' && (
            <div className="fade-in">
              <EmbeddingSpace data={embeddings} />
            </div>
          )}
          {activeTab === 'weights' && weights && (
            <div className="fade-in">
              <WeightAnalysis data={weights} />
            </div>
          )}
          {activeTab === 'arithmetic' && (
            <div className="fade-in">
              <VectorArithmetic />
            </div>
          )}
          {activeTab === 'tokens' && (
            <div className="fade-in">
              <TokenSequence text={inputText} />
            </div>
          )}
          {activeTab === 'eigenvalues' && (
            <div className="fade-in">
              <EigenvalueAnalysis text={inputText} />
            </div>
          )}
          {activeTab === 'induction' && (
            <div className="fade-in">
              <InContextLearning text={inputText} />
            </div>
          )}
          {activeTab === 'logit-lens' && (
            <div className="fade-in">
              <LogitLens text={inputText} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
