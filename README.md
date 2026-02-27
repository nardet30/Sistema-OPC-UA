# 🏭 OPC UA Industrial Hub - Centro de Control M2M v2.5.41

[![Normativa](https://img.shields.io/badge/Norma-IEC_62541-blue.svg)](https://opcfoundation.org/about/opc-technologies/opc-ua/)
[![Seguridad](https://img.shields.io/badge/Seguridad-X.509_PKI-green.svg)](#)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](LICENSE)

Un centro de mando industrial avanzado basado en la norma **IEC 62541 (OPC UA)** para la monitorización y control de sistemas de comunicación Máquina a Máquina (M2M). Diseñado para la convergencia IT/OT con una interfaz premium de alto rendimiento.

![Dashboard Preview](https://via.placeholder.com/800x450.png?text=OPC+UA+Industrial+Hub+Preview)

## 🌟 Características Principales

### 🏗️ Arquitectura Orientada a Servicios (SOA)
- **Modelado de Información:** Implementación de un Espacio de Nodos (Address Space) jerárquico y orientado a objetos.
- **Explorador de Nodos:** Inspección dinámica de parámetros técnicos (NodeId, DataType, AccessLevel).
- **Simulador de PLC Siemens S7-1500:** Telemetría en tiempo real de temperatura y vibración con inercia térmica.

### 🔐 Seguridad 'Built-in' (Seguridad por Diseño)
- **Autenticación PKI:** Gestión de certificados digitales X.509.
- **Cifrado Avanzado:** Implementación lógica de políticas `Basic256Sha256` y modo `SignAndEncrypt`.
- **Auditoría Industrial:** Registro detallado de eventos según la normativa para trazabilidad completa.

### 🔄 Alta Disponibilidad y Diagnóstico
- **Mecanismo de Failover (Redundancia):** Simulación de conmutación por error entre servidores primario y secundario.
- **Gráficos en Tiempo Real:** Visualización de tendencias de telemetría sin dependencias externas pesadas.

## 🚀 Instalación y Uso

### Opción 1: Uso Directo (Local)
1. Descarga o clona este repositorio.
2. Abre el archivo `index.html` en cualquier navegador moderno.
3. El sistema se inicializará automáticamente y comenzará a recibir telemetría.

### Opción 2: Desarrollo con Vite
Si deseas extender las funcionalidades del hub:
```bash
npm install
npm run dev
```

## 🛠️ Stack Tecnológico
- **Frontend:** HTML5 Semántico, Vanilla CSS (Glassmorphism), JavaScript (ES6+).
- **Core:** Motor de simulación OPC UA personalizado.
- **Iconografía:** Font Awesome 6.
- **Tipografía:** Inter & JetBrains Mono de Google Fonts.

## 📖 Guía de Uso Rápido
1. **Control de Proceso:** Usa el botón central para iniciar/detener la máquina y observar la curva de calor.
2. **Navegación:** Haz clic en los nodos de la barra lateral izquierda para inspeccionar sus metadatos técnicos en el panel derecho.
3. **Escenario de Fallo:** Pulsa "Redundancia Activada" para probar cómo el sistema cambia de servidor (Failover) ante una incidencia.

## 🤝 Contribuciones
Este proyecto es una demostración técnica de arquitectura industrial. Las contribuciones son bienvenidas para mejorar la simulación de protocolos o la interfaz de usuario.

---
Desarrollado para **3R Industria** por [Nardet30](https://github.com/nardet30).
