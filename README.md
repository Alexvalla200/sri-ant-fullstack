# Sistema de Consulta Ciudadana (SRI + ANT + Caché Cloud)

Aplicación web full-stack que permite consultar información tributaria de **Persona Natural** y datos vehiculares en el **SRI**, así como los puntos de licencia en la **ANT** aplicando un patrón de resiliencia con **caché en la nube (Redis Cloud)** para mitigar la baja disponibilidad del portal de la ANT. La arquitectura del sistema está modelada bajo el enfoque **C4** en **IcePanel**.

---

## Arquitectura C4 (IcePanel)

- **Modelo C4 en IcePanel:** https://s.icepanel.io/DS5Qhjsycvv5jt/NIuk

### Niveles modelados
1. **Contexto (Nivel 1):** Interacción del **Ciudadano** con el **Sistema de Consulta Ciudadana** y las integraciones externas (**API REST SRI** y **Portal Web ANT**).
2. **Contenedores (Nivel 2):**
   - **Frontend Web:** Aplicación SPA desarrollada con **React** y **Vite**.
   - **Backend API:** Servicio REST desarrollado con **Java** y **Spring Boot**.
   - **Caché Cloud:** Base de datos en memoria administrada en **Redis Cloud** (`ant-cache`).
3. **Componentes (Nivel 3):** Detalle interno del backend (`ConsultaController`, `SriService`, `AntService` y `RedisConfig`).

---

## Flujo funcional y patrón de resiliencia

1. El usuario ingresa su **correo electrónico** y su **RUC de Persona Natural** (13 dígitos).
2. El backend verifica la existencia del RUC en el SRI, consulta sus datos consolidados y valida que corresponda a **Persona Natural**.
3. Se solicita la **matrícula / placa vehicular** para consultar los datos del vehículo en el SRI.
4. A partir de la cédula (primeros 10 dígitos del RUC) y la placa, se consultan los puntos de licencia en el portal de la ANT:
   - **Respuesta exitosa en vivo:** Se retorna el dato actual y se almacena/actualiza en **Redis Cloud** con TTL de respaldo.
   - **Caída o timeout de la ANT:** Se aplica *fallback* leyendo el último registro válido almacenado en **Redis Cloud**, indicando en la respuesta el origen (`REDIS_CACHE_FALLBACK`) y la fecha de actualización.

---

## Estructura del repositorio

```text
sri-ant-project/
├── sri-ant-backend/    # API REST en Java + Spring Boot + Redis + Jsoup
├── sri-ant-frontend/   # Interfaz web en React + Vite
├── .gitignore
└── README.md
