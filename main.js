const URL = "http://127.0.0.1:8080"

const ROOT = document.getElementById("root")

function signUpForm() {
     ROOT.innerHTML = `<form id="signupform" onsubmit="submitSignupForm(event)">
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
          <hr>
          
          <div class="input-group mb-3">
            <span class="input-group-text" id="email">Email</span>
            <input name="email" type="text" class="form-control" placeholder="Enter Email Here" aria-label="email" aria-describedby="email" required>
          </div>
          
          <div class="input-group mb-3">
            <span class="input-group-text" id="password1">Password</span>
            <input name="password1" type="password" class="form-control" placeholder="Enter Password" aria-label="password1" aria-describedby="password1" required>
          </div>
          
          <div class="input-group mb-3">
            <span class="input-group-text" id="password2">Password</span>
            <input name="password2" type="password" class="form-control" placeholder="Repeat Password" aria-label="password2" aria-describedby="password2" required>
          </div>
          
          <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>
      
          <div class="clearfix">
            <button type="reset" class="btn btn-danger">Cancel</button>
            <button type="submit" class="btn btn-success">Sign Up</button>
          </div>
      </form>`
}

async function submitSignupForm(event) {
    event.preventDefault()

    let form = document.getElementById("signupform").elements
    let data = {
        employeeEmail: form[0].value,
        employeePassword: form[1].value
    }

    // let response = fetch(URL + "/register", {method: "POST", mode: "cors", body: JSON.stringify(data)})
    //     .then(response => console.log(response))
    //     .catch(error => console.log(error))

    console.log( await customFetch("/register", data)) // TODO
    ROOT.innerHTML = `<h3>Thank you for registering</h3>`
}

async function customFetch(url="", data={}) {
    try {
        const response = await fetch(URL + url, {method: "POST", mode: "cors", body: JSON.stringify(data)})

        const result = {
            successful: response.ok,
            headers: await response.headers,
        };

        if (result.successful) result.body = await response.json();
        else result.body = {}

        return result

    } catch (e) {
        console.error(e)
    }
}