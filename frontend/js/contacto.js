(function () {
    const form = document.getElementById('formContacto');
    if (!form) return;

    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');

    email.addEventListener('input', function () {
        if (email.validity.typeMismatch) {
            email.setCustomValidity('Introduce un correo válido.');
        } else {
            email.setCustomValidity('');
        }
    });

    telefono.addEventListener('input', function () {
        const v = telefono.value.trim();
        if (v === '') {
            telefono.setCustomValidity('');
            return;
        }
        const ok = /^[\d\s+\-()]{7,20}$/.test(v);
        telefono.setCustomValidity(ok ? '' : 'Teléfono: solo números, espacios y + - ( ), entre 7 y 20 caracteres.');
    });

    form.addEventListener(
        'submit',
        function (e) {
            telefono.dispatchEvent(new Event('input'));
            email.dispatchEvent(new Event('input'));

            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.preventDefault();
                const datos = new FormData(form);
                const resumen = [];
                datos.forEach((val, key) => {
                    if (key !== 'acepto') resumen.push(`${key}: ${val}`);
                });
                alert('Formulario válido. Mensaje de demostración:\n\n' + resumen.join('\n'));
                form.reset();
                form.classList.remove('was-validated');
                email.setCustomValidity('');
                telefono.setCustomValidity('');
                return;
            }
            form.classList.add('was-validated');
        },
        false
    );
})();
