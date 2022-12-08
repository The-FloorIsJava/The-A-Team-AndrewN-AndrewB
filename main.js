const URL = "http://127.0.0.1:8080"

const ROOT = document.getElementById("root")
const MESSAGE = document.getElementById("message")


async function submitSignupForm(event) {
    event.preventDefault()

    let form = document.getElementById("signupform").elements
    let data = {
        employeeEmail: form[0].value,
        employeePassword: form[1].value
    }

    const res = await customFetch("/register","POST", data) // TODO
    if (res.successful) {
        let message = `<h3>Thank you for registering. Please login.</h3>`
        let root = ''
        rootAndMessage(root, message)
    } else {
        document.getElementById("error-message").innerHTML = "email is already in use."
    }

}

async function submitTicketForm(event) {
    event.preventDefault()

    let form = document.getElementById("ticketform").elements
    let data = {
        amount: form[0].value,
        requestType: form[1].value
    }

    const res = await customFetch("/employeetix","POST", data) // TODO
    if (res.successful) {
        let message = `<h3>Thank you for your request.</h3>`
        let root = ''
        rootAndMessage(root, message)
    } else {
        document.getElementById("error-message").innerHTML = "Ticket not created."
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
        let message = `<h3>Thank you for logging in!</h3>`
        let root = ''
        rootAndMessage(root, message)
        document.getElementById("nav").innerHTML = `<a href="javascript:void(0)" onclick="allTickets()" class="nav-link">Tickets</a>
            <a href="javascript:void(0)" onclick="ticketForm()" class="nav-link">Submit Request</a>`
        document.getElementById("auth").innerHTML = `<p class="navbar-text">Welcome ${res.body.employeeEmail}</p>
            <a class="nav-link" href="javascript:void(0)" onclick="logout()">Logout</a>`
    } else {
        document.getElementById("error-message").innerHTML = "Invalid credentials."
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
        let message = `<h3>Thank you for using our application.</h3>`
        let root = ''
        rootAndMessage(root, message)
        document.getElementById("auth").innerHTML = `<div id="auth" class="navbar-nav">
                        <a class="nav-link" href="javascript:void(0)" onclick="signUpForm()">Sign Up</a>
                        <a class="nav-link" href="javascript:void(0)" onclick="loginForm()">Login</a>
                    </div>`
        document.getElementById("nav").innerHTML = ''
    } 

}

async function allTickets() {

    const res = await customFetch("/employeetix","GET") // TODO
    if (res.successful) {
        let html = `<div class="btn-group m-2 d-flex justify-content-center" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light" onclick="pendingTickets()">Pending</button>
            <button type="button" class="btn btn-light" onclick="approvedTickets()">Approved</button>
            <button type="button" class="btn btn-light" onclick="deniedTickets()">Denied</button>
        </div>`
        html += `<table class="table table-dark table-striped m-2"><thead><tr><th>ID</th><th>Requester</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>`
        for (el of res.body) {
            html += `<tr><th>${el.ticketId}</th><td>${el.requester}</td><td>${el.requestType}</td><td>${el.amount}</td><td>${el.isTicketApproved}</td></tr>`
        }
        html += "</tbody></table>"
        let message = ``
        let root = html
        rootAndMessage(root, message)
    } else {
        document.getElementById("error-message").innerHTML = "invalid credentials."
    }

}

async function pendingTickets() {

    const res = await customFetch("/employeetix/pending","GET") // TODO
    if (res.successful) {
        let html = `<div class="btn-group m-2 d-flex justify-content-center" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light" onclick="allTickets()">All</button>
            <button type="button" class="btn btn-light" onclick="approvedTickets()">Approved</button>
            <button type="button" class="btn btn-light" onclick="deniedTickets()">Denied</button>
        </div>`
        html += `<table class="table table-dark table-striped m-2"><thead><tr><th>ID</th><th>Requester</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>`
        for (el of res.body) {
            html += `<tr><th>${el.ticketId}</th><td>${el.requester}</td><td>${el.requestType}</td><td>${el.amount}</td><td>${el.isTicketApproved}</td></tr>`
        }
        html += "</tbody></table>"
        let message = ``
        let root = html
        rootAndMessage(root, message)
    } else {
        document.getElementById("error-message").innerHTML = "invalid credentials."
    }

}
async function approvedTickets() {

    const res = await customFetch("/employeetix/approved","GET") // TODO
    if (res.successful) {
        let html = `<div class="btn-group m-2 d-flex justify-content-center" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light" onclick="allTickets()">All</button>
            <button type="button" class="btn btn-light" onclick="pendingTickets()">Pending</button>
            <button type="button" class="btn btn-light" onclick="deniedTickets()">Denied</button>
        </div>`
        html += `<table class="table table-dark table-striped m-2"><thead><tr><th>ID</th><th>Requester</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>`
        for (el of res.body) {
            html += `<tr><th>${el.ticketId}</th><td>${el.requester}</td><td>${el.requestType}</td><td>${el.amount}</td><td>${el.isTicketApproved}</td></tr>`
        }
        html += "</tbody></table>"
        let message = ``
        let root = html
        rootAndMessage(root, message)
    } else {
        document.getElementById("error-message").innerHTML = "invalid credentials."
    }

}
async function deniedTickets() {

    const res = await customFetch("/employeetix/denied","GET") // TODO
    if (res.successful) {
        let html = `<div class="btn-group m-2 d-flex justify-content-center" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light" onclick="allTickets()">All</button>
            <button type="button" class="btn btn-light" onclick="pendingTickets()">Pending</button>
            <button type="button" class="btn btn-light" onclick="approvedTickets()">Approved</button>
        </div>`
        html += `<table class="table table-dark table-striped m-2"><thead><tr><th>ID</th><th>Requester</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>`
        for (el of res.body) {
            html += `<tr><th>${el.ticketId}</th><td>${el.requester}</td><td>${el.requestType}</td><td>${el.amount}</td><td>${el.isTicketApproved}</td></tr>`
        }
        html += "</tbody></table>"
        let message = ``
        let root = html
        rootAndMessage(root, message)
    } else {
        document.getElementById("error-message").innerHTML = "invalid credentials."
    }

}


function signUpForm() {
    let root = `<form id="signupform" onsubmit="submitSignupForm(event)">
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
    let message = ``
    rootAndMessage(root, message)
}

function loginForm() {
    let root = `<form id="loginform" onsubmit="submitLoginForm(event)">
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
    let message = ``
    rootAndMessage(root, message)
}

function ticketForm() {
    let root = `<form id="ticketform" onsubmit="submitTicketForm(event)">
          <h1>Ticket Request</h1>
          <p>Please fill in this form to submit a reimbursement request.</p>
          <p id="error-message" class="text-danger"></p>
          <hr>
          
          <div class="input-group mb-3">
            <span class="input-group-text" id="amount">Amount</span>
            <input name="amount" type="number" class="form-control" placeholder="Enter Amount Here" aria-label="amount" aria-describedby="amount" required>
          </div>
          
          <div class="input-group mb-3">
            <span class="input-group-text" id="type">Type</span>
            <input name="type" type="text" class="form-control" placeholder="Enter Description" aria-label="type" aria-describedby="type" required>
          </div>
      
          <div class="clearfix">
            <button type="reset" class="btn btn-danger">Reset</button>
            <button type="submit" class="btn btn-success">Submit</button>
          </div>
      </form>`
    let message = ``
    rootAndMessage(root, message)
}

function rootAndMessage(root = '', message = '') {
    MESSAGE.innerHTML = message
    ROOT.innerHTML = root
}