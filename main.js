const url = "http://127.0.0.1:8080"

function signUpForm() {
    let html = `<form id="signupform" onsubmit="submitSignupForm(event)" style="border:1px solid #ccc">
        <div class="container">
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
          <hr>
      
          <label for="email"><b>Email</b></label>
          <input type="text" placeholder="Enter Email" name="email" required>
      
          <label for="psw"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="psw" required>
      
          <label for="psw-repeat"><b>Repeat Password</b></label>
          <input type="password" placeholder="Repeat Password" name="psw-repeat" required>
          
          <p>By creating an account you agree to our <a href="#" style="color:dodgerblue">Terms & Privacy</a>.</p>
      
          <div class="clearfix">
            <button type="button" class="cancelbtn">Cancel</button>
            <button type="submit" class="signupbtn">Sign Up</button>
          </div>
        </div>
        
      </form>`
    document.getElementById("root").innerHTML = html
}

function submitSignupForm(event) {
    event.preventDefault()

    let form = document.getElementById("signupform").elements
    let data = {
        employeeEmail: form[0].value,
        employeePassword: form[1].value
    }

    let response = fetch(url + "/register", {method: "POST", mode: "no-cors", body: JSON.stringify(data)}).then(data => console.log(data))
    

}