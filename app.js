/**
 * UI Application Orchestrator
 */
const app = {
    init() {
        this.logElement = document.getElementById('audit-log');
        this.plcTempElement = document.getElementById('plc-temp');
        this.vibRmsElement = document.getElementById('vib-rms');
        this.systemTimeElement = document.getElementById('system-time');
        this.plcChart = document.getElementById('plc-chart');
        this.vibChart = document.getElementById('vib-chart');

        this.setupListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        this.addLog("Inicializando Pila OPC UA Segura...");
        this.addLog("Política de Seguridad: Basic256Sha256 cargada.");
        this.addLog("Vinculación de Endpoint en opc.tcp://0.0.0.0:4840 CORRECTA.");
    },

    setupListeners() {
        window.opc.onChange((nodes, history, state) => {
            if (state.isRebooting) {
                this.plcTempElement.innerText = "OFFLINE";
                this.vibRmsElement.innerText = "---";
                document.getElementById('card-plc').style.opacity = "0.5";
            } else if (state.isFailoverActive) {
                this.plcTempElement.innerText = "CONMUTANDO...";
                this.vibRmsElement.innerText = "---";
            } else {
                this.plcTempElement.innerText = nodes['PLC_TEMP'].value.toFixed(1);
                this.vibRmsElement.innerText = nodes['VIB_RMS'].value.toFixed(3);
                document.getElementById('card-plc').style.opacity = "1";

                // Actualizar endpoint según el servidor activo
                const endpoint = document.getElementById('opc-endpoint');
                if (state.activeServer === "Secundario") {
                    endpoint.innerText = "opc.tcp://localhost:4841";
                    endpoint.style.color = "var(--secondary)";
                } else {
                    endpoint.innerText = "opc.tcp://localhost:4840";
                    endpoint.style.color = "var(--primary)";
                }

                // Efecto visual si está en ejecución
                const plcCard = document.getElementById('card-plc');
                const startBtn = document.getElementById('btn-iniciar');

                if (state.isRunning) {
                    plcCard.style.boxShadow = "0 0 20px rgba(0, 242, 255, 0.2)";
                    plcCard.querySelector('.live-indicator').style.background = "var(--primary)";

                    // Cambiar a botón de parada
                    startBtn.innerText = "DETENER PROCESO";
                    startBtn.classList.remove('btn-primary');
                    startBtn.classList.add('btn-danger');
                } else {
                    plcCard.style.boxShadow = "none";
                    plcCard.querySelector('.live-indicator').style.background = "#30363d";

                    // Cambiar a botón de inicio
                    startBtn.innerText = "INICIAR PROCESO";
                    startBtn.classList.remove('btn-danger');
                    startBtn.classList.add('btn-primary');
                }
            }
            this.renderCharts(history);
        });

        document.addEventListener('opc-audit', (e) => {
            if (e.detail) this.addLog(e.detail);
        });
    },

    renderCharts(history) {
        // Simple manual DOM-based sparklines for performance and no-deps
        this.renderSparkline(this.plcChart, history['PLC_TEMP'], 0, 100, '#00f2ff');
        this.renderSparkline(this.vibChart, history['VIB_RMS'], 0, 0.1, '#7000ff');
    },

    renderSparkline(container, data, min, max, color) {
        container.innerHTML = '';
        data.forEach(val => {
            const heightPerc = ((val - min) / (max - min)) * 100;
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${heightPerc}%`;
            bar.style.backgroundColor = color;
            container.appendChild(bar);
        });
    },

    addLog(msg) {
        const div = document.createElement('div');
        div.style.marginBottom = '5px';
        div.style.color = msg.includes('AUDIT') ? 'var(--warning)' : 'var(--text-dim)';
        div.innerText = `> ${msg}`;
        this.logElement.prepend(div);
    },

    clearLogs() {
        this.logElement.innerHTML = '';
    },

    updateClock() {
        this.systemTimeElement.innerText = new Date().toLocaleTimeString();
    },

    selectNode(element, nodeId) {
        // Manejo visual de selección
        document.querySelectorAll('.node-item').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');

        this.addLog(`EXPLORAR: Inspeccionando NodeId: ns=1;s=${nodeId}`);

        // Simulación de atributos OPC UA según el nodo
        const detailsContainer = document.getElementById('node-details');
        const attributes = this.getNodeAttributes(nodeId);

        let html = '<div class="details-grid">';
        for (const [key, val] of Object.entries(attributes)) {
            html += `<span class="details-label">${key}:</span><span class="details-value">${val}</span>`;
        }
        html += '</div>';
        detailsContainer.innerHTML = html;
    },

    getNodeAttributes(nodeId) {
        const base = {
            'Namespace': '1',
            'IdentifierType': 'String',
            'AccessLevel': 'CurrentRead',
            'UserAccessLevel': 'CurrentRead'
        };

        const registry = {
            'Root': { 'BrowseName': 'Root', 'NodeId': 'i=84', 'NodeClass': 'Object' },
            'Objects': { 'BrowseName': 'Objects', 'NodeId': 'i=85', 'NodeClass': 'Object' },
            'S7_1500': { 'BrowseName': 'Siemens_S7_1500', 'NodeId': 's=S7_1500', 'NodeClass': 'Object', 'Description': 'PLC Principal de Planta' },
            'Temp': { 'BrowseName': 'Temperatura', 'NodeId': 's=Temp', 'NodeClass': 'Variable', 'DataType': 'Double', 'AccessLevel': 'CurrentReadWrite' },
            'Pres': { 'BrowseName': 'Presion', 'NodeId': 's=Pres', 'NodeClass': 'Variable', 'DataType': 'Float' },
            'Vib': { 'BrowseName': 'Vibracion_RMS', 'NodeId': 's=Vib', 'NodeClass': 'Variable', 'DataType': 'Double' }
        };

        return { ...base, ...(registry[nodeId] || { 'BrowseName': 'Unknown', 'NodeId': nodeId }) };
    },

    toggleRedundancy() {
        window.opc.triggerFailover();
    }
};

window.onload = () => app.init();
window.app = app;
