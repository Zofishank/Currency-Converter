const input_form = document.querySelector("form");
const input_field = document.querySelector(".input");
const dropdownList = document.querySelectorAll(".c_names select");
const convert_btn = document.querySelector(".btn");
const from_curr = document.querySelector("#from");
const to_curr = document.querySelector("#to");
const result = document.querySelector(".result");
// const dropdownsDiv = document.querySelector(".c_names")


let input_amt = "NULL";
let fromCurr = from_curr.value;
let toCurr = to_curr.value;

const changeFlag = (e)=>{
   const currCode = e.value;
   const countryCode = countryList[currCode];
   console.log(countryCode);
   const new_src = `https://flagsapi.com/${countryCode}/flat/64.png`;
   const img = e.parentElement.querySelector("img");
   img.src=new_src;
}

// Populate dropdown lists with country codes
for (let select of dropdownList) {
    for (let currCode in countryList) {
        let newOptionTag = document.createElement("option");
        newOptionTag.innerText = currCode;
        newOptionTag.value = currCode;
        select.append(newOptionTag);
    }
    select.addEventListener("change",(e)=>{
        changeFlag(e.target);
    })
}

// Fetch exchange rate and convert the amount
async function fetchExchangeRate(e) {
    e.preventDefault();
    
    // Get current values from input and dropdowns
    let input_amt = input_field.value.trim();
    let fromCurr = from_curr.value;
    let toCurr = to_curr.value;

    // Validate user input
    if (!input_amt || isNaN(input_amt) || input_amt <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (fromCurr === toCurr) {
        alert("Please select different currencies for conversion");
        return;
    }

    // Disable button while fetching
    convert_btn.disabled = true;

    const access_key = "119d64c2c8d6251e31f413c59829f4ec";
    // Ensure that both currencies are included in the 'currencies' parameter
    const API_URL =` https://api.currencylayer.com/live?access_key=${access_key}&currencies=${fromCurr},${toCurr}&source=USD&format=1`;

    try {
        let response = await fetch(API_URL);
        let data = await response.json();

        if (data.success) {
            // Get the rates from the response
            const fromRate = data.quotes[`USD${fromCurr}`];
            const toRate = data.quotes[`USD${toCurr}`];

            // Check if both rates are available
            if (!fromRate || !toRate) {
                alert('Error: Could not find exchange rates for the selected currencies.');
                return;
            }

            // Convert from one currency to another
            const convertedAmount = (input_amt / fromRate) * toRate;

            // Display the converted amount
            result.innerText = convertedAmount.toFixed(2);
            console.log(convertedAmount.toFixed(2));
        } else {
            alert('Error fetching conversion rates: ' + data.error.info);
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while fetching exchange rates.");
    } finally {
        convert_btn.disabled = false; // Re-enable the button after fetching
    }

  
}


convert_btn.addEventListener("click", fetchExchangeRate);

