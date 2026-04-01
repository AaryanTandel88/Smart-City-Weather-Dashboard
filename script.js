const apiKey = "0bc288080dc934ef7eb7a8abf3616ba9"
const btn = document.getElementById('btn')
let area = "pune"
const place = document.getElementById('input_place')
const dataDisplay = document.getElementById('root')

btn.addEventListener('click', () => {
    area = place.value
    if (!area) return;

    place.value = ""

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${area}&appid=${apiKey}`;

    fetch(weatherUrl)
        .then((res) => {
            if (!res.ok) {
                throw new Error("couldn't fetch data")
            }
            return res.json()
        })
        .then((res) => {
            let keys = Object.keys(res)
            keys.forEach((el) => {
                if (el === "weather") {
                    for (let items in res[el][0]) {
                        console.log(`${items} ==> ${res[el][0][items]}`)
                        dataDisplay.innerHTML += `<p>${items} : ${res[el][0][items]}</p>`
                    }
                }
                else if (typeof (res[el]) === "object") {
                    for (let val in res[el]) {
                        console.log(`${val} ==> ${res[el][val]}`)
                        dataDisplay.innerHTML += `<p>${val} : ${res[el][val]}</p>`
                    }
                }
                else {
                    console.log(`${el} ==> ${res[el]}`)
                    dataDisplay.innerHTML += `<p>${el} : ${res[el]}</p>`
                }
            })
        })
        .catch(err => console.error("Error:", err))
})

place.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        btn.click()
    }
})
