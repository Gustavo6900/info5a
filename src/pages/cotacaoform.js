import { useState } from 'react';

export default function CotacaoForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [url, setUrl] = useState(null);


  const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

 
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!startDate || !endDate) return;

  const apiUrl = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`;
  
  try {
    setIsLoading(true);
    setError('');
    const res = await fetch(apiUrl);
    const json = await res.json();
    setData(json.reverse()); 
  } catch (err) {
    setError('Erro ao carregar dados.');
    setData([]);
  } finally {
    setIsLoading(false);
  }
};

 
  const formatDate = (dateStr) => {
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${yyyy}${mm}${dd}`;
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Buscar Cotação USD/BRL</h1>

      <form onSubmit={handleSubmit}>
        <label>Data Início:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <br />
        <label>Data Fim:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <br />
        <button type="submit">Buscar</button>
      </form>

      {error && <p>Erro ao carregar dados.</p>}
      {isLoading && url && <p>Carregando...</p>}

      {data && Array.isArray(data) && data.length > 0 && (
        <div>
          <h2>Cotações Encontradas:</h2>
          {data.map((cotacao, index) => (
            <div key={index}>
              <p><strong>Data:</strong> {new Date(cotacao.timestamp * 1000).toLocaleDateString()}</p>
              <p><strong>Compra:</strong> R$ {cotacao.bid}</p>
              <p><strong>Venda:</strong> R$ {cotacao.ask}</p>
              <p><strong>Alta:</strong> R$ {cotacao.high}</p>
              <p><strong>Baixa:</strong> R$ {cotacao.low}</p>
              <p><strong>Variação:</strong> R$ {cotacao.varBid} ({cotacao.pctChange}%)</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
