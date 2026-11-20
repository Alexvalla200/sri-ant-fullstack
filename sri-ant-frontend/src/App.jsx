import { useState } from 'react';

const API = 'http://localhost:8080/api/v1';

export default function App() {
  const [email, setEmail] = useState('');
  const [ruc, setRuc] = useState('');
  const [placa, setPlaca] = useState('');

  const [contribuyente, setContribuyente] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);
  const [licencia, setLicencia] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerificarRuc = async (e) => {
    e.preventDefault();
    setError('');
    setContribuyente(null);
    setVehiculo(null);
    setLicencia(null);

    if (ruc.length !== 13) {
      setError('Ingresa un RUC válido de 13 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/contribuyente/${ruc}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al consultar SRI');
      setContribuyente(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onConsultarTodo = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const cedula = ruc.slice(0, 10);

    try {
      const [resV, resL] = await Promise.all([
        fetch(`${API}/vehiculo/${placa}`),
        fetch(`${API}/licencia/${cedula}?placa=${placa}`)
      ]);
      const dataV = await resV.json();
      const dataL = await resL.json();

      if (!resV.ok) throw new Error('No se pudo obtener el vehículo.');
      setVehiculo(dataV);

      if (!resL.ok) throw new Error(dataL.error || 'No se pudo obtener la licencia.');
      setLicencia(dataL);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Consulta SRI y ANT</h1>

      <form onSubmit={onVerificarRuc} style={{ display: 'grid', gap: '0.75rem' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="RUC Persona Natural (13 dígitos)"
          maxLength={13}
          value={ruc}
          onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Consultando...' : 'Verificar RUC en SRI'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {contribuyente && (
        <section style={{ marginTop: '1.5rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Contribuyente (Persona Natural)</h2>
          <p><strong>Nombre / Razón Social:</strong> {contribuyente.razonSocial}</p>
          <p><strong>Estado:</strong> {contribuyente.estadoContribuyenteRuc}</p>

          <form onSubmit={onConsultarTodo} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Placa vehicular (ej. PBX1234)"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              required
            />
            <button type="submit" disabled={loading}>Consultar Vehículo y Puntos</button>
          </form>
        </section>
      )}

      {vehiculo && (
        <section style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Vehículo (SRI)</h2>
          <p><strong>Placa:</strong> {vehiculo.numeroPlaca}</p>
          <p><strong>Marca / Modelo:</strong> {vehiculo.descripcionMarca} {vehiculo.descripcionModelo}</p>
          <p><strong>Año:</strong> {vehiculo.anioAuto}</p>
        </section>
      )}

      {licencia && (
        <section style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Licencia (ANT)</h2>
          <p><strong>Cédula:</strong> {licencia.cedula}</p>
          <p><strong>Puntos:</strong> {licencia.puntos}</p>
          <p><strong>Origen:</strong> {licencia.origen} ({licencia.actualizadoEn})</p>
        </section>
      )}
    </main>
  );
}