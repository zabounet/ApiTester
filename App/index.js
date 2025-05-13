document.addEventListener('DOMContentLoaded', () => {
    let error = document.querySelector("#Error");
    let responses = document.querySelector("#Responses");
    let route = document.querySelector("#Route");
    let method = document.querySelector("#Method");
    let baseUrl = document.querySelector("#Url");
    let reqBody = document.querySelector("#ReqBody");
    let reqBodyBox = document.querySelector("#ReqBodyBox");
    let history = document.querySelector("#History");
    let counter = document.querySelector("#Counter");

    baseUrl.value = localStorage.getItem('baseURL') || "";

    document.querySelector("#TestEndpoints").addEventListener('click', (e) => {
        Api(baseUrl.value, route.value);
    });

    method.addEventListener('change', () => {
        console.log(method.value);

    })

    document.addEventListener('keydown', (e) => {
        if (e.key == "Control") {
            if (method.value == "GET") {
                method.value = "POST";
                reqBodyBox.style.display = "flex";
            }
            else {
                method.value = "GET";
                reqBodyBox.style.display = "none";
            }
        }
        if(e.key == "Enter"){
            Api(baseUrl.value, route.value);
        }
    });

    method.addEventListener('change', () => {
        switch (method.value) {
            case "GET":
                reqBodyBox.style.display = "none";
                break;
            case "POST":
                reqBodyBox.style.display = "flex";
                break;
            default:
                break;
        }
    })
    document.querySelector("#Clear").addEventListener('click', (e) => {
        responses.innerHTML = "";
        counter.textContent = "Resultats : 0";
        history.innerHTML = "";
    });

    function Api(url, route) {
        // Save the base URL for convenience
        localStorage.setItem('baseURL', url);

        // Format the request body
        if (method.value !== "POST") {
            reqBody.value.replace(`'`, `"`)
        }

        // Prepare the options for the fetch
        const post =
            method.value == "POST" ? {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: reqBody.value !== "" ? JSON.parse(reqBody.value) : {}
            } : {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

        // Reset the error message
        error.textContent = "";

        let reqStatus;
        try {
            fetch(`${url}${route}`, post)
                .then(response => response.json())
                .then(datas => {
                    reqStatus = "OK"
                    displayDatas(datas);
                })
                .catch(err => {
                    reqStatus = "FAILED"
                    error.textContent = `Error for route '${url}${route}' : ${err}`;
                })
                .finally(() => {
                    let historyElement = document.createElement('p');
                    historyElement.innerHTML += method.value + " " + url + route + " " + reqStatus + "<br>";
                    if (reqStatus == "OK")
                        historyElement.style.color = "#18b963";
                    else
                        historyElement.style.color = "#FF0000";

                    history.appendChild(historyElement);
                    if (history.childElementCount > 10)
                        history.removeChild(history.firstChild);
                });
        } catch (err) {
            console.error(err);
            error.textContent = `Error : ${err}`;
        }

    }

    function displayDatas(datas) {
        let responsesContent = document.createElement('div');
        let routeText = document.createElement('h3');
        let dataText = document.createElement('pre');

        routeText.innerHTML = "URL : " + baseUrl.value + " <br> Route : " + route.value;

        if (datas) {
            dataText.innerHTML = syntaxHighlight(datas); // Use innerHTML for styled output
        } else {
            dataText.textContent = "No Data Found";
        }

        responsesContent.appendChild(routeText);
        responsesContent.appendChild(dataText);
        responses.appendChild(responsesContent);
        counter.textContent = "Results : " + responses.childElementCount;
    }

    function syntaxHighlight(json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, 2);
        }

        json = json.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/g, match => {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return `<span class="${cls}">${match}</span>`;
        });
    }

});