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
    for (let rating=800; rating <= 4000; rating+=100) {
        problems.set(rating,0);
    }
    for (let user in data) {
        totalProblems++;
        let level = data[user].problem.rating;
        if (level === undefined) continue;
        if (problems.has(level) && data[user].verdict === 'OK') {
            let value = problems.get(level);
            problems.set(level, value+1);
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
        if (value != 0) string += `Difficulty ${key} (${value}) <progress value="${value}" max="${totalProblems}"></progress><br>`
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
    let averageProblemSolved = 0;
    let totalProblems = 0;
    for (let user in data) {
        if (data[user].verdict == 'OK' && data[user].problem.rating !== undefined) {
            averageProblemSolved += data[user].problem.rating;
            totalProblems++;
        }
    }
    url = `https://codeforces.com/api/user.rating?handle=${arg}`;
    response = await fetch(url);
    users = await response.json();
    ratingInfo = users.result;
    let highestRating = 0;
    let averageRatingChange = 0;
    let element = document.createElement('p');
    let string = "";
    let totalContests = ratingInfo.length;
    for (let i in ratingInfo) {
        highestRating = Math.max(highestRating, ratingInfo[i].newRating);
        if (i >= totalContests - 10) averageRatingChange += (ratingInfo[i].newRating - ratingInfo[i].oldRating);
    }
    element.style.fontSize = "20px";
    element.innerHTML = `
        Highest Rating: ${highestRating}<br>
        Average Rating Change: ${averageRatingChange/10}<br>
        Average Problem Solved: ${Math.round(averageProblemSolved/totalProblems)}<br>`;
    value1.appendChild(element);
}
