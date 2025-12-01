// ============== MÓDULO: VALIDACIÓN DE FORMULARIO DE CONTACTO ==============

class ContactFormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;

    this.inputs = {
      nombre: document.getElementById('nombre'),
      direccion: document.getElementById('direccion'),
      localidad: document.getElementById('localidad'),
      provincia: document.getElementById('provincia'),
      cp: document.getElementById('cp'),
      email: document.getElementById('email'),
      telefono: document.getElementById('telefono'),
      movil: document.getElementById('movil'),
      tipo: document.getElementById('tipo'),
      rgpd: document.getElementById('rgpd'),
      submitBtn: document.getElementById('submitBtn')
    };

    this.errorSpans = {};
    Object.keys(this.inputs).forEach(key => {
      if (key !== 'submitBtn') {
        this.errorSpans[key] = document.getElementById(`error-${key}`);
      }
    });

    this.primerCampoConError = null;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validate()) {
      this.scrollToFirstError();
      return;
    }

    this.submitForm();
  }

  validate() {
    this.clearErrors();
    this.primerCampoConError = null;
    let isValid = true;

    const values = this.getValues();

    // Validaciones obligatorias
    if (!values.nombre) {
      this.showError('nombre', 'Campo obligatorio');
      isValid = false;
    }

    if (!values.direccion) {
      this.showError('direccion', 'Campo obligatorio');
      isValid = false;
    }

    if (!values.localidad) {
      this.showError('localidad', 'Campo obligatorio');
      isValid = false;
    }

    if (!values.provincia) {
      this.showError('provincia', 'Campo obligatorio');
      isValid = false;
    }

    // Validar CP (obligatorio y formato)
    if (!values.cp) {
      this.showError('cp', 'Campo obligatorio');
      isValid = false;
    } else if (!/^\d{5}$/.test(values.cp)) {
      this.showError('cp', 'Debe tener 5 dígitos');
      isValid = false;
    }

    // Validar tipo de combustible
    if (!values.tipo) {
      this.showError('tipo', 'Selecciona un tipo');
      isValid = false;
    }

    // Validar email (si se proporciona)
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      this.showError('email', 'El correo debe contener un @');
      isValid = false;
    }

    // Validar teléfonos (si se proporcionan)
    const phoneRegex = /^[0-9+\s]{9,15}$/;
    if (values.telefono && !phoneRegex.test(values.telefono)) {
      this.showError('telefono', 'Mínimo 9 dígitos');
      isValid = false;
    }

    if (values.movil && !phoneRegex.test(values.movil)) {
      this.showError('movil', 'Mínimo 9 dígitos');
      isValid = false;
    }

    // Validar RGPD
    if (!this.inputs.rgpd.checked) {
      this.showError('rgpd', 'Debe aceptar la política de privacidad');
      isValid = false;
    }

    // Verificar honeypot
    const honeypot = this.form.querySelector('[name="_honey"]');
    if (honeypot && honeypot.value !== '') {
      console.warn('Envío bloqueado: honeypot detectado');
      return false;
    }

    return isValid;
  }

  getValues() {
    return {
      nombre: this.inputs.nombre?.value.trim() || '',
      direccion: this.inputs.direccion?.value.trim() || '',
      localidad: this.inputs.localidad?.value.trim() || '',
      provincia: this.inputs.provincia?.value.trim() || '',
      cp: this.inputs.cp?.value.trim() || '',
      email: this.inputs.email?.value.trim() || '',
      telefono: this.inputs.telefono?.value.trim() || '',
      movil: this.inputs.movil?.value.trim() || '',
      tipo: this.inputs.tipo?.value.trim() || ''
    };
  }

  showError(fieldName, message) {
    const input = this.inputs[fieldName];
    const errorSpan = this.errorSpans[fieldName];

    if (input) {
      input.classList.add('input-error');
      if (!this.primerCampoConError) {
        this.primerCampoConError = input;
      }
    }

    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  clearErrors() {
    Object.values(this.errorSpans).forEach(span => {
      if (span) span.textContent = '';
    });

    document.querySelectorAll('.input-error').forEach(el => {
      el.classList.remove('input-error');
    });
  }

  scrollToFirstError() {
    if (this.primerCampoConError) {
      this.primerCampoConError.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      this.primerCampoConError.focus();
    }
  }

  submitForm() {
    // Prevenir doble envío
    this.inputs.submitBtn.disabled = true;
    this.inputs.submitBtn.textContent = 'Enviando...';
    this.inputs.submitBtn.style.opacity = '0.6';
    this.inputs.submitBtn.style.cursor = 'not-allowed';

    // Agregar CC si hay email
    const email = this.inputs.email.value.trim();
    if (email) {
      const ccInput = document.createElement('input');
      ccInput.type = 'hidden';
      ccInput.name = '_cc';
      ccInput.value = email;
      this.form.appendChild(ccInput);
    }

    // Mostrar modal
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.add('show');
      
      // Cerrar automáticamente después de 5s
      setTimeout(() => modal.classList.remove('show'), 5000);
    }

    // Enviar formulario
    setTimeout(() => this.form.submit(), 1500);
  }
}

// ============== MÓDULO: CONFIGURACIÓN DE EMAIL SEGURA ==============

class SecureEmailConfig {
  constructor(formSelector) {
    this.form = document.getElementById(formSelector);
    if (!this.form) return;
    this.obfuscateEmail();
  }

  obfuscateEmail() {
    const parts = ['albertoetfenergia', 'gmail', 'com'];
    const email = parts.join('@').replace('@', '@').replace('gmail@', 'gmail.');
    this.form.action = 'https://formsubmit.co/' + email;
  }
}

// ============== MÓDULO: MENÚ HAMBURGUESA ==============

class HamburgerMenu {
  constructor(burgerSelector, menuSelector) {
    this.burger = document.querySelector(burgerSelector);
    this.menu = document.querySelector(menuSelector);
    
    if (!this.burger || !this.menu) return;
    this.init();
  }

  init() {
    this.burger.addEventListener('click', () => this.toggle());
    
    // Cerrar con ESC (accesibilidad)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.menu.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  toggle() {
    this.burger.classList.toggle('is-open');
    this.menu.classList.toggle('is-open');
  }

  close() {
    this.burger.classList.remove('is-open');
    this.menu.classList.remove('is-open');
  }
}

// ============== INICIALIZACIÓN ==============

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar validador de formulario
  new ContactFormValidator('.contact-form');
  
  // Configurar email seguro
  new SecureEmailConfig('contactForm');
  
  // Inicializar menú hamburguesa
  new HamburgerMenu('.hero-burger', '.hero-menu');
});
