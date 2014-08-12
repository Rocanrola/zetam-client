var utils = require('./utils');

var locale = utils.getLocaleByHostname(location.hostname);

module.exports = {
    setLocale:function(newLocale){
        locale = newLocale;
    },
    validate: function(form) {
        var rules;
        var invalid = false;
        var validationMessages;
        var that = this;


        var i18n = {
            all: {
                required: "Este campo es obligatorio.",
                email: 'Este e-mail no es válido. Por favor, ingresa una dirección de e-mail válida.',
                lengths: 'Por favor escribe un valor entre $1 y $2 caracteres.',
                usernameformat: 'Sólo se permite utilizar letras, números y posteriormente los separadores (" ", "-" y "_").',
                formEducationInvalidDates: 'El período (fecha de inicio y finalización) seleccionado no es válido.',
                numberOrLetter: 'Sólo se permite utilizar números o letras.'
            },
            br: {
                required: 'Este campo á obrigatório.',
                email: 'Mail no válido: La dirección de mail no parece ser válida, por favor ingresala nuevamente.',
                lengths: 'Por favor escreva um valor entre $1 e $2 caracteres.',
                usernameformat: 'Só é permitido usar letras, números e posteriormente os separadores ("", "-" e "_").'
            }
        }

        var mergedI18n = {}
        i18n.merged = i18n.all;

        for (var i in i18n[locale]) {
            i18n.merged[i] = i18n[locale][i];
        }

        validationMessages = i18n.merged;

        // start rules 

        rules = {
            required: function(node) {
                if ((node.getAttribute('required') != null && utils.trim(node.value) == "")) {
                    return {
                        result: false,
                        message: node.getAttribute('data-required-error') || validationMessages.required
                    }
                } else {
                    return {
                        result: true
                    }
                }
            },
            email: function(node) {
                if ((node.getAttribute('type') == 'email' || node.getAttribute('data-ie-type') == 'email') && node.getAttribute('required') != null) {
                    var regexp = new RegExp(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/);

                    if (regexp.test(node.value)) {
                        return {
                            result: true
                        }
                    } else {
                        return {
                            result: false,
                            message: validationMessages.email
                        }
                    }
                }
            },
            lengths: function(node) {
                if (node.getAttribute('required') != null && node.getAttribute('minlength') != null &&
                    node.getAttribute('maxlength') != null) {

                    var minlength = parseInt(node.getAttribute('minlength'));
                    var maxlength = parseInt(node.getAttribute('maxlength'));

                    if (node.value.length < minlength || node.value.length > maxlength) {
                        return {
                            result: false,
                            message: validationMessages.lengths.replace('$1', minlength).replace('$2', maxlength)
                        }
                    } else {
                        return {
                            result: true
                        }
                    }
                }
            },
            usernameformat: function(node) {
                if (node.getAttribute('required') != null && node.getAttribute('data-valid') == 'usernameformat') {
                    var reg = new RegExp("^[a-zA-Z0-9ñÑ][a-zA-ZñÑ0-9\\._\\- ]*[a-zA-ZñÑ0-9]$")

                    if (!reg.test(node.value)) {
                        return {
                            result: false,
                            message: validationMessages.usernameformat
                        }
                    } else {
                        return {
                            result: true
                        }
                    }
                }
            },
            // TODO:Revisar!!!
            numberOrLetter: function(node) {
                if (node.getAttribute('numberOrLetter') != null && node.getAttribute('required') != null) {
                    var regexp = new RegExp(/^[A-Za-z0-9]+$/);

                    if (regexp.test(node.value)) {
                        return {
                            result: true
                        }
                    } else {
                        return {
                            result: false,
                            message: validationMessages.numberOrLetter
                        }
                    }
                }
            }
        }

        // end rules 

        function action(form) {
            // remove all span.error inside the form
            that.resetSpanErrors(form);

            var fields = form.querySelectorAll('input,textarea, select');


            for (var i = 0; i < fields.length; i++) {

                var field = fields[i];

                for (var r in rules) {

                    var validation = rules[r](field);

                    if (validation && validation.result == false) {

                        that.insertError(field, validation.message);

                        // remove span error at keyup
                        field.removeEventListener('keyup', that.removeError);
                        field.addEventListener('keyup', function(e) {
                            var charCode = e.which || e.keyCode;

                            if (charCode != 13)
                                that.removeError(this);
                        });


                        invalid = true;

                        break;
                    }
                }
            }

            return !invalid;

        }

        return action(form);
    },
    genericError: function(element, errorMessage) {
        var error = document.createElement('p');
        error.textContent = errorMessage;
        error.className = "error";
        element.parentNode.insertBefore(error, element.nextSibling);

        return error;
    },
    resetGenericErrors: function(form) {
        var errors = form.querySelectorAll('p.error');

        for (var i = 0; i < errors.length; i++) {
            utils.removeNode(errors[i]);
        }
    },
    insertError: function(element, errorMessage, isGroup) {
        var newSpan = this.createErrorSpan(errorMessage);
        if (isGroup) {
            newSpan.classList.add('group');
        }
        element.parentNode.insertBefore(newSpan, element.nextSibling);
    },
    resetSpanErrors: function(form) {
        var spans = form.querySelectorAll('[data-automatic="true"]');

        for (var i = 0; i < spans.length; i++) {
            utils.removeNode(spans[i]);
        }
    },
    createErrorSpan: function(mssg) {
        var errorSpan = document.createElement('span');
        // innerHTML es un polyfill? Porque dicen que en Firefox no es compatible.
        errorSpan.innerHTML = mssg;
        errorSpan.className = "error";
        errorSpan.setAttribute('data-automatic', 'true');

        return errorSpan;
    },
    removeError: function(element) {
        element = element || this;

        if (element.nextSibling &&
            element.nextSibling.tagName == 'SPAN' &&
            element.nextSibling.className == 'error') {

            utils.removeNode(element.nextSibling);
        }
    },
    isSubmitting: function(form, state) {
        if (state == undefined) {
            if (form.getAttribute('submitting') == 'true') {
                return true;
            } else {
                return false;
            }
        } else {
            if (form)
                form.setAttribute('submitting', state);
        }
    }
}