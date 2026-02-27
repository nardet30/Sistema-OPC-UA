/**
 * OPC UA Engine Simulator (IEC 62541 compliant logic)
 * This class simulates the Server Service Set and Address Space.
 */
class OPCUAEngine {
    constructor() {
        this.nodes = {
            'PLC_TEMP': { value: 24.5, unit: '°C', name: 'Temperatura' },
            'VIB_RMS': { value: 0.012, unit: 'mm/s', name: 'Vibración' }
        };
        this.history = { 'PLC_TEMP': [], 'VIB_RMS': [] };
        this.securityPolicy = 'Basic256Sha256';
        this.messageSecurityMode = 'SignAndEncrypt';
        this.listeners = [];

        // Estados de simulación
        this.isRunning = false;
        this.isRebooting = false;
        this.targetTemp = 24.5;
        this.activeServer = "Primario";
        this.isFailoverActive = false;
    }

    updateTelemetry() {
        if (this.isRebooting) return; // No hay datos durante reinicio

        // Lógica de Temperatura
        if (this.isRunning) {
            this.targetTemp = 65.0 + Math.sin(Date.now() / 5000) * 5; // Simular calor de proceso
        } else {
            this.targetTemp = 24.5; // Enfriamiento natural
        }

        // Suavizado de transición (Inercia térmica)
        this.nodes['PLC_TEMP'].value += (this.targetTemp - this.nodes['PLC_TEMP'].value) * 0.1;

        // Lógica de Vibración
        if (this.isRunning) {
            this.nodes['VIB_RMS'].value = 0.045 + Math.random() * 0.02;
        } else {
            this.nodes['VIB_RMS'].value *= 0.8; // Parada gradual
            if (this.nodes['VIB_RMS'].value < 0.001) this.nodes['VIB_RMS'].value = 0;
        }

        // Guardar historial
        this.history['PLC_TEMP'].push(this.nodes['PLC_TEMP'].value);
        this.history['VIB_RMS'].push(this.nodes['VIB_RMS'].value);
        if (this.history['PLC_TEMP'].length > 50) {
            this.history['PLC_TEMP'].shift();
            this.history['VIB_RMS'].shift();
        }

        this.notify();
    }

    notify() {
        this.listeners.forEach(cb => cb(this.nodes, this.history, {
            isRunning: this.isRunning,
            isRebooting: this.isRebooting,
            activeServer: this.activeServer,
            isFailoverActive: this.isFailoverActive
        }));
    }

    onChange(callback) {
        this.listeners.push(callback);
    }

    triggerFailover() {
        if (this.isFailoverActive) return;

        this.isFailoverActive = true;
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];

        document.dispatchEvent(new CustomEvent('opc-audit', {
            detail: `[${timestamp}] CRÍTICO: Fallo detectado en Servidor Primario. Iniciando conmutación...`
        }));

        setTimeout(() => {
            this.activeServer = this.activeServer === "Primario" ? "Secundario" : "Primario";
            this.isFailoverActive = false;
            document.dispatchEvent(new CustomEvent('opc-audit', {
                detail: `[${new Date().toLocaleTimeString()}] SISTEMA: Conmutación completada. Servidor activo: ${this.activeServer}.`
            }));
            this.notify();
        }, 2000);
    }

    callMethod(methodName) {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        let event = "";

        if (methodName === 'Reset') {
            this.isRebooting = true;
            this.isRunning = false;
            event = `[${timestamp}] AUDITORÍA: Comando de REINICIO ejecutado. Desconectando nodos...`;

            setTimeout(() => {
                this.isRebooting = false;
                this.nodes['PLC_TEMP'].value = 20.0;
                this.nodes['VIB_RMS'].value = 0;
                document.dispatchEvent(new CustomEvent('opc-audit', {
                    detail: `[${new Date().toLocaleTimeString()}] SISTEMA: Reinicio completado. Nodos re-establecidos.`
                }));
            }, 3000);
        }

        if (methodName === 'Iniciar') {
            this.isRunning = !this.isRunning;
            const estado = this.isRunning ? "INICIADO" : "PARADO";
            event = `[${timestamp}] AUDITORÍA: Proceso ${estado} por el operador.`;
        }

        document.dispatchEvent(new CustomEvent('opc-audit', { detail: event }));
    }
}

const opc = new OPCUAEngine();
setInterval(() => opc.updateTelemetry(), 1000);
window.opc = opc;
