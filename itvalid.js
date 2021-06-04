'use strict';
module.exports = valid = {

    object: (validation, exact) => value => {
        let ok = !!value && typeof value === 'object';
        console.log('validate object');
        if (ok && !!validation && typeof validation === 'object') {
            let keys = !!exact ? Object.keys(value) : Object.keys(validation);
            keys.forEach(key => {
                ok = ok && valid.function()(validation[key]) && validation[key](value[key]);
                console.log(key, ':', value[key], valid.function()(validation[key]) && validation[key](value[key]) ? '\// valid' : '\// invalid');
            });
        }
        console.log(ok);
        
        // TODO: return await hydra.approve(ok)
        return ok;
    },

    number: (min, max) => value => {
        let ok = (typeof value === 'number');
        if (ok) {
            if (typeof min === 'number') {
                if (typeof max === 'number') {
                    ok = (value >= min && value <= max);
                } else {
                    ok = (value === min);
                }
            }
        }
        return ok;
    },

    numerical: (min, max) => value => {
        let ok = (valid.number()(value) || (valid.string()(value) && value));
        if (ok) {
            ok = valid.number(min, max)(Number(value));
        }
        return ok;
    },

    string: (pattern, to) => value => {
        let ok = (typeof value === 'string');
        if (ok) {
            if (typeof pattern === 'string') {
                ok = (value === pattern);
            } else if (valid.number()(pattern)) {
                if (valid.number()(to)) {
                    ok = (value.length >= pattern && value.length <= to);
                } else {
                    ok = (value.length === pattern);
                }
            } else if (pattern instanceof RegExp) {
                ok = pattern.test(value);
            }
        }
        return ok;
    },

    array: validator => value => {
        let ok = (value instanceof Array);
        if (ok && !!validator && valid.function()(validator)) {
            value.forEach((member, index) => ok = ok && validator(member, index));
        }
        return ok;
    },

    regExp: pattern => value => {
        let ok = !!value && (value instanceof RegExp);
        if(ok && !!pattern){
            if(pattern instanceof RegExp){
                ok = pattern.toString() === value.toString();
            } else if(valid.string(/^[mig]{1,3}$/)(pattern)){
                ok = ok
                    && (/m/.test(pattern) ? value.multiline : true)
                    && (/i/.test(pattern) ? value.ignoreCase : true)
                    && (/g/.test(pattern) ? value.global : true);
            } else if(valid.string()(pattern)){
                ok = pattern === value.source;
            }
        }
        return ok;
    },

    oneFrom: validators => value => {
        let ok = !!validators && (validators instanceof Array);
        let OK = false;
        if (ok) {
            validators.forEach(validator => OK = OK || validator(value));
            ok = OK;
        };
        return ok;
    },

    validation: value => {
        let ok = !!value && typeof value === 'object';
        if(ok && valid.object()(value)){
            Object.keys(value).forEach(key => {
                ok = !!value && valid.function()(value[key]);
            });
        }
        return ok;
    },

    instanceof: (type, validation) => value => {
        let ok = !!value && (value instanceof type);
        if(ok && !!validation && valid.validation(validation)){
            ok = valid.object(validation)(value);
        }
        return ok;
    },

    function: name => value => {
        let ok = !!value && (value instanceof Function) && (!!name ? value.name === name : true );
        return ok;
    }
};

valid.object.exact = validation => valid.object(validation, true);


// validRegisterForm = valid.object({
//     login: valid.string(/[a-z]+/i),
//     password: valid.string(/[a-z\d]+/i),
//     userData: valid.object({
//         age: valid.numerical(20, 82),
//         role: valid.instanceof(UserRole),
//         friends: valid.array([
//             valid.oneFrom(
//                 valid.object({
//                     id: valid.string(/[a-f\d]+/i)
//                 }),
//                 valid.array([valid.string(/[a-f\d]+/i)])
//             )
//         ])
//     })
// })

// data = {
//     login: 'Vasya',
//     password: '123qwe',
//     userData: {
//         age: '33'
//     }
// }

// if(valid.validation(validRegisterForm))

// if(validRegisterForm(data))
