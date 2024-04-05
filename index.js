document.addEventListener('DOMContentLoaded', () => {
    let error = document.querySelector("#Error");
    let responses = document.querySelector("#Responses");
    let route = document.querySelector("#Route");
    let method = document.querySelector("#Method");
    let baseUrl = document.querySelector("#Url");
    let reqBody = document.querySelector("#ReqBody");
    let history = document.querySelector("#History");
    let counter = document.querySelector("#Counter");

    baseUrl.value = localStorage.getItem('baseURL') || "";

    document.querySelector("#TestEndpoints").addEventListener('click', (e) => {
        Api(baseUrl.value, route.value);
    });

    document.addEventListener('keydown', (e) => {
        // if (e.key == "Enter") {
        //     Api(baseUrl.value, route.value);
        // }

        if (e.key == "Control") {
            if (method.value == "GET") {
                method.value = "POST";
                reqBody.style.display = "block";
            }
            else {
                method.value = "GET";
                reqBody.style.display = "none";
            }
        }
    });

    document.querySelector("#Clear").addEventListener('click', (e) => {
        responses.innerHTML = "";
        counter.textContent = "Resultats : 0";

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

        console.log(post);
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

        routeText.textContent += "Route : " + route.value;
        if (datas) {
            dataText.textContent += JSON.stringify(datas, null, 2);
        }
        else {
            dataText.textContent += "No Data Found";
        }
        responses.appendChild(responsesContent);
        responsesContent.appendChild(routeText);
        responsesContent.appendChild(dataText);
        counter.textContent = "Results : " + responses.childElementCount;
    }
});