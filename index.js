let search = document.getElementById('search');
let i = 1;

// Functionality to alert the user if the username entered is invalid

search.addEventListener('click',(event) => {
    event.preventDefault();
    let sValue = document.getElementById('sValue');
    fetchProblemList(sValue.value, i);
    impDetails(sValue.value);
    sValue.value = "";
    if (i==1) i = 3;
    else i = 1;
});

async function fetchProblemList(arg, i) {
    let url = `https://codeforces.com/api/user.status?handle=${arg}`;
    const response = await fetch(url);
    if (response.status != 200) return;
    const users = await response.json();
    const data = users.result;
    const problems = new Map();
    let totalProblems = 0;
    problems.set('A',0);
    problems.set('B',0);
    problems.set('C',0);
    problems.set('D',0);
    problems.set('E',0);
    problems.set('F',0);
    problems.set('G',0);
    problems.set('H',0);
    problems.set('I',0);
    for (let user in data) {
        totalProblems++;
        let level = data[user].problem.index[0];
        if (problems.has(level) && data[user].verdict === 'OK') {
            let value = problems.get(level);
            problems.set(level, value+1);
        }
        else if (data[user].verdict === 'OK') {
            problems.set(level, 1);
        }
    }
    let value1 = document.getElementById(`value${i}`);
    let heading = document.createElement('h2');
    heading.style = 'container-fluid';
    heading.style.textDecoration = 'underline';
    heading.innerText = `Problems Solved (${arg})`;
    value1.appendChild(heading);
    heading = document.createElement('p');
    heading.style.marginTop = "15px";
    heading.style.fontSize = "20px";
    let string = "";
    problems.forEach((value, key) => {
        if (value != 0) string += `Problem ${key} (${value}) <progress value="${value}" max="${totalProblems}"></progress><br>`
    });
    heading.innerHTML = string;
    value1.appendChild(heading);
}

async function impDetails(arg) {
    let url = `https://codeforces.com/api/user.status?handle=${arg}`;
    let response = await fetch(url);
    if (response.status != 200) return;
    let users = await response.json();
    const data = users.result;
    let value1 = document.getElementById('value2');
    let heading = document.createElement('h2');
    heading.style = 'container-fluid';
    heading.style.textDecoration = 'underline';
    heading.innerText = `${arg}`;
    value1.appendChild(heading);
    url = `https://codeforces.com/api/user.rating?handle=${arg}`;
    response = await fetch(url);
    users = await response.json();
    ratingInfo = users.result;
    let highestRating = 0;

    let element = document.createElement('p');
    let string = "";
    for (let i in ratingInfo) {
        highestRating = Math.max(highestRating, ratingInfo[i].newRating);
    }
    element.innerHTML = `Highest Rating: ${highestRating}`;
    value1.appendChild(element);
}
