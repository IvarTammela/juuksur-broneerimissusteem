/**
 * Broneerimise wizard - sammhaaval broneerimise loogika
 */
const BookingWizard = {
    // Valitud andmed
    state: {
        barberId: null,
        barberName: '',
        serviceId: null,
        serviceName: '',
        servicePrice: 0,
        serviceDuration: 0,
        date: null,
        startTime: null,
        endTime: null,
    },

    currentStep: 1,

    /** Initsialiseeri wizard */
    init() {
        this.loadBarbers();
        this.setupDatePicker();
        this.setupForm();
    },

    /** Lae juuksurid API-st */
    async loadBarbers() {
        try {
            const res = await fetch('/api/barbers');
            const barbers = await res.json();
            const container = document.getElementById('barbers-list');

            if (barbers.length === 0) {
                container.innerHTML = '<p class="text-gray-500">Juuksureid ei leitud.</p>';
                return;
            }

            container.innerHTML = barbers.map(barber => `
                <button onclick="BookingWizard.selectBarber('${barber.id}', '${this.escapeHtml(barber.name)}')"
                        class="bg-white border rounded-xl p-4 text-left hover:border-black hover:shadow-md transition">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg text-gray-500 font-bold">
                            ${barber.name.charAt(0)}
                        </div>
                        <div>
                            <h3 class="font-semibold">${this.escapeHtml(barber.name)}</h3>
                            <p class="text-gray-500 text-sm">${this.escapeHtml(barber.bio_et || '')}</p>
                        </div>
                    </div>
                </button>
            `).join('');
        } catch (err) {
            this.showError('Juuksurite laadimine ebaõnnestus.');
        }
    },

    /** Vali juuksur */
    async selectBarber(barberId, barberName) {
        this.state.barberId = barberId;
        this.state.barberName = barberName;
        this.state.serviceId = null;
        await this.loadServices(barberId);
        this.goToStep(2);
    },

    /** Lae teenused valitud juuksuri jaoks */
    async loadServices(barberId) {
        try {
            const res = await fetch(`/api/barbers/${barberId}/services`);
            const services = await res.json();
            const container = document.getElementById('services-list');

            if (services.length === 0) {
                container.innerHTML = '<p class="text-gray-500">Teenuseid ei leitud.</p>';
                return;
            }

            container.innerHTML = services.map(service => `
                <button onclick="BookingWizard.selectService('${service.service_id}', '${this.escapeHtml(service.name_et)}', ${service.price}, ${service.duration})"
                        class="w-full bg-white border rounded-lg p-4 text-left hover:border-black hover:shadow-md transition flex justify-between items-center">
                    <div>
                        <h3 class="font-semibold">${this.escapeHtml(service.name_et)}</h3>
                        <p class="text-gray-500 text-sm">${service.duration} min</p>
                    </div>
                    <span class="text-lg font-bold">${Number(service.price).toFixed(0)}&euro;</span>
                </button>
            `).join('');
        } catch (err) {
            this.showError('Teenuste laadimine ebaõnnestus.');
        }
    },

    /** Vali teenus */
    selectService(serviceId, serviceName, price, duration) {
        this.state.serviceId = serviceId;
        this.state.serviceName = serviceName;
        this.state.servicePrice = price;
        this.state.serviceDuration = duration;
        this.state.date = null;
        this.state.startTime = null;
        this.goToStep(3);
    },

    /** Seadista kuupäevavalik */
    setupDatePicker() {
        const dateInput = document.getElementById('booking-date');
        dateInput.addEventListener('change', () => {
            this.state.date = dateInput.value;
            this.state.startTime = null;
            this.loadSlots();
        });
    },

    /** Lae vabad ajad */
    async loadSlots() {
        const { barberId, serviceId, date } = this.state;
        if (!barberId || !serviceId || !date) return;

        const slotsContainer = document.getElementById('time-slots');
        const noSlotsMsg = document.getElementById('no-slots-message');
        slotsContainer.innerHTML = '<p class="col-span-full text-gray-500 text-center">Laen aegu...</p>';
        noSlotsMsg.classList.add('hidden');

        try {
            const res = await fetch(`/api/availability?barberId=${barberId}&serviceId=${serviceId}&date=${date}`);
            const data = await res.json();

            if (!res.ok) {
                slotsContainer.innerHTML = '';
                noSlotsMsg.textContent = data.error || 'Viga aegade laadimisel.';
                noSlotsMsg.classList.remove('hidden');
                return;
            }

            const slots = data.slots || [];

            if (slots.length === 0) {
                slotsContainer.innerHTML = '';
                noSlotsMsg.classList.remove('hidden');
                return;
            }

            slotsContainer.innerHTML = slots.map(slot => `
                <button onclick="BookingWizard.selectTime('${slot.startTime}', '${slot.endTime}')"
                        class="time-slot-btn border rounded-lg py-2 px-3 text-center text-sm hover:border-black hover:bg-gray-50 transition"
                        data-time="${slot.startTime}">
                    ${slot.startTime}
                </button>
            `).join('');
        } catch (err) {
            slotsContainer.innerHTML = '';
            noSlotsMsg.textContent = 'Viga aegade laadimisel.';
            noSlotsMsg.classList.remove('hidden');
        }
    },

    /** Vali kellaaeg */
    selectTime(startTime, endTime) {
        this.state.startTime = startTime;
        this.state.endTime = endTime;

        // Märgi aktiivne nupp
        document.querySelectorAll('.time-slot-btn').forEach(btn => {
            btn.classList.remove('bg-black', 'text-white', 'border-black');
        });
        const activeBtn = document.querySelector(`.time-slot-btn[data-time="${startTime}"]`);
        if (activeBtn) {
            activeBtn.classList.add('bg-black', 'text-white', 'border-black');
        }

        // Uuenda kokkuvõte ja mine samm 4-le
        this.updateSummary();
        this.goToStep(4);
    },

    /** Uuenda kokkuvõtte andmeid */
    updateSummary() {
        document.getElementById('summary-barber').textContent = this.state.barberName;
        document.getElementById('summary-service').textContent = this.state.serviceName;
        document.getElementById('summary-date').textContent = this.formatDate(this.state.date);
        document.getElementById('summary-time').textContent = `${this.state.startTime} - ${this.state.endTime}`;
        document.getElementById('summary-price').textContent = `${Number(this.state.servicePrice).toFixed(0)}\u20AC`;
    },

    /** Seadista vormi esitamine */
    setupForm() {
        const form = document.getElementById('booking-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitBooking(form);
        });
    },

    /** Esita broneering */
    async submitBooking(form) {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saadan...';
        this.hideError();

        const formData = new FormData(form);
        const body = {
            barber_id: this.state.barberId,
            service_id: this.state.serviceId,
            date: this.state.date,
            start_time: this.state.startTime,
            client_name: formData.get('client_name'),
            client_phone: formData.get('client_phone'),
            client_email: formData.get('client_email') || null,
            notes: formData.get('notes') || null,
            _csrf_token: formData.get('_csrf_token'),
        };

        try {
            const res = await fetch('/broneeri', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': body._csrf_token,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                this.showError(data.error || 'Broneerimine ebaõnnestus.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Kinnita broneering';
                return;
            }

            // Kuvame kinnitust
            this.showConfirmation(data.appointment);

        } catch (err) {
            this.showError('Võrgu viga. Palun proovige uuesti.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Kinnita broneering';
        }
    },

    /** Kuva kinnitusleht */
    showConfirmation(appointment) {
        // Peida kõik sammud
        document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
        document.getElementById('steps-indicator').classList.add('hidden');

        const details = document.getElementById('confirmed-details');
        details.innerHTML = `
            <p><strong>Juuksur:</strong> ${this.escapeHtml(appointment.barber_name)}</p>
            <p><strong>Teenus:</strong> ${this.escapeHtml(appointment.service_name)}</p>
            <p><strong>Kuupäev:</strong> ${this.formatDate(appointment.date)}</p>
            <p><strong>Kellaaeg:</strong> ${appointment.start_time} - ${appointment.end_time}</p>
            <p><strong>Hind:</strong> ${Number(appointment.total_price).toFixed(0)}\u20AC</p>
            <p><strong>Nimi:</strong> ${this.escapeHtml(appointment.client_name)}</p>
            <p><strong>Telefon:</strong> ${this.escapeHtml(appointment.client_phone)}</p>
        `;

        document.getElementById('step-confirmed').classList.remove('hidden');
    },

    /** Mine sammule */
    goToStep(step) {
        this.currentStep = step;

        // Peida kõik, näita valitud
        document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
        document.getElementById(`step-${step}`).classList.remove('hidden');
        this.hideError();

        // Uuenda sammude indikaatorit
        document.querySelectorAll('.step-dot').forEach(dot => {
            const dotStep = parseInt(dot.dataset.step);
            const circle = dot.querySelector('div');
            if (dotStep <= step) {
                circle.className = 'w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold';
            } else {
                circle.className = 'w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold';
            }
        });
    },

    /** Kuva veateade */
    showError(message) {
        const el = document.getElementById('error-message');
        el.textContent = message;
        el.classList.remove('hidden');
    },

    /** Peida veateade */
    hideError() {
        document.getElementById('error-message').classList.add('hidden');
    },

    /** XSS kaitse */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /** Formaadi kuupäev */
    formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        const days = ['Pühapäev', 'Esmaspäev', 'Teisipäev', 'Kolmapäev', 'Neljapäev', 'Reede', 'Laupäev'];
        const months = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni',
                        'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
        return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
    },
};

// Käivita wizard lehel
document.addEventListener('DOMContentLoaded', () => BookingWizard.init());
