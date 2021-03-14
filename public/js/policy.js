new Selectr('#preferredBC', {
    multiple: true,
    customClass: "preferredBC-style",
    width: '69%',
    placeholder: 'Choose your preferred blockchain implementations'
});

function savePolicy(data) {
    superagent
        .post('/api/policies')
        .set('accept', 'json')
        .send(data)
        .end(function (err, res) {
            if (err) {
                console.log(res);
                const errorDiv = document.querySelector('#error');
                errorDiv.innerHTML = 'ERROR: ' + res.body.message;
                window.scrollTo(0, 0);
                return errorDiv.style.display = 'block';
            } else {
                window.location.replace("/policies/" + data.username);
            }
        });
}

function validateForm(data) {
    console.log(data);
    const errors = [];
    if (!data.username) {
        errors.push('Please provide a username');
    }

    if (!data.bcType) {
        errors.push('Please provide a blockchain type');
    }

    if (!data.cost && data.interval !== 'default') {
        errors.push('Please provide a max. cost');
    }

    if (!data.interval && data.interval !== 'default') {
        errors.push('Please provide a cost interval');
    }

    return errors;
}

function buildErrorString(errors) {
    let errorString = '';
    errors.forEach(function (error) {
        errorString += '<li>' + error + '</li>';
    });
    return errorString;
}

function submitPolicy(id) {
    const form = document.querySelector(id);
    const jsonFormData = toJSON(form);
    if (typeof jsonFormData.preferredBC === "string") {
        // Back-end expects array of strings
        jsonFormData.preferredBC = [jsonFormData.preferredBC];
    }
    const errors = validateForm(jsonFormData);
    if (errors.length > 0) {
        document.querySelector('#error').innerHTML = 'ERROR: ' + '<ul>' + buildErrorString(errors) + '</ul>';
        return document.querySelector('#error').style.display = 'block';
    } else {
        document.querySelector('#error').style.display = 'none';
    }
    savePolicy(jsonFormData);
}


document.querySelector('#submit-policy-form').addEventListener("click", function (e) {
    e.preventDefault();
    submitPolicy('#policy-form');
}, false);

function getMultiSelectValues(element) {
    const value = [];
    let opt;
    let options = element.options;
    for (let j = 0; j < options.length; j++) {
        opt = options[j];
        if (opt.selected) {
            value.push(opt.value || opt.text);
        }
    }

    return value;
}

function toJSON(form) {
    const obj = {};
    const elements = form.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
        let element = elements[i];
        let name = element.name;
        let value;
        if (element.multiple) {
            value = getMultiSelectValues(element);
        } else if (element.type === 'radio') {
            if (element.checked) {
                value = element.value;
            }
        } else {
            value = element.value;
        }
        if (name && !obj[name]) {
            obj[name] = value;
        }
    }

    return obj;
}

//Rati ML button in policy form


document.querySelector('.extended-button-rati').addEventListener("click", function (e) {
    var to_extended_features = document.getElementsByClassName('extended-form-rati');
    var to_hide_features = document.getElementsByClassName('condensed-form-rati');
    var isHidden = true;
    for (let i = 0; i < to_extended_features.length; ++i) {
        if (to_extended_features[i].style.display === "none") {
            to_extended_features[i].style.display = "block";
            var e = to_extended_features[i].querySelectorAll(".label");
            e[0].style.color = "green";

            isHidden = false;
            

        } else {
            to_extended_features[i].style.display = "none";
            isHidden = true;
        }      
    }

    if(isHidden){
        document.querySelector('input[name=useMachineLearning').value = "false";
        for (let i = 0; i < to_hide_features.length; ++i) {
            to_hide_features[i].style.display = "block";
        }
        

    }else{
        document.querySelector('input[name=useMachineLearning]').value = "true";
        //disable features not necessary for machine learning model
        document.querySelector('select[name=bcTps').disabled = true;
        document.querySelector('select[name=bcBlockTime').disabled = true;
        for (let i = 0; i < to_hide_features.length; ++i) {
            to_hide_features[i].style.display = "none";
        }
        document.querySelector("input[value=indifferent]").disabled = true;
        console.log(document.querySelector("input[value=indifferent]"))
        console.log(document.querySelector('select[name=bcTps]'));
        console.log(document.querySelector('input[name=useMachineLearning'));
    }
}, false);



