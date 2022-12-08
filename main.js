const URL = "http://127.0.0.1:8080"

const ROOT = document.getElementById("root")



async function submitSignupForm(event) {
    event.preventDefault()

    let form = document.getElementById("signupform").elements
    let data = {
        employeeEmail: form[0].value,
        employeePassword: form[1].value
    }

    const res = await customFetch("/register","POST", data) // TODO
    if (res.successful) {
        ROOT.innerHTML = `<h3>Thank you for registering. Please login.</h3>`
    } else {
        document.getElementById("error-message").innerHTML = "email is already in use."
    }

}

async function submitLoginForm(event) {
    event.preventDefault()

    let form = document.getElementById("loginform").elements
    let data = {
        employeeEmail: form[0].value,
        employeePassword: form[1].value
    }

    const res = await customFetch("/login","POST", data) // TODO
    if (res.successful) {
        window.localStorage.setItem("token", res.authorization)
        ROOT.innerHTML = `<h3>Thank you for logging in</h3>
<a href="javascript:void(0)" onclick="allTickets()">all tickets</a>`
        document.getElementById("auth").innerHTML = `<p class="navbar-text">Welcome ${res.body.employeeEmail}</p>
<a class="nav-link" href="javascript:void(0)" onclick="logout()">Logout</a>`
    } else {
        document.getElementById("error-message").innerHTML = "invalid credentials."
    }

}



async function customFetch(url="",method="POST", data={}) {
    try {
        let token = window.localStorage.getItem("token")
        let response;
        if (method === "GET") {
            response = await fetch(URL + url, {method: method, mode: "cors", headers: {Authorization: token}})
        } else {
            response = await fetch(URL + url, {method: method, mode: "cors", headers: {Authorization: token}, body: JSON.stringify(data)})
        }

        console.log(...response.headers)
        const result = {
            successful: response.ok,
            authorization: response.headers.get("authorization"),
        };

        if (result.successful && method !== "DELETE") result.body = await response.json();
        else result.body = {}
        console.log(result)

        return result

    } catch (e) {
        console.error(e)
    }
}

async function logout() {

    const res = await customFetch("/logout","DELETE") // TODO
    if (res.successful) {
        window.localStorage.setItem("token", "")
        ROOT.innerHTML = `<h3>Thank you for using our application.</h3>`
        document.getElementById("auth").innerHTML = `<div id="auth" class="navbar-nav">
                        <a class="nav-link" href="javascript:void(0)" onclick="signUpForm()">Sign Up</a>
                        <a class="nav-link" href="javascript:void(0)" onclick="loginForm()">Login</a>
                    </div>`
    } else {
        document.getElementById("error-message").innerHTML = "invalid credentials."
    }

}

async function allTickets() {

    const res = await customFetch("/employeetix","GET") // TODO
    if (res.successful) {
        let html = "<ul>"
        for (el of res.body) {
            html += `<li>${el.amount}, ${el.ticketId}, ${el.requestType}, ${el.isTicketApproved}, ${el.requester}</li>`
        }
        html += "</ul>"
        ROOT.innerHTML = html
    } else {
        document.getElementById("error-message").innerHTML = "invalid credentials."
    }

}

function signUpForm() {
    ROOT.innerHTML = `<form id="signupform" onsubmit="submitSignupForm(event)">
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
          <p id="error-message" class="text-danger"></p>
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

function loginForm() {
    ROOT.innerHTML = `<form id="loginform" onsubmit="submitLoginForm(event)">
          <h1>Login</h1>
          <p>Please fill in this form to log in.</p>
          <p id="error-message" class="text-danger"></p>
          <hr>
          
          <div class="input-group mb-3">
            <span class="input-group-text" id="email">Email</span>
            <input name="email" type="text" class="form-control" placeholder="Enter Email Here" aria-label="email" aria-describedby="email" required>
          </div>
          
          <div class="input-group mb-3">
            <span class="input-group-text" id="password1">Password</span>
            <input name="password1" type="password" class="form-control" placeholder="Enter Password" aria-label="password1" aria-describedby="password1" required>
          </div>
      
          <div class="clearfix">
            <button type="reset" class="btn btn-danger">Reset</button>
            <button type="submit" class="btn btn-success">Login</button>
          </div>
      </form>`
}