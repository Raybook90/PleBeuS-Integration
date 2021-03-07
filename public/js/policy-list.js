if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

function deletePolicy(id) {
    superagent
        .delete('/api/policy/' + id)
        .set('accept', 'json')
        .end(function (err, res) {
            if (err) {
                console.log(err);
                const errorDiv = document.querySelector('#error');
                errorDiv.innerHTML = 'ERROR: ' + res.body.message;
                window.scrollTo(0, 0);
                return errorDiv.style.display = 'block';
            } else {
                console.log(res);
                window.location.replace("/policies/" + res.body.username);
            }
        });
}

const deletePolicyElements = document.querySelectorAll('.delete-button');
deletePolicyElements.forEach(function (element) {
    element.addEventListener("click", function () {
        deletePolicy(element.value);
    }, false);
});